// Tiny Supabase REST helper shared by the dashboard and the device page.
(function () {
  const c = window.CONFIG;
  const key = c.SUPABASE_ANON_KEY;
  const headers = { apikey: key, "Content-Type": "application/json" };
  // Legacy anon keys are JWTs and go in Authorization too; new publishable keys are not JWTs.
  if (key.startsWith("eyJ")) headers.Authorization = "Bearer " + key;
  const url = c.SUPABASE_URL + "/rest/v1/devices";

  async function req(path, opts) {
    const r = await fetch(url + path, {
      ...opts,
      headers: { ...headers, ...((opts && opts.headers) || {}) },
      cache: "no-store"
    });
    if (!r.ok) throw new Error(r.status + " " + (await r.text()));
    const t = await r.text();
    return t ? JSON.parse(t) : null;
  }

  window.API = {
    configured: !c.SUPABASE_URL.includes("YOUR-PROJECT") && !key.includes("YOUR-ANON"),
    list: () => req("?select=*&order=created_at.asc"),
    get: (id) => req("?id=eq." + encodeURIComponent(id) + "&select=*").then((r) => r[0] || null),
    create: (name) =>
      req("", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify({ name }) }).then((r) => r[0]),
    update: (id, patch) => req("?id=eq." + encodeURIComponent(id), { method: "PATCH", body: JSON.stringify(patch) }),
    remove: (id) => req("?id=eq." + encodeURIComponent(id), { method: "DELETE" })
  };

  window.sha256 = async function (s) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  };
})();
