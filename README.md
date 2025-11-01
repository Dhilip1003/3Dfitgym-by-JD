# 💪 3D Fit Gym - Java Full Stack Project

A full-stack fitness platform that integrates 3D body modeling, personalized workout recommendations, and gym product sales.

## Features

- **3D Body Modeling**: Capture and update user's 3D body model through image inputs
- **Personalized Exercise Recommendations**: AI-driven suggestions based on body part analysis
- **Exercise Videos & Articles**: Access video tutorials and articles for each exercise
- **Food Suggestions**: Get meal recommendations based on fitness goals
- **Gym Product Sales**: Browse and purchase gym equipment and supplements
- **Admin Dashboard**: Manage inventory, products, and track user progress

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.1.5
- MongoDB
- Maven

### Frontend
- React.js 18
- React Router
- Axios

## Project Structure

```
3D-Fit-Gym/
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/fitgym/
│   │       │   ├── model/          # Data models
│   │       │   ├── repository/     # MongoDB repositories
│   │       │   ├── service/        # Business logic
│   │       │   ├── controller/     # REST APIs
│   │       │   └── FitGymApplication.java
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/             # React components
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Java 17 or higher
- Node.js 16+ and npm
- MongoDB (running on localhost:27017)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Build the project:
```bash
mvn clean install
```

3. Run the application:
```bash
mvn spring-boot:run
```

Backend will run on `http://localhost:8080`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## API Endpoints

### Users
- `POST /api/users` - Create user
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}/body-model` - Update body model

### Exercises
- `GET /api/exercises` - Get all exercises
- `GET /api/exercises/body-part/{bodyPart}` - Get exercises by body part
- `GET /api/exercises/suggest/{userId}` - Get personalized exercise suggestions
- `POST /api/exercises` - Create exercise

### Food Suggestions
- `GET /api/food-suggestions/user/{userId}` - Get food suggestions for user
- `GET /api/food-suggestions` - Get all food suggestions
- `POST /api/food-suggestions` - Create food suggestion

### Products
- `GET /api/products` - Get all products
- `GET /api/products/category/{category}` - Get products by category
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

## Resume Abstract

**💪 3D Fit Gym – Java Full Stack Project**

Developed a full-stack fitness platform using Java, Spring Boot, React.js, and MongoDB that integrates 3D body modeling, personalized workout recommendations, and gym product sales. The system captures and updates the user's 3D body model through periodic image inputs, analyzes body part metrics, and dynamically suggests targeted exercises with embedded video tutorials and articles. It also provides AI-driven food suggestions based on fitness goals and body composition. The platform includes a secure admin dashboard for managing gym inventory, product sales, and user progress tracking.

## License

This project is for portfolio/resume purposes.

