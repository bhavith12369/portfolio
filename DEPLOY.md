# Deploy your portfolio & showcase it on GitHub

Your site has **two parts**:

1. **Static pages** — HTML, CSS, JS at the repo root (`index.html`, `about.html`, …).
2. **Backend** — Spring Boot in `spring-portfolio/` serves those files **and** exposes **`POST /api/contact`** for the contact form.

**Important:** [GitHub Pages](https://pages.github.com/) only hosts **static files**. It **cannot** run your Java/Spring server. To put **everything** online for free in one place, use **Render** (or similar) for Spring Boot, then link that URL from GitHub.

Below: **A)** Push code to GitHub · **B)** One recommended free deployment (Spring + API + same-site contact form) · **C)** Optional split: Pages + API · **D)** Showcase on your GitHub profile.

---

## A. Push the project to GitHub (step by step)

1. **Install Git**  
   Download from [git-scm.com](https://git-scm.com/) if it is not installed. Restart the terminal after installing.

2. **Create an empty repo on GitHub**  
   - Log in → **New repository**.  
   - Name it e.g. `portfolio` or `javaminiproject`.  
   - Leave **without** README (you already have files locally).  
   - Click **Create repository**.

3. **Open a terminal** in your project folder (the folder that contains `index.html` and `spring-portfolio/`):

   ```bash
   cd "c:\Users\bhavi\OneDrive\Desktop\javaminiproject"
   ```

4. **Initialize Git** (only once):

   ```bash
   git init
   git branch -M main
   ```

5. **Ignore build output** (optional but recommended). Create a file named `.gitignore` in the project root with:

   ```
   spring-portfolio/target/
   .idea/
   *.iml
   ```

6. **Commit**:

   ```bash
   git add .
   git commit -m "Portfolio site with Spring Boot contact API"
   ```

7. **Connect remote** — replace `YOUR_USER` and `YOUR_REPO` with yours:

   ```bash
   git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
   git push -u origin main
   ```

After this, your code lives on GitHub. Next you deploy so visitors get a **live URL**.

---

## B. Recommended free hosting: Render (Spring Boot + static site + `/api/contact`)

[Render](https://render.com/) has a free web tier suitable for demos (service may spin down after idle — first request can be slow).

### Prerequisites

- GitHub repo pushed (section A).
- Render account (sign up with GitHub).

### Steps

1. In Render dashboard → **New +** → **Web Service**.

2. **Connect** your GitHub repository and grant access if asked.

3. **Configure the service:**

   | Setting | Value |
   |--------|--------|
   | **Root Directory** | `spring-portfolio` |
   | **Runtime** | Native Java / Maven (pick Java **17**) |
   | **Build Command** | `mvn clean package -DskipTests` |
   | **Start Command** | `java -jar target/spring-portfolio-1.0.0.jar` |

4. Render injects a **`PORT`** environment variable. This project uses `server.port=${PORT:8082}` so the app listens on the correct port automatically.

5. Click **Create Web Service** and wait for the first deploy.

6. Open your **`.onrender.com` URL**. You should see the home page; **`/contact.html`** should submit to **`POST /api/contact`** on the **same origin**, so **no extra configuration** is needed (leave `<meta name="portfolio-api-base" content="" />` empty).

7. **View logs**: In Render → your service → **Logs**. After each successful submit, the server logs the contact fields (messages are **not** emailed unless you add mail integration later).

### Cors for split hosting (only if you use section C)

If the HTML is on GitHub Pages but the API is on Render, add an environment variable in Render:

| Key | Example value |
|-----|----------------|
| `PORTFOLIO_CORS` | `https://YOUR_USER.github.io` |

(No trailing slash; multiple origins allowed comma-separated.)

---

## C. Optional: GitHub Pages (static only) + API on Render

Use this if you want **`username.github.io/repo-name`** for HTML while the API stays on Render.

1. **Deploy API on Render** as in section B.

2. **Enable GitHub Pages**  
   Repo → **Settings** → **Pages** → **Build and deployment**:  
   - Source: **Deploy from a branch**  
   - Branch: `main`, folder **`/` (root)**  
   Save.

3. After a minute, your site is at:

   `https://YOUR_USER.github.io/YOUR_REPO/`

4. **Point the contact form at the API** — edit **`contact.html`** (only this page needs it):

   ```html
   <meta name="portfolio-api-base" content="https://YOUR-SERVICE.onrender.com" />
   ```

   Commit and push. Pages only redeploys when you push.

5. Set **`PORTFOLIO_CORS`** on Render to your Pages URL, e.g. `https://YOUR_USER.github.io`, so the browser allows `fetch` from Pages to your API.

**Limitation:** Paths on Pages often include the repo name (`/YOUR_REPO/contact.html`). Your links already use relative paths (`href="contact.html"`), which works.

---

## D. Showcase on your GitHub profile

1. Open **`https://github.com/YOUR_USER`**.

2. Click **Edit profile**.

3. **Website:** paste your live URL (Render **or** GitHub Pages).

4. **Pinned repositories:** pin `YOUR_REPO` so visitors see it first.

5. In the repo, click **⚙️ About** → add **Website** and short description → Save.

Optional: Add a **`README.md`** at the repo root with screenshots and “Live demo” link so teachers or recruiters see it immediately.

---

## Quick local check (backend + form)

From `spring-portfolio`:

```bash
mvn spring-boot:run
```

Open `http://localhost:8082/contact.html` (default port **8082** in `application.properties`). Submit the form — success banner should appear and the terminal should log the message.

---

## Summary

| Goal | Approach |
|------|-----------|
| Code on GitHub | Git push (section A) |
| Live site **with** contact API | Render Web Service from `spring-portfolio/` (section B) |
| Free static hosting only | GitHub Pages — contact **won’t** hit Spring unless you add section C |
| Profile link | Edit GitHub profile + pin repo (section D) |

If you tell me your exact GitHub username and chosen repo name, you can paste ready-made URLs into About / Website without guessing paths.
