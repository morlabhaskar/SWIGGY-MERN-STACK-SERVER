const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');
const Firm = require('../models/Firm');


//for image
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/'); // Destination folder where the uploaded images will be stored
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Generating a unique filename
    }
});

const upload = multer({ storage: storage });

const addProduct = async (req,res) => {
    try {
        const {productName,price,category,bestseller,description} = req.body;
        const image = req.file ? req.file.filename : undefined;

        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);

        if(!firm) {
            return res.status(404).json({error:"No Firm Found"})
        }
        const products = new Product({
            productName,
            price,
            category,
            bestseller,
            description,
            image,
            firm : firm._id
        })
        const savedProduct = await products.save();
        firm.products.push(savedProduct);
        await firm.save()
        res.status(200).json({savedProduct})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({error : "intenal server error"})
        
    }
}

const getProductByFirm = async(req,res) => {
    try {
        const firmId = req.params.id
        const firm = await Firm.findById(firmId);

        if(!firm) {
            return res.status(404).json({error:"No Firm Found"})
        }
        const restarentName = firm.firmName;
        const products = await Product.find({firm : firmId});
        
        res.status(200).json({restarentName,products})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Internal Server Error"})
        
    }
}

const deleteProductById = async (req,res) => {
    try {
        const productId = req.params.productId;
        const deleteProduct = await Product.findByIdAndDelete(productId);
        
        if(!deleteProduct) {
            return res.status(404).json({error:"No Product Found"})
        }
        res.status(200).json({msg:"Product Deleted Successfully"})
    } catch (error) {
        console.log(error)
        res.status(404).json({error:"Internal Server Error"});
        
    }
}

module.exports = {addProduct : [upload.single('image'),addProduct],getProductByFirm,deleteProductById}