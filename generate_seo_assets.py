import os
import re
import datetime

ROOT_DIR = r"C:\Users\Engr_ Mukhtar\.gemini\antigravity\scratch\grainmaster-agro"
products_file = os.path.join(ROOT_DIR, "assets", "js", "products-data.js")

with open(products_file, "r", encoding="utf-8") as f:
    content = f.read()

# Parse individual product blocks
# Each product is an object in PRODUCTS_DATA array
product_blocks = re.findall(r'\{\s*id:\s*"([^"]+)",(.*?)\n\s*\},', content, re.DOTALL)

products = []
for pid, block in product_blocks:
    sku_m = re.search(r'sku:\s*"([^"]+)"', block)
    name_m = re.search(r'name:\s*"([^"]+)"', block)
    img_m = re.search(r'image:\s*"([^"]+)"', block)
    desc_m = re.search(r'shortDesc:\s*"([^"]+)"', block)
    cat_m = re.search(r'category:\s*"([^"]+)"', block)
    brand_m = re.search(r'brand:\s*"([^"]+)"', block)

    products.append({
        "id": pid,
        "sku": sku_m.group(1) if sku_m else "",
        "name": name_m.group(1) if name_m else "",
        "image": img_m.group(1) if img_m else "",
        "shortDesc": desc_m.group(1) if desc_m else "",
        "category": cat_m.group(1) if cat_m else "",
        "brand": brand_m.group(1) if brand_m else ""
    })

print(f"Extracted {len(products)} products from products-data.js")

def xml_escape(val):
    return (val.replace("&", "&amp;")
               .replace("<", "&lt;")
               .replace(">", "&gt;")
               .replace('"', "&quot;")
               .replace("'", "&apos;"))

today = datetime.date.today().isoformat()
base_url = "https://grainmasteragro.com"

# Build sitemap.xml
sitemap_lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    '  <!-- Main Homepage -->',
    '  <url>',
    f'    <loc>{base_url}/</loc>',
    f'    <lastmod>{today}</lastmod>',
    '    <changefreq>weekly</changefreq>',
    '    <priority>1.0</priority>',
    '    <image:image>',
    f'      <image:loc>{base_url}/assets/images/logo.png</image:loc>',
    '      <image:title>GrainMaster Agro Solutions Ltd. Logo</image:title>',
    '      <image:caption>Commercial Rice Milling Machinery, Spare Parts and Optical Color Sorters Hub in Kano, Nigeria</image:caption>',
    '    </image:image>',
    '  </url>',
    '',
    '  <!-- Equipment Category Deep Links -->',
]

categories = [
    ("rice-machines", "Commercial Rice Milling Machines & Whiteners"),
    ("screens-sieves", "Milling Screens, Sieves & Perforated Segments"),
    ("rollers-abrasives", "Paddy Rubber Rollers & Emery Abrasives"),
    ("color-sorter", "Optical Color Sorter Technology & High-Frequency Ejector Valves"),
    ("elevator-hardware", "Elevator Buckets, Fasteners & Industrial Fans"),
    ("maize-milling", "Maize Degerminators, Mills & Polisher Screens")
]

for cat_slug, cat_title in categories:
    sitemap_lines.extend([
        '  <url>',
        f'    <loc>{base_url}/?category={cat_slug}</loc>',
        f'    <lastmod>{today}</lastmod>',
        '    <changefreq>weekly</changefreq>',
        '    <priority>0.8</priority>',
        '  </url>'
    ])

sitemap_lines.append('')
sitemap_lines.append('  <!-- Individual Product Deep Links with Google Image Sitemap metadata -->')

for p in products:
    img_url = f"{base_url}/{p['image']}"
    prod_url = f"{base_url}/?product={p['id']}"
    esc_name = xml_escape(f"{p['name']} ({p['sku']}) - GrainMaster Kano")
    esc_desc = xml_escape(p['shortDesc'])
    
    sitemap_lines.extend([
        '  <url>',
        f'    <loc>{prod_url}</loc>',
        f'    <lastmod>{today}</lastmod>',
        '    <changefreq>weekly</changefreq>',
        '    <priority>0.9</priority>',
        '    <image:image>',
        f'      <image:loc>{img_url}</image:loc>',
        f'      <image:title>{esc_name}</image:title>',
        f'      <image:caption>{esc_desc}</image:caption>',
        '    </image:image>',
        '  </url>'
    ])

sitemap_lines.append('</urlset>')

sitemap_path = os.path.join(ROOT_DIR, "sitemap.xml")
with open(sitemap_path, "w", encoding="utf-8") as f:
    f.write("\n".join(sitemap_lines) + "\n")
print(f"Generated {sitemap_path} with {len(products) + len(categories) + 1} URLs")

# Build robots.txt
robots_content = f"""# =========================================================================
# GrainMaster Agro Solutions Ltd. (RC9167936)
# Central Hub: GF7, Helu plaza, France rd by Galadima, Kano Nigeria
# Official Domain: https://grainmasteragro.com/
# =========================================================================

User-agent: *
Allow: /
Allow: /assets/css/
Allow: /assets/js/
Allow: /assets/images/

# Crawl Delay to ensure smooth high-speed indexing
Crawl-delay: 1

# Sitemaps
Sitemap: {base_url}/sitemap.xml
"""

robots_path = os.path.join(ROOT_DIR, "robots.txt")
with open(robots_path, "w", encoding="utf-8") as f:
    f.write(robots_content)
print(f"Generated {robots_path}")
