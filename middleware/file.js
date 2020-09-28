const multer = require("multer");
const uuid = require("uuid")

const store = multer.diskStorage({
    destination : (req,file,callback) =>{
        callback(null, "images")
    },
    filename : (req,file,callback) => {
        callback(null,uuid.v4() + file.originalname)
    }
})

const fileTypes = ["image/png","image/jpg","image/jpeg"]

const fileFilter = (req,file,callback) => {
    if (fileTypes.includes(file.mimetype)) {
        callback(null,true)
    } else {
        callback(null,false)
    }
}

module.exports = multer({
    storage : store,
    fileFilter
})