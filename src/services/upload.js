import multer from 'multer'
//CONFIGURO MULTER
const storage = multer.diskStorage({
    destination:(req, file,cb)=>{
        cb(null,'public/images')
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+file.fieldname+"."+file.originalname.split(".")[1])
    }
})
const upload = multer({storage:storage});
//

export default upload;