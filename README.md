# Mise

A recipe app you install on your phone. Tell it what's in your fridge, it asks a couple of
questions, and it gives you dinner that fits your taste, your week and your budget.

Built as a PWA so it installs on Android without a Play Store account, a build machine, or
a developer certificate.

---

## Setting it up with nothing but your phone

You need three free accounts: **GitHub**, **Vercel**, **Google AI Studio**. No app installs.

### 1. Put the code on GitHub (~20 min, the fiddly part)

1. `github.com` → **New repository** → name it `mise` → Private → Create.
2. Go to `https://github.dev/<your-user>/mise` — that's VS Code running in the browser.
   Turn on **Desktop site** in Chrome's menu first, it's much easier to use.
3. Recreate this folder structure and paste each file in:

```
package.json
vite.config.js
index.html
.gitignore
public/icon-192.png
public/icon-512.png
public/icon-maskable-512.png
public/favicon.svg
src/main.jsx
src/index.css
src/App.jsx
```

   In the Explorer panel, right-click a folder → **Upload...** puts files in the right
   place. That's easier than pasting `App.jsx` by hand — it's 2,400 lines.

4. Source Control panel (left side) → write a message → **Commit & Push**.

### 2. Deploy it (~5 min)

1. `vercel.com` → sign in with GitHub → **Add New → Project** → import `mise`.
2. Don't change any settings. Vercel detects Vite on its own.
3. **Deploy**. You get a URL like `mise-xyz.vercel.app`.

Every push to GitHub redeploys automatically from now on.

### 3. Install it on the phone (~1 min)

Open the URL in Chrome → menu (⋮) → **Install app** / **Add to Home screen**.

Android generates a real APK on the device and installs it. You get an icon in the app
drawer, no address bar, its own entry in recent apps. For daily use this is
indistinguishable from a Play Store app.

### 4. Wake up the chef (~2 min)

1. `aistudio.google.com` → **Get API key** → create one. Free, no card.
2. In Mise: **Profile → AI chef** → paste the key.

The key is saved in this phone's `localStorage` and is sent only to Google. It is never
in the code and never on the server, so it's fine that the deployment is public.

Free tier limits are low and Google changes them often — expect a few hundred requests a
day. If the model name in Settings stops working, swap it for whatever is current
(`gemini-3.5-flash`, `gemini-3.1-flash-lite`, etc.). When you run out, the chef falls
back to matching your pantry against the 26 recipes bundled in the app, so it never
just breaks.

---

## If you want a real .apk file

Step 3 is enough for personal use. If you want a file you can sideload or send to someone:

1. `pwabuilder.com` → paste your Vercel URL → **Package for stores → Android**.
2. Download the zip. It contains a signed `.apk` and an `assetlinks.json`.
3. Put `assetlinks.json` in `public/.well-known/` in the repo and push, otherwise the app
   opens with a browser bar across the top.
4. On the phone: enable "install unknown apps" for your file manager, tap the `.apk`.

This wraps the same web app in a Trusted Web Activity. It is not a rewrite, and updates
still come from Vercel — you only reinstall the APK if the icon or name changes.

---

## Running it locally, when you have a machine again

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/
```

---

## What's inside

- **Discover** — 26 recipes with full ingredients and method, ranked by a match score
  computed from your food profile: cuisine, dish type, proteins, flavours, nutrition
  goals, budget, spice tolerance, available equipment and skill level.
- **Pantry Chef** — asks one question at a time, then builds recipes around what you
  actually have, separating it from what you'd need to buy.
- **Cookbook** — saved, favourites, 5-star, cooked history, plus recipes the chef made.
- **Grocery list** — grouped by aisle, and it skips anything already in your pantry.
- **Food profile** — 10 diets, 20 exclusions, 18 flavours, 16 proteins, 27 cuisines,
  23 dish types, goals, equipment, and sliders for heat, time and budget.

Everything is stored on the device. There is no server, no account on anyone's database,
and nothing syncs between phones. If you clear the browser data for the site, it's gone.

## Swapping in a different model

The chat lives in one function, `send()` inside `PantryChef` in `src/App.jsx`. It posts a
prompt and expects JSON back with `reply`, `chips` and `recipes`. Point it at anything
that speaks JSON — a proxy on your own server, Ollama on your desktop over Tailscale,
another provider — and the rest of the app doesn't change.
