import assert from "node:assert/strict";
import { test } from "node:test";

const baseUrl = process.env.CLIENT_BASE_URL || "http://127.0.0.1:5173";

async function fetchHtml(path) {
  const res = await fetch(`${baseUrl}${path}`);
  const html = await res.text();
  return { res, html };
}

test("frontend SPA shell responds on key demo routes", async () => {
  const routes = ["/login", "/", "/knowledge", "/knowledge/new", "/reviews", "/analytics"];

  for (const route of routes) {
    const { res, html } = await fetchHtml(route);
    assert.equal(res.status, 200, `${route} should return HTTP 200`);
    assert.match(html, /<div id="root"><\/div>/, `${route} should include React root`);
    assert.match(html, /\/src\/main\.jsx|assets\/index-/, `${route} should include frontend bundle`);
  }
});
