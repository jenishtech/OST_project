const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./config/db');

require('dotenv').config(); 

connectDB();
app.use(cors());
app.use(express.json());

const programRoutes = require('./routes/programRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
app.use('/api', programRoutes);
app.use('/api', registrationRoutes);


app.get('/', (req, res) => {
  res.send('Welcome to the OST Portal API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
