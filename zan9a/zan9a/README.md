# zan9a — streetwear store

A dark, mobile-friendly streetwear shop with one-hour drops and a full owner
dashboard. Built with React + Vite, Supabase (database, login, image storage),
and deployed on Netlify.

**created by 28Solutions**

---

## What you can do

- **Storefront:** home with live 1-hour drop countdown, shop with filters,
  product pages, a bag, and WhatsApp checkout (cash on delivery).
- **Owner dashboard** (`/admin`): add / edit / delete products, upload photos,
  edit the announcement banner, hero text, currency, Instagram and WhatsApp
  number, and start a 1-hour drop with one click.

> **Try it right now:** run it locally (Part B) and open `/admin`.
> It runs in **DEMO MODE** until you add Supabase keys — login password is `demo`.
> Demo changes save only in your own browser. Connecting Supabase makes it real.

---

# THE DUMMY GUIDE — get it live, step by step

You will do this in 4 parts. Take them in order. No coding needed.

- **Part A** – Set up Supabase (your free backend)
- **Part B** – Run it on your own computer (optional but recommended)
- **Part C** – Put the code on GitHub
- **Part D** – Deploy on Netlify (your live website)

---

## PART A — Supabase (database + login + photo storage)

1. Go to **https://supabase.com** → **Start your project** → sign up (free).
2. Click **New project**. Give it a name (e.g. `zan9a`), set a database
   password (save it somewhere), pick the closest region, click **Create**.
   Wait ~2 minutes for it to finish.
3. In the left menu open **SQL Editor** → **New query**.
4. Open the file **`supabase-setup.sql`** from this project, copy **everything**
   inside it, paste it into the SQL editor, and click **Run**.
   You should see "Success". This creates your products table, settings, the
   image storage, and security rules.
5. Create your owner login: left menu → **Authentication** → **Users** →
   **Add user** → **Create new user**. Type your email + a password →
   **Create user**. (Tip: toggle "Auto Confirm User" on so you can log in
   immediately.) **This email + password is how you log into `/admin`.**
6. Get your two keys: left menu → **Project Settings** (gear) → **API**.
   Copy these two values, you'll need them soon:
   - **Project URL** (looks like `https://abcd1234.supabase.co`)
   - **anon public** key (a long string under "Project API keys")

Supabase is done. ✅

---

## PART B — Run it on your computer (recommended test before going live)

You need **Node.js** installed (get the "LTS" version from https://nodejs.org).

1. Open a terminal in this project folder.
2. Make your settings file: copy `.env.example` to a new file named `.env`
   and paste your two Supabase values into it:
   ```
   VITE_SUPABASE_URL=https://abcd1234.supabase.co
   VITE_SUPABASE_ANON_KEY=your-long-anon-public-key
   ```
3. Install and run:
   ```
   npm install
   npm run dev
   ```
4. Open the link it prints (usually **http://localhost:5173**).
5. Go to **/admin**, log in with the email + password you made in Part A step 5,
   add a product with a photo, and check it shows on the home page. 🎉

(If you skip the `.env` file it still runs in demo mode with sample clothes.)

---

## PART C — Put the code on GitHub

1. Make a free account at **https://github.com**.
2. Click **New repository** → name it `zan9a` → **Create repository**.
3. Upload this project. Easiest way without commands:
   on the new empty repo page click **uploading an existing file**, then drag
   in all the project files/folders **except** `node_modules` and `.env`.
   Click **Commit changes**.

   *(If you know git, instead run in the project folder:)*
   ```
   git init
   git add .
   git commit -m "zan9a"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/zan9a.git
   git push -u origin main
   ```

> Never upload your `.env` file. The `.gitignore` already blocks it.

---

## PART D — Deploy on Netlify (go live)

1. Make a free account at **https://netlify.com** (sign in with GitHub —
   it's smoother).
2. Click **Add new site** → **Import an existing project** → **GitHub** →
   pick your `zan9a` repository.
3. Netlify auto-detects the settings from `netlify.toml`. Confirm they read:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Before deploying, click **Add environment variables** (or do it after, see
   below) and add your two keys:
   - `VITE_SUPABASE_URL` = your Project URL
   - `VITE_SUPABASE_ANON_KEY` = your anon public key
5. Click **Deploy**. In ~1 minute you get a live link like
   `https://zan9a.netlify.app`. That's your website. 🚀

**Set keys after deploy / change them later:** Netlify → your site →
**Site configuration** → **Environment variables** → add the two values →
then **Deploys** → **Trigger deploy** → **Deploy site** so they take effect.

**Custom domain (optional):** Netlify → **Domain management** → add your domain
and follow the steps.

---

## Daily use (after it's live)

- Go to `https://your-site.netlify.app/admin` and log in.
- **Add piece** → fill in name, price, sizes, upload a photo, tick **Live drop**
  and **Feature on home** as you like → **Drop it**.
- **Drop timer** → click **⚡ Start a 1-hour drop now** → **Save store**.
- **Store & banner** → change the scrolling banner text, hero text, your
  WhatsApp number (with country code, e.g. `216...`) and Instagram handle.

Orders come to you on WhatsApp with the item list — you confirm and arrange
cash on delivery.

---

## Troubleshooting

- **"Demo mode" badge still showing on the live site** → your Netlify
  environment variables aren't set, or you didn't re-deploy after adding them.
  Redo Part D step 4–5.
- **Can't log in to /admin** → the email/password must match a user you created
  in Supabase → Authentication → Users (Part A step 5).
- **Photo won't upload** → make sure you ran the full `supabase-setup.sql`
  (it creates the `product-images` storage bucket).
- **Page reloads to "Not found" on Netlify** → handled by `netlify.toml`; make
  sure that file is in your repo.

---

Tech: React 18 · Vite 5 · React Router · Supabase · deployed on Netlify.
