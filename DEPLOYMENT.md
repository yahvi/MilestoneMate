# MilestoneMate Production Deployment Guide

Deploy MilestoneMate in under 10 minutes:
- **Frontend**: [Vercel](https://vercel.com) (React 19 + Vite SPA)
- **Backend**: [Render](https://render.com) (Node.js Express REST API)

---

## Prerequisites
1. Push your code to a **GitHub repository** (public or private).
2. A free account on **[Vercel](https://vercel.com)**.
3. A free account on **[Render](https://render.com)**.

---

## Step 1: Deploy Backend to Render

### Option A: 1-Click Render Blueprint (Recommended)
Because this repository includes a [`render.yaml`](./render.yaml), you can use Render Blueprints:
1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** > **Blueprint**.
3. Connect your GitHub repository.
4. Render will automatically detect `render.yaml` with the root directory `server`, build command, start command, and health check.
5. Fill in your environment variables when prompted and click **Apply**.

---

### Option B: Manual Web Service Setup
1. In [Render Dashboard](https://dashboard.render.com/), click **New +** > **Web Service**.
2. Select your GitHub repository.
3. Configure the service settings:
   - **Name**: `milestonemate-backend`
   - **Region**: Choose the closest region (e.g. Frankfurt, Oregon, Singapore)
   - **Branch**: `main` (or your active branch)
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

4. Scroll down to **Environment Variables** and add:
   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Production environment mode |
   | `PORT` | `10000` | Port provided by Render |
   | `JWT_SECRET` | `milestonemate_production_secure_jwt_2026` | 32+ char secret string |
   | `CLIENT_URL` | `https://your-app.vercel.app` | Will be updated after Step 2 |
   | `GEMINI_API_KEY` | `YOUR_GEMINI_API_KEY` | Optional: Get from [Google AI Studio](https://aistudio.google.com/) |
   | `PAYPAL_CLIENT_ID` | `YOUR_SANDBOX_CLIENT_ID` | Optional: From [PayPal Developer](https://developer.paypal.com/) |
   | `PAYPAL_CLIENT_SECRET` | `YOUR_SANDBOX_CLIENT_SECRET` | Optional: From [PayPal Developer](https://developer.paypal.com/) |
   | `PAYPAL_BASE_URL` | `https://api-m.sandbox.paypal.com` | PayPal REST Sandbox endpoint |
   | `MONGODB_URI` | *(Optional)* | Cloud MongoDB URI. If omitted, MilestoneMate operates seamlessly in In-Memory Store mode with auto-seeding! |

5. Click **Create Web Service**.
6. Wait 1–2 minutes for the build to finish. Once live, copy your backend URL:
   `https://milestonemate-backend.onrender.com`

---

## Step 2: Deploy Frontend to Vercel

1. Log in to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** > **Project**.
3. Import your MilestoneMate GitHub repository.
4. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click **Edit** and choose `client` (Important: select `client` directory)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

5. Expand **Environment Variables** and add:
   | Name | Value | Note |
   | :--- | :--- | :--- |
   | `VITE_API_URL` | `https://milestonemate-backend.onrender.com/api` | Replace with your Render backend URL from Step 1 |
   | `VITE_PAYPAL_CLIENT_ID` | `test` *(or your PayPal Sandbox Client ID)* | Required for PayPal Buttons |

6. Click **Deploy**.
7. In ~45 seconds, your app will be live at `https://<your-project>.vercel.app`!

> [!NOTE]
> Client-side routing rewrites (`vercel.json`) are already pre-configured in this repository. Direct URL reloads on `/features`, `/how-it-works`, `/demo-video`, or `/dashboard` work seamlessly with zero 404 errors.

---

## Step 3: Connect Frontend to Backend (Final Handshake)

1. Return to your **Render Dashboard** > Select `milestonemate-backend`.
2. Go to **Environment** tab.
3. Update `CLIENT_URL` to your live Vercel domain:
   `CLIENT_URL=https://your-app.vercel.app`
4. Click **Save Changes** (Render will automatically re-deploy with updated CORS rules in seconds).

---

## Verification Checklist

1. **Backend Health Check**:
   Visit `https://milestonemate-backend.onrender.com/api/health` in your browser. You should see:
   ```json
   {
     "status": "healthy",
     "service": "MilestoneMate API"
   }
   ```
2. **Frontend Connectivity**:
   Open your live Vercel site (`https://your-app.vercel.app`).
   - The top header pill should display `Backend :10000` with a green pulse.
   - Click **Freelancer** or **Client** 1-Click Demo Login to enter the app without typing credentials.
   - The AI Video Demo is available at `https://your-app.vercel.app/demo-video`.

