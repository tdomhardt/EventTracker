import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Event = new Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    date: {
        type: Date
    },
    status: {
        type: String,
        default: 'Open'
    }
});

export default mongoose.model('Event', Event);