import { mongoose } from "../imports";

const ActionSchema = mongoose.Schema({
    context: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    version: String,
    author: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    downloaded: {
        type: Boolean,
        required: true,
        default: false
    },
    lastDownload: {
        type: Date,
        required: true
    }
})

export const Action = mongoose.model("actions", ActionSchema);