const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const {connect} = require('mongoose');
require('dotenv').config();
const userRoutes = require('./routes/UserRoutes');
const postRoutes = require('./routes/PostRoutes');
const { notFound, errorHandler } = require('./middlware/ErrorMiddleware');
const upload = require('express-fileupload');



const app = express();
app.use(express.json({extended:true}));
app.use(express.urlencoded({extended:true}));
app.use(cors({credentials:true, origin: "http://localhost:3000"}));
app.use(upload());
app.use('/uploads', express.static(__dirname+'/uploads'));

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.use(notFound);
app.use(errorHandler);


connect(process.env.MONGO_URL).then(app.listen(5000, () => console.log(`server is running on port ${process.env.PORT}`))).catch(error => {console.log(error)})


app.listen(() => console.log(`server is up and running at port ${process.env.PORT}`));


