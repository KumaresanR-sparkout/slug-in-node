const express = require("express");
const mongoose = require("mongoose");
const slugify = require("slugify");
const app = express();

app.use(express.json());

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

schema.pre('save', function(next) {
    if (this.isModified('name')) {
        this.slug = slugify(this.name + '-' + this._id.toString(), options);
    }
    next();
});

const User = mongoose.model('User', schema);

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
