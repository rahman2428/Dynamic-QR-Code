# QR Hub — Dynamic QR Code Management System

A production-ready platform for creating, managing, and tracking dynamic QR codes with real-time analytics. Destination URLs can be changed anytime without reprinting the QR code.

## Features

- 🔗 **Dynamic QR Codes** — Generate QR codes that resolve to updatable destination URLs
- ✏️ **Editable Destinations** — Change where QR codes point without regenerating them
- 📊 **Analytics Dashboard** — Track scans with device, browser, OS, and location breakdowns
- 🏷️ **Custom Aliases** — Use human-readable short URLs (e.g., `/r/restaurant-menu`)
- ⏰ **QR Code Expiry** — Set expiration dates that auto-disable QR codes
- 📦 **Bulk Upload** — Import QR codes via CSV
- 🔀 **Multi-Destination Rules** — Redirect based on device type or time
- 🔐 **JWT Authentication** — Secure admin dashboard
- 📥 **Download** — Export QR codes as PNG or SVG

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite + Tailwind CSS v4 |
| Backend | Node.js + Express 5 |
| Database | MongoDB (with Mongoose 9) |
| QR Library | qrcode (Node.js) |
| Charts | Recharts |
| Auth | JWT (access + refresh tokens) |

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (optional — app auto-starts an in-memory server for development)

### 1. Clone & Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment

Edit `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/qr-code-manager
JWT_SECRET=your-secret-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-change-in-production
BASE_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173
```

### 3. Start Development

```bash
# Terminal 1: Start backend
cd server
npm run dev

# Terminal 2: Start frontend
cd client
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Test Admin Credentials

Register a new account at `/register` to get started.

## Project Structure

```
├── client/                 # React Frontend
│   ├── src/
│   │   ├── context/        # Auth context provider
│   │   ├── pages/          # Page components
│   │   ├── services/       # API client (Axios)
│   │   └── index.css       # Tailwind + design system
│   └── vite.config.js      # Vite + Tailwind + proxy
├── server/                 # Express Backend
│   ├── config/db.js        # MongoDB connection
│   ├── controllers/        # Request handlers
│   ├── middleware/auth.js   # JWT verification
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   └── server.js           # Entry point
└── README.md
```

## API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh JWT |
| GET | `/api/auth/me` | Get current user |

### QR Codes
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/qrcodes` | List all QR codes (with search, filter, pagination) |
| GET | `/api/qrcodes/:id` | Get single QR code |
| POST | `/api/qrcodes` | Create QR code |
| PUT | `/api/qrcodes/:id` | Update QR code |
| DELETE | `/api/qrcodes/:id` | Delete QR code |
| GET | `/api/qrcodes/:id/download?format=png` | Download QR image |
| POST | `/api/qrcodes/bulk/upload` | Bulk create from CSV |

### Analytics
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/analytics/overview` | Dashboard overview stats |
| GET | `/api/analytics/:qrCodeId` | Per-QR analytics |

### Redirect
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/r/:id` | Public redirect (alias or shortId) |

## CSV Bulk Upload Format

```csv
title,destinationUrl,customAlias,expiresAt,tags
Restaurant Menu,https://example.com/menu,my-menu,,food;restaurant
Event Page,https://example.com/event,my-event,2026-12-31T23:59,event
```

## License

MIT
