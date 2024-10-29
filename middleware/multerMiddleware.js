import multer from "multer";
import path from 'path'

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"uploads/")
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+path.extname(file.originalname))
    }
})

const filefilter = (req,file,cb)=>{
    const fileTypes =/jpeg|jpg|png|gif/
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
    console.log(extname)
    const mimeType = fileTypes.test(file.mimetype);
    console.log(mimeType)
    if (!extname && !mimeType) {
        cb(new Error("Only images (jpeg, jpg, png, gif) are allowed")); 
        } 
        else {
        cb(null, true); 
    }
}


const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, 
    fileFilter: filefilter
});

export default upload;