# Sample 3D Model Testing Guide

This guide explains how to test the body-model flow with the included sample GLB file.

## Sample Asset

The sample model is a small low-poly humanoid GLB:

```text
frontend/src/assets/models/sample-body.glb
```

When the Angular app is running, the browser URL is:

```text
http://localhost:4200/assets/models/sample-body.glb
```

The app uses this path when you save a manual body model:

```text
/assets/models/sample-body.glb
```

## Prerequisites

- MongoDB running on `localhost:27017`
- Backend running on `http://localhost:8080`
- Frontend running on `http://localhost:4200`

## Start the App

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm start
```

## Test From the UI

1. Open `http://localhost:4200`.
2. On `Dashboard`, click `Create Test User`.
3. Copy the created user ID if it is not already filled into the body-model form.
4. Open `3D Model`.
5. Enter sample measurements, for example:

```text
Chest: 38
Waist: 36
Hips: 39
Arms: 11
Thighs: 22
Shoulders: 18
```

6. Click `Save Manual Model`.
7. Confirm that the saved model URL is `/assets/models/sample-body.glb`.
8. Click `Open saved sample model` to verify the GLB asset is served by Angular.

## Test With the API

Create a test user:

```bash
curl -X POST http://localhost:8080/api/users ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"sample-user\",\"email\":\"sample-user@example.com\",\"password\":\"Demo-password-123!\",\"fitnessGoals\":[\"weight-loss\"]}"
```

Copy the returned `id`, then update the body model:

```bash
curl -X PUT http://localhost:8080/api/users/USER_ID/body-model ^
  -H "Content-Type: application/json" ^
  -d "{\"modelUrl\":\"/assets/models/sample-body.glb\",\"metrics\":{\"chest\":38,\"waist\":36,\"hips\":39,\"arms\":11,\"thighs\":22,\"shoulders\":18}}"
```

Fetch the user and confirm the body model was saved:

```bash
curl http://localhost:8080/api/users/USER_ID
```

## Expected Result

The returned user should include:

```json
{
  "bodyModel": {
    "modelUrl": "/assets/models/sample-body.glb",
    "reconstructionStatus": "manual",
    "metrics": {
      "chest": 38,
      "waist": 36,
      "hips": 39,
      "arms": 11,
      "thighs": 22,
      "shoulders": 18
    }
  }
}
```

This validates the body-model persistence path without needing a third-party reconstruction API.

## Regenerate the Sample Model

If the GLB needs to be recreated:

```bash
node scripts/create-sample-body-model.js
```
