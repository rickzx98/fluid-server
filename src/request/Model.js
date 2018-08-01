import { mongoose } from "../imports";

const RequestSchema = mongoose.Schema({
    clientId: {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: true
    },
    data: Object,
    status: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

export const Request = mongoose.model("requests", RequestSchema);