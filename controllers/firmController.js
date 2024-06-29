
const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const multer = require('multer');
const path = require('path');

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

const addFirm = async(req, res) => {
    try {
        const { firmName, area, category, region, offer } = req.body;

        const image = req.file ? req.file.filename : undefined;

        const vendor = await Vendor.findById(req.vendorId);
        if (!vendor) {
            res.status(404).json({ message: "Vendor not found" })
        }
        if (!vendor) {
            res.status(404).json({ message: "Vendor not found" })
        }
        // if (vendor.firm.length > 0) {
        //     return res.status(400).json({ message: "vendor can have only one firm" });
        // }
        const firm = new Firm({
            firmName,
            area,
            category,
            region,
            offer,
            image,
            vendor: vendor._id
        })
        // await firm.save()

        const savedFirm = await firm.save();

        vendor.firm.push(savedFirm)

        await vendor.save()



        // return res.status(200).json({ message: 'Firm Added successfully ', firmId, vendorFirmName });
        return res.status(200).json({ message: 'Firm Added successfully ' });


    } catch (error) {
        console.log(error)
        res.status(500).json({error : "intenal server error"})
    }
}

const deleteFirmById = async (req,res) => {
    try {
        const firmId = req.params.firmId;
        const deleteFirm = await Firm.findByIdAndDelete(firmId);
        
        if(!deleteFirm) {
            return res.status(404).json({error:"No Product Found"})
        }
        res.status(200).json({msg:"Firm Deleted Successfully"})
    } catch (error) {
        console.log(error)
        res.status(404).json({error:"Internal Server Error"});
        
    }
}

module.exports = { addFirm: [upload.single('image'), addFirm],deleteFirmById }