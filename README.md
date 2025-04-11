# Rotten Oranges - Backend
![Rotten Oranges Logo](https://github.com/restbackDev/rotten-oranges-frontend/blob/Develop/src/assets/orange-logo.png?raw=true)

## Overview

Rotten Oranges is a MERN stack application that enables users to manage their movie reviews. The backend, built with Node.js and Express, provides a RESTful API for user authentication and CRUD operations on movie reviews, interfacing with a MongoDB database.

## Deployment

You can access the deployed link here: [Deployment Link](https://67f8a72b31f5286ba6505f86--rotten-oranges-01.netlify.app/)

[Link to Frontend](https://github.com/restbackDev/rotten-oranges-frontend.git)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/restbackDev/rotten-oranges-backend.git
   ```
2. Navigate to the project directory:
   ```bash
   cd rotten-oranges-backend
   ```
3. Install dependencies:
 ```bash
   npm install
   ```
  
4. Create a `.env` file in the root directory and add your environment variables and JWT secret keys.
 ```bash
MONGODB_URI=your_MONGODB_URI
JWT_SECRET=your_JWT_SECRET
TMDB_BEARER_TOKEN=your_TMDB_BEARER_TOKEN
   ```

5. Start the server:
 ```bash
   nodemon servers.js
   ```

   The API will be available at `http://localhost:000`.

## Tech Stack
- **Frontend:** React (Vite), CSS Flexbox and Grid (For responsive and flexible layout designs).
- **Backend:** Node.js, Express
- **Database:** MongoDB (hosted on MongoDB Atlas)
- **Authentication:** JSON Web Tokens (JWT)
- **CSS Flexbox** For responsive and flexible layout designs.
- **API Integration:** The Movie Database [(TMDB) API](https://developer.themoviedb.org/reference/discover-movie)
- **Deployment:** Heroku

## Planning 
- [Trello](https://trello.com/b/OotijSIg/rottenoranges)

## Next Steps

- **Profile Management:** Develop endpoints and frontend components to allow users to manage their profiles, including updating personal information.