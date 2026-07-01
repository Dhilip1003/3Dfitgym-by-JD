# 3D Fit Gym - MEAN Stack Project

A full-stack fitness platform for 3D body-model capture, workout recommendations, meal suggestions, and gym product browsing.

## What Changed

- Backend migrated from Spring Boot to Node.js, Express.js, and Mongoose.
- Frontend migrated from React to Angular standalone components.
- MongoDB remains the application database.
- Body-model uploads now support multipart photo/video capture and an optional third-party 3D reconstruction API.
- UI was restyled with a responsive glassmorphism system.

## Tech Stack

### Backend
- Node.js 18+
- Express.js
- MongoDB
- Mongoose
- Multer for image/video uploads

### Frontend
- Angular 21
- Angular Forms
- Angular HTTP client
- CSS glassmorphism styling

## Project Structure

```text
3D-Fit-Gym/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── assets/
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── styles.css
│   ├── angular.json
│   └── package.json
└── README.md
```

The old Spring Boot and React files are still present as migration reference, but the runnable app now uses the Node and Angular entry points above.

## Setup

### Prerequisites
- Node.js 20.19 or higher
- npm
- MongoDB running on `localhost:27017`

### Backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

The API runs on `http://localhost:8080`.

### Frontend

```bash
cd frontend
npm install
npm start
```

The Angular app runs on `http://localhost:4200`.

## 3D Reconstruction Integration

The upload endpoint accepts front, side, back photos or a short video:

```http
POST /api/users/:id/body-model/reconstruct
Content-Type: multipart/form-data
```

Use the form field name `captures` for files. Optional body metric fields are `chest`, `waist`, `hips`, `arms`, `thighs`, and `shoulders`.

Configure a provider such as In3D, Kaedim, or another reconstruction service with:

```env
RECONSTRUCTION_API_URL=https://provider.example/reconstruct
RECONSTRUCTION_API_KEY=your-api-key
```

If `RECONSTRUCTION_API_URL` is not set, uploads are stored locally and the user's model status is saved as `pending`.

## API Endpoints

### Health
- `GET /api/health`

### Users
- `POST /api/users`
- `GET /api/users/:id`
- `PUT /api/users/:id/body-model`
- `POST /api/users/:id/body-model/reconstruct`

### Exercises
- `GET /api/exercises`
- `GET /api/exercises/body-part/:bodyPart`
- `GET /api/exercises/suggest/:userId`
- `POST /api/exercises`

### Food Suggestions
- `GET /api/food-suggestions/user/:userId`
- `GET /api/food-suggestions`
- `POST /api/food-suggestions`

### Products
- `GET /api/products`
- `GET /api/products/category/:category`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

## Notes

- Exercise suggestions keep the original rule-based behavior: small chest targets chest, small arms target arms, larger waist targets waist, otherwise full-body.
- Food suggestions use the first fitness goal on the user profile.
- Passwords are still stored as plain text because the original demo did that. Add hashing and authentication before using this beyond portfolio/demo use.
