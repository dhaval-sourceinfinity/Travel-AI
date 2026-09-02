#!/usr/bin/env python3
"""Tiny static dev server that serves 404.html for unknown paths.

Usage:  python serve.py [port]   (default 8123)

Production hosts do this via their own config, e.g.:
  - GitHub Pages / Netlify / Vercel: a root 404.html is served automatically
  - Apache:  ErrorDocument 404 /404.html
  - nginx:   error_page 404 /404.html;
"""
import os
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8123
ROOT = os.path.dirname(os.path.abspath(__file__))


class NotFoundHandler(SimpleHTTPRequestHandler):
    def _serve_404(self):
        page = os.path.join(ROOT, "404.html")
        try:
            with open(page, "rb") as f:
                body = f.read()
        except OSError:
            return super().send_error(404, "Not Found")
        self.send_response(404)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)

    def send_head(self):
        # Resolve the requested path (query stripped by SimpleHTTPRequestHandler).
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            if not any(os.path.exists(os.path.join(path, i)) for i in ("index.html", "index.htm")):
                self._serve_404()
                return None
        elif not os.path.exists(path):
            self._serve_404()
            return None
        return super().send_head()


if __name__ == "__main__":
    os.chdir(ROOT)
    with ThreadingHTTPServer(("127.0.0.1", PORT), NotFoundHandler) as httpd:
        print(f"Serving {ROOT} at http://127.0.0.1:{PORT} (404 -> 404.html)")
        httpd.serve_forever()
