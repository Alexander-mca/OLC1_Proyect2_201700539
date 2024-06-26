const express=require('express');
const morgan=require('morgan');
const cors=require('cors');
const app=express();
const bodyParser=require('body-parser');
//imports
const indexRoutes = require('./routes/indexRoutes');


//settings
const ip=process.env.NODEIPJS || "0.0.0.0";
const  port=process.env.NODEPORTJS || 3080;

//middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.set('ip',process.env.NODEIPJS||"182.18.7.5");
app.set('port',process.env.NODEPORTJS||3080);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.use('/',indexRoutes);


//run
app.listen(port, async() => {
    console.log('IP: %s PORT: %d', ip, port);
    //console.log('Server on Port %d',port);
})