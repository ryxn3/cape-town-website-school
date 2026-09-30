# serve.py - runs the website on your own computer (localhost)
#
# How to use:
#   python serve.py                  opens the newest version (step-6-globe)
#   python serve.py step-3-colours   opens a different step
#
# Press Ctrl+C to stop it.

import http.server
import os
import sys
import webbrowser

PORT = 8000

# the folder this file is in, so it works from anywhere
here = os.path.dirname(os.path.abspath(__file__))

# which step to open (step-6-globe if you don't say)
folder = sys.argv[1] if len(sys.argv) > 1 else "step-6-globe"
folder = folder.strip("/\\")

if not os.path.isdir(os.path.join(here, folder)):
    print("Can't find the folder:", folder)
    sys.exit(1)

# serve the whole project so you can still look at all the steps
os.chdir(here)

url = f"http://localhost:{PORT}/{folder}/"

server = http.server.ThreadingHTTPServer(("localhost", PORT), http.server.SimpleHTTPRequestHandler)
print("Website running at", url)
print("Press Ctrl+C to stop")
webbrowser.open(url)

try:
    server.serve_forever()
except KeyboardInterrupt:
    print("\nStopped")
