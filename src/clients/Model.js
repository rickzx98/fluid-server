import { mongoose } from "../imports";

const ClientSchema = mongoose.Schema({
    remoteAddress: {
        type: String,
        required: true
    },
    remotePort: {
        type: Number,
        required: true
    },
    domain: String,
    tcp: Object,
    createdDate: {
        type: Date,
        default: Date.now
    }
})

export const Client = mongoose.model("clients", ClientSchema);