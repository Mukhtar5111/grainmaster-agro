import os
import sys
import re
import http.server
import socketserver
import threading
import urllib.request
import time

ROOT_DIR = r"C:\Users\Engr_ Mukhtar\.gemini\antigravity\scratch\grainmaster-agro"
os.chdir(ROOT_DIR)

print("=" * 65)
print("GRAINMASTER AGRO SOLUTIONS LTD. - BUILD & TEST SUITE")
print("=" * 65)

failures = 0

def report(test_name, passed, detail=""):
    global failures
    status = "PASS" if passed else "FAIL"
    print(f"[{status}] {test_name}" + (f" -> {detail}" if detail else ""))
    if not passed:
        failures += 1

# 1. Check Core Files Existence
core_files = [
    "index.html",
    "README.md",
    os.path.join("assets", "css", "style.css"),
    os.path.join("assets", "js", "products-data.js"),
    os.path.join("assets", "js", "app.js")
]
for cf in core_files:
    exists = os.path.exists(cf)
    size = os.path.getsize(cf) if exists else 0
    report(f"File Existence: {cf}", exists and size > 0, f"{size:,} bytes")

# 2. Check HTML integrity & required details
with open("index.html", "r", encoding="utf-8") as f:
    html_content = f.read()

required_strings = [
    "GrainMaster Agro Solutions Ltd.",
    "RC9167936",
    "GF7, Helu plaza, France rd by Galadima, Kano Nigeria",
    "+2349032326937",
    "trackRiceMachines",
    "trackScreensRollers",
    "trackColorSorters",
    "trackElevatorsMaize",
    "productModal",
    "cartDrawer",
    "fabContainer"
]
for rs in required_strings:
    report(f"HTML Content Verification: contains '{rs}'", rs in html_content)

# 3. Check JavaScript Products Database Syntax and Consistency
try:
    with open(os.path.join("assets", "js", "products-data.js"), "r", encoding="utf-8") as f:
        js_data = f.read()
    
    # Split products from categories
    prod_section = js_data.split("const CATEGORIES")[0]
    
    # Extract product ids
    product_ids = re.findall(r'id:\s*"([^"]+)"', prod_section)
    report(f"Products Database: Extracted {len(product_ids)} items", len(product_ids) == 26, f"Found {len(product_ids)} items")

    # Check for duplicate IDs
    duplicates = [pid for pid in product_ids if product_ids.count(pid) > 1]
    report("Products Database: Unique Product IDs", len(duplicates) == 0, f"Duplicates: {set(duplicates)}" if duplicates else "All IDs unique")

    # Check that each product has image, specs, and price
    img_matches = re.findall(r'image:\s*"([^"]+)"', prod_section)
    price_matches = re.findall(r'price:\s*([0-9]+)', prod_section)
    report("Products Database: All 26 items have valid images", len(img_matches) == len(product_ids), f"{len(img_matches)}/{len(product_ids)}")
    report("Products Database: All 26 items have numerical prices", len(price_matches) == len(product_ids), f"{len(price_matches)}/{len(product_ids)}")

    # Check every image file exists on disk
    missing_imgs = []
    for img_path in img_matches:
        full_p = os.path.join(ROOT_DIR, img_path.replace("/", os.sep))
        if not os.path.exists(full_p) or os.path.getsize(full_p) < 1000:
            missing_imgs.append(img_path)
    report("Image Assets: Physical File Check on Disk", len(missing_imgs) == 0, f"Missing: {missing_imgs}" if missing_imgs else f"All {len(img_matches)} images verified on disk")

except Exception as e:
    report("Products Database Check", False, str(e))

# 4. HTTP Server End-to-End Probe Test
PORT = 8766
class SilentHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

server = socketserver.TCPServer(("127.0.0.1", PORT), SilentHandler)
server_thread = threading.Thread(target=server.serve_forever, daemon=True)
server_thread.start()
time.sleep(0.5)

try:
    base_url = f"http://127.0.0.1:{PORT}"
    
    # Test Root Index
    req = urllib.request.urlopen(f"{base_url}/index.html", timeout=5)
    report("HTTP Probe: GET /index.html", req.status == 200, f"Status: {req.status}")

    # Test CSS
    req_css = urllib.request.urlopen(f"{base_url}/assets/css/style.css", timeout=5)
    report("HTTP Probe: GET /assets/css/style.css", req_css.status == 200, f"Status: {req_css.status}, Size: {len(req_css.read()):,} bytes")

    # Test JS files
    req_js1 = urllib.request.urlopen(f"{base_url}/assets/js/products-data.js", timeout=5)
    report("HTTP Probe: GET /assets/js/products-data.js", req_js1.status == 200, f"Status: {req_js1.status}")

    req_js2 = urllib.request.urlopen(f"{base_url}/assets/js/app.js", timeout=5)
    report("HTTP Probe: GET /assets/js/app.js", req_js2.status == 200, f"Status: {req_js2.status}")

    # Probe representative images via HTTP
    sample_images = [
        "assets/images/products/n70-rice-polisher.jpg",
        "assets/images/products/buhler-topwhite-bspb.png",
        "assets/images/products/rice-color-sorter.jpg",
        "assets/images/products/rubber-roller-paddy.jpg",
        "assets/images/products/hammer-mill-cyclone.jpg"
    ]
    all_imgs_ok = True
    for s_img in sample_images:
        res = urllib.request.urlopen(f"{base_url}/{s_img}", timeout=5)
        if res.status != 200:
            all_imgs_ok = False
            report(f"HTTP Probe Image: {s_img}", False, f"Status: {res.status}")
    report("HTTP Probe: Representative Product Images (HTTP 200)", all_imgs_ok, "All sampled images loaded successfully over HTTP")

except Exception as e:
    report("HTTP Server Probe", False, str(e))
finally:
    server.shutdown()
    server.server_close()

print("=" * 65)
if failures == 0:
    print(">>> BUILD & TEST SUCCESSFUL: 100% OF TESTS PASSED! <<<")
    sys.exit(0)
else:
    print(f">>> BUILD FAILED: {failures} test(s) failed. <<<")
    sys.exit(1)
