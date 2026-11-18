const path = require('path');
const express = require('express');
const cors = require('cors');
const sequelize = require('./util/database');
const userRoutes = require('./routes/user');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user', userRoutes);

const PORT = process.env.PORT || 3000;

sequelize
  .sync()
  .then(() => app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)))
  .catch((err) => console.error('Unable to connect to the database:', err.message));
