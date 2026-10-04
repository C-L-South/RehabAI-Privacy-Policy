#!/usr/bin/env python3
"""Generate static search metadata; supply the verified URL before deployment."""
import argparse
import html
import json
import re
from pathlib import Path
from urllib.parse import urlparse, urljoin
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
PAGES = {
    'index.html': ('RehabAI — Home Exercise Guidance & Progress Tracking', 'RehabAI is a home exercise app with an exercise library, camera movement tracking, spoken setup instructions, and session score and repetition charts.'),
    'password-guidance-update.html': ('RehabAI Update — Password Controls & Clearer Instructions', 'RehabAI adds a show-or-hide password button and logout confirmation, with clearer setup instructions and an easier-to-understand disclaimer.'),
    'blog.html': ('RehabAI Updates & Release Notes', 'Read RehabAI release notes and app updates, including improvements to exercise guidance, connectivity feedback, and spoken instructions.'),
    'first-release.html': ('RehabAI First Release — September 20, 2026', 'Explore the first RehabAI release: the exercise library, camera setup guidance, spoken instructions, movement feedback, and session progress charts.'),
    'connectivity-audio-update.html': ('RehabAI Update — Connection Errors & Audio Improvements', 'Read the September 29, 2026 RehabAI update: clearer no-internet feedback and a consistent starting volume of 60% for spoken exercise instructions.'),
    'privacy.html': ('RehabAI Privacy Policy', 'Read the RehabAI privacy policy, including information about data collection, use, retention, and how to contact support about your information.'),
    'erasure.html': ('RehabAI Data Deletion & Erasure Requests', 'Learn how to request deletion of RehabAI personal data through the request form or support email, and how the manual review process works.'),
    'what-is-rehabai.html': ('What Is RehabAI? Exercise App Features Explained', 'Learn about RehabAI’s exercise library, setup guidance, motion tracking, session feedback, and progress screens for home exercise.'),
}
# The owner removed the app-introduction article from the public navigation.
DISCOVERABLE = [name for name in PAGES if name != 'what-is-rehabai.html']
START, END = '<!-- Search metadata: generated -->', '<!-- End search metadata -->'

