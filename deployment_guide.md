# 🚀 Deployment Guide: Vercel, Render & MongoDB Atlas

This guide will walk you through deploying your QR Hub application for production.

---

## Part 1: Database Setup (MongoDB Atlas)

Before deploying the backend, you need a production database.

1.  **Create an Account & Cluster:**
    *   Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up/log in.
    *   Click **Build a Database** and choose the **FREE** (M0) tier.
    *   Select your preferred cloud provider and region (choose one close to you or your users), then click **Create**.

2.  **Database Access:**
    *   Under **Security** on the left sidebar, click **Database Access**.
    *   Click **Add New Database User**.
    *   Choose **Password** authentication.
    *   Enter a **Username** (e.g., `qrhubadmin`) and generate a secure **Password**. **(Save this password!)**
    *   Set privileges to "Read and write to any database" and click **Add User**.

3.  **Network Access (IP Whitelist):**
    *   Under **Security**, click **Network Access**.
    *   Click **Add IP Address**.
    *   Select **Allow Access from Anywhere** (`0.0.0.0/0`). *(Note: Render IPs change dynamically, so this is required for seamless connection).*
    *   Click **Confirm**.

4.  **Get Your Connection String:**
    *   Go to **Database** under the "Deployment" section.
    *   Click the **Connect** button on your cluster.
    *   Choose **Drivers** (Node.js).
    *   Copy the connection string provided. It will look like this:
        `mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority`
    *   Replace `<username>` and `<password>` with the credentials you created in Step 2. Keep this URL handy for Part 2.

---

## Part 2: Backend Deployment (Render)

Now we deploy the Node.js API to Render.

1.  **Prepare your GitHub Repository:**
    *   Ensure your entire project (client and server) is pushed to a repository on GitHub.

2.  **Create a Render Web Service:**
    *   Go to [Render.com](https://render.com/) and sign in.
    *   Click **New +** and select **Web Service**.
    *   Connect your GitHub account and select your project repository.

3.  **Configure the Backend Service:**
    *   **Name:** `qrhub-backend` (or similar)
    *   **Root Directory:** `server` *(Important: Since this is a monorepo, tell Render the backend is in the `server` folder).*
    *   **Environment:** `Node`
    *   **Build Command:** `npm install`
    *   **Start Command:** `npm start` (or `node server.js`)
    *   **Instance Type:** Free (or any paid tier you prefer)

4.  **Environment Variables (`.env`):**
    *   Scroll down and click **Advanced** -> **Add Environment Variable**. Add the following:
        *   `NODE_ENV`: `production`
        *   `PORT`: `5000`
        *   `MONGODB_URI`: *(Paste the MongoDB Atlas URL from Part 1 here)*
        *   `JWT_SECRET`: *(Generate a long random string, e.g., `rq987fgq8374gf8q374g`)*
        *   `JWT_REFRESH_SECRET`: *(Generate another long random string)*
        *   `BASE_URL`: *(Leave blank for now, you will come back and add the Render URL later if needed, but the redirects act relative to the host if set correctly).*
        *   `CLIENT_URL`: *(Leave blank for now; you will update this in Part 3 after deploying the frontend).*

5.  **Deploy:**
    *   Click **Create Web Service**. Render will start building and deploying your backend.
    *   Once deployed, copy the Render URL (e.g., `https://qrhub-backend.onrender.com`) from the top left. **You need this for Vercel.**

---

## Part 3: Frontend Deployment (Vercel)

Finally, deploy the React/Vite frontend to Vercel.

1.  **Create a Vercel Project:**
    *   Go to [Vercel](https://vercel.com/) and sign in (GitHub recommended).
    *   Click **Add New...** -> **Project**.
    *   Import the *same* GitHub repository you used for Render.

2.  **Configure the Frontend Project:**
    *   **Project Name:** `qr-hub`
    *   **Framework Preset:** Vercel should auto-detect **Vite**.
    *   **Root Directory:** Click "Edit" and select `client`. *(Important: Tell Vercel the frontend is in the `client` folder).*

3.  **Environment Variables:**
    *   Expand the **Environment Variables** section. Add the following:
        *   **Name:** `VITE_API_URL`
        *   **Value:** `https://qrhub-backend.onrender.com/api` *(Replace with your actual Render URL from Part 2, making sure to add `/api` at the end)*.

4.  **Deploy:**
    *   Click **Deploy**. Vercel will build and launch your frontend.
    *   Once finished, copy the **production domain** provided by Vercel (e.g., `https://qr-hub.vercel.app`).

---

## Part 4: Final Connection

We need to tell the Backend to exclusively trust the Frontend.

1.  **Update Render Environment Variables:**
    *   Go back to your Backend service on **Render**.
    *   Click **Environment** on the left sidebar.
    *   Update `CLIENT_URL` to be your Vercel URL (e.g., `https://qr-hub.vercel.app`).
    *   *Optional:* Update `BASE_URL` to your Render URL (e.g., `https://qrhub-backend.onrender.com`) if your backend relies on absolute URLs for the redirect links.
    *   Save the changes. Render will automatically redeploy the backend with the new variables.

**🎉 Congratulations! Your application is now live.**
