"""Run once the real web address is known, from the project folder:

    python tools/set-domain.py https://www.example.com

It fills in the address in sitemap.xml and robots.txt, and adds the canonical and og:url tags
to every page so Google knows which address is the official one. Safe to run again.
"""
import re, sys, pathlib

if len(sys.argv) != 2 or not sys.argv[1].startswith('http'):
    sys.exit('Usage: python tools/set-domain.py https://www.your-domain.com')
domain = sys.argv[1].rstrip('/')
root = pathlib.Path(__file__).resolve().parent.parent
slugs = {'index.html': '', 'excursions.html': 'excursions', 'islands.html': 'islands', 'gallery.html': 'gallery',
         'fish-trap.html': 'fish-trap', 'faq.html': 'faq', 'contact.html': 'contact', 'book.html': 'book'}
for fname, slug in slugs.items():
    p = root / fname
    text = p.read_text(encoding='utf-8')
    text = re.sub(r'<link rel="canonical"[^>]*>\n?', '', text)
    text = re.sub(r'<meta property="og:url"[^>]*>\n?', '', text)
    url = domain + '/' + slug
    tags = '<link rel="canonical" href="%s">\n<meta property="og:url" content="%s">\n' % (url, url)
    text = text.replace('<link rel="icon"', tags + '<link rel="icon"', 1)
    p.write_text(text, encoding='utf-8')
for fname in ('sitemap.xml', 'robots.txt'):
    p = root / fname
    text = p.read_text(encoding='utf-8')
    text = re.sub(r'https?://[^/<\s]+(/sitemap\.xml|/[a-z-]*(?=</loc>))', lambda m: domain + m.group(1), text)
    p.write_text(text, encoding='utf-8')
print('Done. Domain set to', domain)
