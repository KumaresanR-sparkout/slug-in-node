const express = require("express");
const mongoose = require("mongoose");
const slugify = require("slugify");
const router = require("./router");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'images')));

// DB configuration
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.log('MongoDB connection error:', error.message));

// Slug configuration
const options = {
    replacement: '-',  // Replace spaces with the replacement character, defaults to `-`
    remove: /[^a-zA-Z0-9\s]/g, // Remove characters that match regex, defaults to `undefined`
    lower: true,      // Convert to lower case, defaults to `false`
    strict: false,    // Strip special characters except replacement, defaults to `false`
    locale: 'vi',     // Language code of the locale to use
    trim: true        // Trim leading and trailing replacement chars, defaults to `true`
};

// Schema definition
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true  // Ensure the slug is unique
    }
}, {
    versionKey: false
});

schema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = slugify(this.name + '-' + this._id.toString(), options);
    }
    next();
});

const User = mongoose.model('User', schema);

app.use("/", router);
app.get('/', (req, res) => {
    return res.send("Application is working");
});

app.get('/post', async (req, res) => {
    try {
        const user = new User({ name: "John" });
        await user.save();
        return res.json(user);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server started at http://localhost:3000');
});

// const path = req/uire("path");
const imageUrl = "https://d1a2vjo36k7zcv.cloudfront.net/mineX-uploads/cover-album/3e4a17de-0a9b-4f10-bce2-821ac570a2d6/96c80306-28f8-46b2-be9d-1bc9962d45781719905210384.jpg";
console.log(path.extname(imageUrl).slice(1));
console.log(path.basename(imageUrl));