def configure(site_url=None):
    config_file = ROOT / 'search-config.json'
    config = json.loads(config_file.read_text()) if config_file.exists() else {'site_url': None}
    if site_url:
        parsed = urlparse(site_url)
        if parsed.scheme != 'https' or not parsed.netloc or parsed.query or parsed.fragment or parsed.username or parsed.password:
            raise ValueError('Supply an HTTPS production URL without credentials, query, or fragment.')
        if parsed.hostname in ('localhost', '127.0.0.1', '0.0.0.0'):
            raise ValueError('Local preview URLs cannot be used for search indexing.')
        config['site_url'] = site_url.rstrip('/') + '/'
    base = config.get('site_url')
    config_file.write_text(json.dumps(config, indent=2) + '\n')
    def url(name):
        return urljoin(base, '' if name == 'index.html' else name) if base else None
    def entity(name):
        return (url('index.html') or '') + '#' + name
    org = {'@type': 'Organization', '@id': entity('organization'), 'name': 'RehabAI', 'email': 'support@rehab-ai.app'}
    person = {'@type': 'Person', '@id': entity('creator'), 'name': 'Cody Li'}
    app = {'@type': 'MobileApplication', '@id': entity('app'), 'name': 'RehabAI', 'description': PAGES['index.html'][1], 'applicationCategory': 'HealthApplication', 'creator': {'@id': entity('creator')}, 'featureList': ['Exercise library with recommended and all-exercise views', 'Camera movement tracking and repetition counting', 'Exercise setup and instructions read aloud', 'Session score and repetition charts']}
    website = {'@type': 'WebSite', '@id': entity('website'), 'name': 'RehabAI', 'publisher': {'@id': entity('organization')}, 'inLanguage': 'en'}
    if base:
        for node in (org, app, website):
            node['url'] = url('index.html')
    for filename, (title, description) in PAGES.items():
        path = ROOT / filename
        content = path.read_text()
        prior_schemas = [json.loads(match) for match in re.findall(r'<script type="application/ld\+json">(.*?)</script>', content, re.S)]
        old_articles = [node for schema in prior_schemas for node in schema.get('@graph', [schema]) if node.get('@type') == 'BlogPosting']
        content = re.sub(re.escape(START) + r'.*?' + re.escape(END), '', content, flags=re.S)
        def remove_schema(match):
            return ''
        content = re.sub(r'<script type="application/ld\+json">(.*?)</script>', remove_schema, content, flags=re.S)
        content = re.sub(r'<title>.*?</title>', '<title>' + html.escape(title) + '</title>', content, count=1, flags=re.S)
        for key, value in [('description', description), ('og:title', title), ('og:description', description)]:
            attr = 'property' if key.startswith('og:') else 'name'
            content = re.sub(r'<meta ' + attr + '="' + re.escape(key) + r'" content="[^"]*">', '<meta ' + attr + '="' + key + '" content="' + html.escape(value, quote=True) + '">', content, count=1)
        # Preserve article dates and author evidence already present on each page.
        article = next((node for node in old_articles if node.get('@type') == 'BlogPosting'), None)
        page_id = (url(filename) or '') + '#webpage'
        page = {'@type': 'CollectionPage' if filename == 'blog.html' else 'WebPage', '@id': page_id, 'name': title, 'description': description, 'inLanguage': 'en', 'isPartOf': {'@id': entity('website')}, 'publisher': {'@id': entity('organization')}}
        if base:
            page['url'] = url(filename)
        graph = [page]
        if filename == 'index.html':
            page['about'] = {'@id': entity('app')}
            graph += [org, person, app, website]
        else:
            graph += [org, website]
        if article:
            article['description'] = description
            article['publisher'] = {'@id': entity('organization')}
            article['mainEntityOfPage'] = {'@id': page_id}
            if base:
                article['url'] = url(filename)
            graph.append(article)
        if filename == 'blog.html' and base:
            page['mainEntity'] = {'@type': 'ItemList', 'itemListElement': [{'@type': 'ListItem', 'position': i+1, 'url': url(name), 'name': PAGES[name][0]} for i, name in enumerate(('password-guidance-update.html', 'connectivity-audio-update.html', 'first-release.html'))]}
        lines = [START, '<meta name="robots" content="index, follow, max-image-preview:large">']
        if base:
            lines += ['<link rel="canonical" href="' + html.escape(url(filename), quote=True) + '">', '<meta property="og:url" content="' + html.escape(url(filename), quote=True) + '">', '<meta property="og:image" content="' + html.escape(urljoin(base, 'images/session-updated.png'), quote=True) + '">', '<meta property="og:image:alt" content="RehabAI exercise session with a squat demonstration, movement tracking, and repetition counter.">', '<meta name="twitter:image" content="' + html.escape(urljoin(base, 'images/session-updated.png'), quote=True) + '">']
        lines += ['<script type="application/ld+json">' + json.dumps({'@context': 'https://schema.org', '@graph': graph}, ensure_ascii=False).replace('<', '\\u003c') + '</script>', END]
        path.write_text(re.sub(r'\s*</head>', lambda _: '\n\n' + '\n'.join(lines) + '\n</head>', content, count=1))
    robots = '# Search crawlers may retrieve the public site and its assets.\nUser-agent: *\nAllow: /\n\nUser-agent: OAI-SearchBot\nAllow: /\n'
    if base:
        robots += '\nSitemap: ' + urljoin(base, 'sitemap.xml') + '\n'
        ET.register_namespace('', 'http://www.sitemaps.org/schemas/sitemap/0.9')
        ns = '{http://www.sitemaps.org/schemas/sitemap/0.9}'
        sitemap = ET.Element(ns + 'urlset')
        for filename in DISCOVERABLE:
            ET.SubElement(ET.SubElement(sitemap, ns + 'url'), ns + 'loc').text = url(filename)
        ET.indent(sitemap)
        ET.ElementTree(sitemap).write(ROOT / 'sitemap.xml', encoding='utf-8', xml_declaration=True)
    (ROOT / 'robots.txt').write_text(robots)
    print(f'Updated search metadata and crawler settings for {len(PAGES)} pages.')
    print('Canonical links and sitemap generated.' if base else 'Production URL pending: canonical links and sitemap intentionally omitted.')

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--site-url', help='Verified HTTPS production root, including any hosting subdirectory.')
    configure(parser.parse_args().site_url)
