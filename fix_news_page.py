import re

# Read reference file (about/index.html) which has the correct V3 header
with open(r'd:\uchenab project\uchenab-v4\about\index.html', 'r', encoding='utf-8') as f:
    ref = f.read()

# Extract from <div aria-hidden to just before <main
# This captures the topbar utility bar, header nav, and mobile offcanvas
body_start = ref.index('<body')
main_start = ref.index('<main id="main">')
nav_block = ref[ref.index('<div aria-hidden="true" class="u3-progress">', body_start):main_start]

# Fix paths: about/ uses ../ which is correct for news/ as well (same depth)
# news/index.html is at same depth as about/index.html so paths are identical

# Read the news page
with open(r'd:\uchenab project\uchenab-v4\news\index.html', 'r', encoding='utf-8') as f:
    news = f.read()

# Find old header section in news page (from <body> to the hero section)
news_body_start = news.index('<body>')
news_hero_start = news.index('<!-- ============ HERO ============ -->')

# Replace old nav with new V3 nav block
new_news = news[:news_body_start + len('<body>')] + '\n' + nav_block + '\n  ' + news[news_hero_start:]

# Also fix the CSS includes: add home-v3.css after header-v3 and add uc3 body class
new_news = new_news.replace('<body>', '<body class="uc3">')

# Make sure home-v3.css is included
if 'home-v3.css' not in new_news:
    new_news = new_news.replace(
        '<link href="../assets/css/header-v3.css" rel="stylesheet" />',
        '<link href="../assets/css/header-v3.css" rel="stylesheet" />\n  <link href="../assets/css/home-v3.css" rel="stylesheet" />'
    )

# Also add missing home-v3 JS
if 'home-v2.js' not in new_news:
    new_news = new_news.replace(
        '<script src="../assets/js/main.js"></script>',
        '<script src="../assets/js/main.js"></script>\n  <script src="../assets/js/home-v2.js"></script>'
    )

# Fix the hero section style - remove v3-news-page-hero class incompatibility
# The hero is already styled inline so it should be fine

with open(r'd:\uchenab project\uchenab-v4\news\index.html', 'w', encoding='utf-8') as f:
    f.write(new_news)

print("Done! News page updated.")
print(f"New file size: {len(new_news)} bytes")
