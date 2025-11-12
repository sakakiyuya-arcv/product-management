const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({ 
    cloud_name: process.env.CLOUND_NAME, 
    api_key: process.env.CLOUND_KEY, 
    api_secret: process.env.CLOUND_SECRET
});

module.exports.upload = (req, res, next) => {
    if(req.file){
        let streamUpload = (fileBuffer) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
                streamifier.createReadStream(fileBuffer).pipe(stream);
            });
        };

        async function upload() {
            try {
                let result = await streamUpload(req.file.buffer);
                req.body[req.file.fieldname] = result.secure_url;
                next();
            } catch(error) {
                console.error("uploadCloud error:", error);
                req.flash("error", "Lỗi khi upload ảnh!");
                res.redirect(req.get('Referrer'));
            }
        }

        upload();
    } else {
        next();
    }
}