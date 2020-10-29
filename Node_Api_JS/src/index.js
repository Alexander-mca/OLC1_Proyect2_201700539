const express=require('express');
const morgan=require('morgan');
const cors=require('cors');
const app=express();
const bodyParser=require('body-parser');
//imports
const indexRoutes = require('./routes/indexRoutes');

//settings
const ip=process.env.NODEIPJS || "127.18.7.5";
const  port=process.env.NODEPORTJS || 3080;

//middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.use('/',indexRoutes);



//run
app.listen(port,ip, async() => {
    console.log('IP: %s PORT: %d', ip, port);
})