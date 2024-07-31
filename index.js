const express = require("express");
const dotEnv = require('dotenv');
const mongoose = require('mongoose');
const vendorRoutes = require('./routes/vendorRoutes');
const bodyParser = require('body-parser');
const firmRoutes = require('./routes/firmRoutes');
const productRoutes = require('./routes/productRoutes')
const cors = require('cors');
const path = require('path')

const app = express()
const PORT = process.env.PORT || 4000;

dotEnv.config();
// app.use(cors())
app.use(
    cors({
        origin: ["http://localhost:5173","https://swiggy-mern-stack-server.vercel.app"],
        methods: ["GET,POST,DELETE,PUT,PATCH"],
        credentials: true,
    })
);
const MONGO_URL = process.env.MONGO_URL

mongoose.connect(MONGO_URL)
    .then(() => console.log("MongoDB connected successfully!"))
    .catch((error) => console.log(error))

app.use(bodyParser.json());

app.use('/vendor', vendorRoutes);  //middleware hit
app.use('/firm', firmRoutes)        //middleware hit
app.use('/product', productRoutes)        //middleware hit

app.use('/uploads',express.static('uploads'));

app.listen(PORT, () => {
    console.log(`server started and running at ${PORT}`)
});
app.get("/",(req,res)=>{
    res.send("Swiggy App is Running...")
})