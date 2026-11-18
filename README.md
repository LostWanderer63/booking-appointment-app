# Booking Appointment App

Full-stack booking appointment app: HTML/CSS/JS frontend with an Express + Sequelize (MySQL) backend.

## Setup

```bash
npm install
cp .env.example .env              # add your MySQL credentials
mysql -u root -p < schema.sql     # creates booking_app database and User table
npm start                         # open http://localhost:3000
```

## Structure

```
app.js               Express app (cors, express.json, static frontend)
util/database.js     Sequelize connection
models/user.js       User model
controllers/user.js  add, get and delete user logic
routes/user.js       /user routes
public/              frontend (index.html, style.css, app.js)
```

## API

All responses are JSON.

| Method | Path                     | Description           |
|--------|--------------------------|-----------------------|
| POST   | /user/add-user           | Add a user            |
| GET    | /user/get-users          | Get all users         |
| DELETE | /user/delete-user/:id    | Delete a user by id   |

Body for add-user: `{ "name": "prasad", "email": "yash@gmail.com", "phonenumber": "6364624720" }`
