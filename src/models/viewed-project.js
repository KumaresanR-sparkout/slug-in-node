const { Schema, model } = require("mongoose");


const viewedProjectSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    project_id: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    os: {
        type: String,
        required: true,
    },
    browser: {
        type: String,
        required: true,
    },
    ip_address: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    country_iso3_code: {
        type: String,
        required: true,
    },
    is_desktop: {
        type: Boolean,
        required: true,
    },
    is_tablet: {
        type: Boolean,
        required: true,
    },
    is_mobile: {
        type: Boolean,
        required: true,
    },
    is_searched: {
        type: Boolean,
        required: true,
    },
    is_direct_link: {
        type: Boolean,
        required: true,
    },
    is_deleted: {
        type: Boolean,
        required: true,
    },
    status: {
        type: Number,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    }

})

module.exports = model('viewed-projects', viewedProjectSchema);