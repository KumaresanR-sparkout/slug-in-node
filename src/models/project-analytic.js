const { Schema, model } = require("mongoose");



const analyticSchema = new Schema({
    seller_id: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    project_id: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    NDA_signs: {
        type: Number,
        required: true,
        default: 0,
    },
    views: {
        type: Number,
        required: true,
        default: 0,
    },
    clicks: {
        type: Number,
        required: true,
        default: 0,
    },
    saves: {
        type: Number,
        required: true,
        default: 0,
    },
    is_deleted: {
        type: Boolean,
        required: true,
        default: false,
    },
    status: {
        type: Number,
        required: true,
        default: 1,
    },
    created_at: {
        type: Date,
        default: Date.now,
    }
});

module.exports = model('project-analytics', analyticSchema);