const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: {   // in lesson { timestamps: true }
        currentTime: () => {    // this is to provide the correct local time
            const tm = new Date();
            tm.setMinutes(tm.getMinutes() - tm.getTimezoneOffset());
            return tm;
        }
    }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;