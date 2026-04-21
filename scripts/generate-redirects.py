"""
URL 分類與 301 對照表產生器

輸入：GSC 匯出的 811 個舊 URL（gsc-urls.json）
輸出：Cloudflare Pages 格式的 _redirects 檔

分類策略：
  1. 服務類別頁（/道路用地買賣 等）→ 對應的新服務頁
  2. 文章頁（/f/X、/首頁/f/X）→ 根據標題關鍵字分派到最相關服務頁
  3. 其他無法分類的 → 導向 blog 首頁

未來第二階段：每救回一篇舊文章，就把那條 301 改為直接指向新文章 URL。
"""

import json
import re
from urllib.parse import quote, unquote, urlparse


# ====== 分類規則 ======
# 按優先順序排列（高特異性在前，低特異性在後）
# 格式：(關鍵字列表, 新 URL)

CATEGORY_RULES = [
    # 三七五租約（含「減租」「375」）
    (
        ['三七五', '375', '減租', '租約', '耕地租佃', '佃農'],
        '/services/tenancy-375/',
    ),
    # 容積移轉
    (
        ['容積移轉', '容積率', '送出基地', '接受基地', '容積代金'],
        '/services/floor-area-ratio/',
    ),
    # 公同共有（優先於持分，更特異）
    (
        ['公同共有', '公同', '派下員'],
        '/services/joint-ownership/',
    ),
    # 祭祀公業
    (
        ['祭祀公業', '派下員', '神明會', '祭田', '公業'],
        '/services/ancestral-land/',
    ),
    # 持分土地 / 共有
    (
        ['持分', '共有', '分別共有', '持份', '應有部分', '鑑界'],
        '/services/co-ownership/',
    ),
    # 重劃地
    (
        ['重劃', '區段徵收', '市地重劃', '農地重劃'],
        '/services/rezoning-land/',
    ),
    # 兩岸、日據繼承
    (
        ['兩岸', '大陸繼承', '日據繼承', '日治', '繼承大陸', '港澳'],
        '/services/cross-strait-inheritance/',
    ),
    # 道路用地（很多子類都可以導到這裡）
    (
        [
            '道路用地', '既成道路', '計畫道路', '公設保留地',
            '公共設施保留地', '馬路', '巷道', '公告現值',
            '徵收', '容積獎勵', '私設道路', '都市計畫道路',
            '道路', '用地',
        ],
        '/services/road-land/',
    ),
    # 浮覆地
    (
        ['浮覆地', '浮覆'],
        '/services/road-land/',  # 沒有獨立服務頁，歸類到道路相關
    ),
    # 農地農舍（沒有服務頁，導到 blog 分類）
    (
        ['農地', '農舍', '自地自建', '耕地'],
        '/blog/?cat=farmland',
    ),
    # 未辦繼承
    (
        ['未辦繼承', '逾期繼承', '繼承登記'],
        '/blog/?cat=inheritance',
    ),
    # 地籍清理
    (
        ['地籍清理', '未保存登記', '總登記', '地址不全', '地上權', '建築套繪'],
        '/blog/',
    ),
    # 稅務
    (
        ['地價稅', '贈與稅', '遺產稅', '土地稅', '補稅'],
        '/blog/',
    ),
    # 土地買賣通用
    (
        ['土地買賣', '土地過戶', '蓋房子', '蓋民宿', '建地', '土地', '綠地'],
        '/services/co-ownership/',
    ),
]

# 單層中文路徑（服務頁）→ 新服務頁，精確對應
SERVICE_EXACT_MAP = {
    '/道路用地買賣': '/services/road-land/',
    '/容積移轉代辦': '/services/floor-area-ratio/',
    '/三七五租約解約': '/services/tenancy-375/',
    '/持份土地買賣、租賃': '/services/co-ownership/',
    '/公同共有處理': '/services/joint-ownership/',
    '/祭祀公業': '/services/ancestral-land/',
    '/重劃地買賣': '/services/rezoning-land/',
    '/兩岸三地繼承': '/services/cross-strait-inheritance/',
    # 舊的 + 周邊路徑也一起吸收
    '/公同共有': '/services/joint-ownership/',
    '/未辦繼承': '/blog/?cat=inheritance',
    '/未辦繼承處理': '/blog/?cat=inheritance',
    '/日據繼承': '/services/cross-strait-inheritance/',
    '/浮覆地復權': '/services/road-land/',
    '/地籍清理': '/blog/',
    '/各種超困難案件處理': '/services/',
    '/各種持份土地買賣': '/services/co-ownership/',
    '/與我們聯絡': '/contact/',
    '/聯絡我們': '/contact/',
    '/關於我們': '/about/',
    '/我們的陣容-1': '/about/',
    '/首頁': '/',
}


def classify_article(title: str) -> str:
    """根據文章標題判斷最相關的目標 URL"""
    for keywords, target in CATEGORY_RULES:
        for kw in keywords:
            if kw in title:
                return target
    return '/blog/'  # 保底


