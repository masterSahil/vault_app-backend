const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./config/DB');
const cors = require('cors');
const userRoute = require('./routes/userRoute');
const fileRoute = require('./routes/fileRoute'); 
const credRoute = require('./routes/credRoute');
const linkRoute = require('./routes/linkRoute');
const noteRoute = require('./routes/noteRoute');
const searchRoute = require('./routes/search');

app.use(cors());
app.use(express.json());
app.use('/', userRoute);
app.use('/', fileRoute);
app.use('/', credRoute);
app.use('/', linkRoute);
app.use('/', noteRoute);
app.use('/', searchRoute);
app.use('/upload', express.static('upload'));

app.listen(process.env.PORT, () => {
  console.log(`App is Listening at Port ${process.env.PORT}`);
});

connectDB();