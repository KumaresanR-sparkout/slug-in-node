const axios = require("axios");
const sharp = require("sharp");
const path = require("path");
const imageUrl = "https://d1a2vjo36k7zcv.cloudfront.net/mineX-uploads/cover-album/3e4a17de-0a9b-4f10-bce2-821ac570a2d6/96c80306-28f8-46b2-be9d-1bc9962d45781719905210384.jpg";

const compressImage = async (req, res) => {
    try {
        const response = await axios({
            url: imageUrl,
            responseType: 'arraybuffer',
        });
        console.log(response.data);
        const opath = path.join(process.cwd(), 'images', 'sampl.jpg');
        sharp(response.data)
            .resize(800, 600, {
                fit: 'inside',
                withoutEnlargement: true,
            })
            .jpeg({ quality: 80, progressive: true })
            .toFile(opath, (err, info) => {
                if (err) {
                    console.log('image compress error:', err.message);
                }
                console.log(info);
            });
        // sharp('./images/sampl.jpg')
        //     .resize(200)
        //     .jpeg({ mozjpeg: true })
        //     .toBuffer()
        //     .then(data => {
        //         console.log(data);
        //     })
        //     .catch(err => {
        //         console.log("error:", err.message)
        //     });

        // fetch('https://www.goldapi.io/api/XAU/USD/', {
        //     method: 'GET',
        //     headers: {
        //         'x-access-token': 'goldapi-1fho32sm03fkfcm-io'
        //     }
        // })
        //     .then(response => response.json())
        //     .then(res => console.log(res))
        //     .catch(error => console.log('gsgg', error.message))

        return res.send('11344')
    }
    catch (error) {
        console.log('error message:', error.message);
    }
}

module.exports = {
    compressImage
}