def generate_redirects(gsc_urls_path: str, output_path: str) -> dict:
    """產生 Cloudflare Pages _redirects 檔案，並回傳統計資訊"""

    with open(gsc_urls_path, 'r', encoding='utf-8') as f:
        urls = json.load(f)

    lines = [
        '# ==========================================',
        '# 寶璣建設 301 轉址規則',
        '# 基於 Google Search Console 匯出的 811 個舊 URL',
        '# Cloudflare Pages _redirects 格式',
        '# 格式：<舊路徑> <新路徑> <狀態碼>',
        '# ==========================================',
        '',
        '# ---- 首頁 ----',
    ]

    # 用 dict 去重（同一舊 URL 出現多次時保留最後一條）
    redirects_map = {}
    stats = {
        'service_exact': 0,
        'article_classified': 0,
        'homepage': 0,
        'by_target': {},
    }

    for u in urls:
        decoded_path = u['path_decoded'].rstrip('/')
        encoded_path = u['url'].replace('https://bqfox.com', '').rstrip('/')
        clicks = u['clicks']

        # 1. 首頁
        if decoded_path in ('', '/'):
            # 同網域首頁不需 redirect（本來就對應）
            stats['homepage'] += 1
            continue

        # 2. 服務類別頁（exact match）
        if decoded_path in SERVICE_EXACT_MAP:
            target = SERVICE_EXACT_MAP[decoded_path]
            redirects_map[encoded_path] = (target, clicks)
            stats['service_exact'] += 1
            stats['by_target'][target] = stats['by_target'].get(target, 0) + 1
            continue

        # 3. 文章頁：/f/X 或 /首頁/f/X
        article_title = None
        if decoded_path.startswith('/首頁/f/'):
            article_title = decoded_path[len('/首頁/f/'):]
        elif decoded_path.startswith('/f/'):
            article_title = decoded_path[len('/f/'):]

        if article_title:
            target = classify_article(article_title)
            redirects_map[encoded_path] = (target, clicks)
            stats['article_classified'] += 1
            stats['by_target'][target] = stats['by_target'].get(target, 0) + 1
            continue

        # 4. 其他（多層路徑等）→ 保底
        redirects_map[encoded_path] = ('/blog/', clicks)
        stats['by_target']['/blog/'] = stats['by_target'].get('/blog/', 0) + 1

    # 排序：按流量高低，讓高流量的 URL 先做（視覺好找）
    sorted_redirects = sorted(
        redirects_map.items(), key=lambda x: -x[1][1]
    )

    # === 產生規則 ===
    lines.append('')
    lines.append('# ---- 服務類別頁精確對應（高流量優先）----')
    service_lines = []
    article_lines = []

    for old_path, (target, clicks) in sorted_redirects:
        decoded_path = unquote(old_path)
        is_service = decoded_path in SERVICE_EXACT_MAP

        # 每一行：舊路徑 新路徑 狀態碼
        # Cloudflare Pages 的 _redirects 不需要 URL encode，用原始字串即可
        line = f"{decoded_path}  {target}  301"
        # 加上流量註記方便人工審查
        if clicks > 0:
            line += f"  # {clicks} clicks"

        if is_service:
            service_lines.append(line)
        else:
            article_lines.append(line)

    lines.extend(service_lines)
    lines.append('')
    lines.append('# ---- 文章頁（/f/X、/首頁/f/X）按關鍵字分類 301 ----')
    lines.extend(article_lines)

    # === catch-all 保底規則 ===
    lines.append('')
    lines.append('# ---- Catch-All 保底規則 ----')
    lines.append('# 萬一有漏網之魚，分別導到 blog 首頁')
    lines.append('/首頁/f/*  /blog/  301')
    lines.append('/f/*  /blog/  301')
    lines.append('/首頁  /  301')

    # 阻擋 workers.dev / pages.dev 被索引（Cloudflare Pages 要特別處理）
    lines.append('')
    lines.append('# ---- 阻擋預覽網域被爬（放在最上層才會生效）----')
    lines.append('# Note: 此規則建議搭配 Cloudflare Dashboard 的 Page Rules 處理')

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines) + '\n')

    return stats


if __name__ == '__main__':
    stats = generate_redirects(
        '/home/claude/bqfox-v3/docs/gsc-urls.json',
        '/home/claude/bqfox-v3/public/_redirects',
    )
    print(f"✅ _redirects 已產出")
    print(f"  - 服務頁精確對應：{stats['service_exact']} 條")
    print(f"  - 文章頁分類對應：{stats['article_classified']} 條")
    print(f"  - 首頁（不需轉）：{stats['homepage']} 條")
    print(f"\n目標分佈：")
    for target, count in sorted(stats['by_target'].items(), key=lambda x: -x[1]):
        print(f"  {target}：{count} 條")
