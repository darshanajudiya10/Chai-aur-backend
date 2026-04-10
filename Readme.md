# Videotube backend

Express + MongoDB backend for a social / video-style app (user registration with avatar uploads via Cloudinary).

## Stack

- **Runtime:** Node.js (ES modules)
- **Framework:** Express 5
- **Database:** MongoDB (Mongoose)
- **Uploads:** Multer (disk → `public/temp`), then Cloudinary
- **Auth-ready:** bcrypt, jsonwebtoken (used in user model)

## Prerequisites

- Node.js 18+ recommended
- A MongoDB Atlas cluster (or other MongoDB URI)
- A [Cloudinary](https://cloudinary.com/) account (for avatar / cover image URLs)

## Setup

```bash
git clone <your-repo-url>
cd videotube-backed
npm install
```

Create a `.env` file in the project root (same folder as `package.json`). The app loads it from `./.env` in `src/index.js`.

### Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | HTTP port (default `8000` if unset) |
| `MONGODB_URI` | Yes | MongoDB connection string (without trailing database name path segment; DB name is appended in code) |
| `CORS_ORIGIN` | Yes for browsers | Allowed origin(s), e.g. `http://localhost:5173` or `*` |
| `CLOUDINARY_CLOUD_NAME` | Yes for uploads | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Yes for uploads | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes for uploads | Cloudinary API secret |
| `ACCESS_TOKEN_SECRET` | For JWT | Secret for access tokens |
| `ACCESS_TOKEN_EXPIRY` | No | e.g. `1d` |
| `REFRESH_TOKEN_SECRET` | For JWT | Secret for refresh tokens |
| `REFRESH_TOKEN_EXPIRY` | No | e.g. `10d` |

Use plain keys in `.env` (e.g. `CLOUDINARY_CLOUD_NAME=...`), not `process.env.CLOUDINARY_CLOUD_NAME=...`.

Ensure the upload directory exists:

```text
public/temp/
```

Multer writes uploaded files there before Cloudinary upload.

## Run

Development (with nodemon and dotenv preloaded):

```bash
npm run dev
```

The server starts only after a successful MongoDB connection. You should see logs similar to:

```text
mongoDB connected !! DB HOST : ...
server is running at port: <PORT>
```

## API

Base path for users: `/api/v1/users`

### Register user

- **Method:** `POST`
- **URL:** `/api/v1/users/register`
- **Content-Type:** `multipart/form-data`

**Body (fields)**

| Field | Type | Required |
|-------|------|----------|
| `fullname` | string | Yes |
| `username` | string | Yes |
| `email` | string | Yes |
| `password` | string | Yes |
| `avatar` | file | Yes |
| `coverImage` | file | No |

Example with [curl](https://curl.se/):

```bash
curl -X POST "http://localhost:3000/api/v1/users/register" ^
  -F "fullname=Jane Doe" ^
  -F "username=jane" ^
  -F "email=jane@example.com" ^
  -F "password=secret123" ^
  -F "avatar=@/path/to/avatar.jpg" ^
  -F "coverImage=@/path/to/cover.jpg"
```

Success response: `201` with user data (password and refresh token omitted).

## Troubleshooting

- **`ECONNREFUSED` on the client:** Nothing is listening on that port. Confirm the server process is running and that you are using the same `PORT` as in `.env` (no trailing comma on `PORT=3000`).
- **MongoDB errors on startup:** Check `MONGODB_URI`, network access (Atlas IP allowlist), and that the app can reach the cluster.
- **`Error while uploading avatar`:** Usually Cloudinary upload failed or returned no result. Verify `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`, and check server logs for `Cloudinary upload error`. Ensure `public/temp` exists and is writable.
- **CORS issues in the browser:** Set `CORS_ORIGIN` to your frontend origin (or `*` for local experiments only).

## Scripts

| Script | Command |
|--------|---------|
| Dev | `npm run dev` |

## License

ISC
