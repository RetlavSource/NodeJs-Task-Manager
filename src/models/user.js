const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid!');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"!');
            }
        }

    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number!');
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
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

// Establish a relationship from the user and their tasks
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});

// Method to send the only necessary user fields to the client
// It overrides the default toJSON method for converting the user to JSON object
// *.toJSON is used by the JSON.stringify method to enable the transformation of an object's data for JavaScript Object Notation (JSON) serialization.
// Example:
// const pet = {
//     name: 'Hal'
// }
// pet.toJSON = function () {
//     console.log(this);
//     return {name: 'Milu'};
// };
// console.log(JSON.stringify(pet)); // prints to the console: {"name":"Milu"}
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;
};

// Method specific to a user, not to a model, to generate a JSON Web Token
// These methods are accessible on the instances of a Model  (instance methods)
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
};

// Method binded and specific to the Model to find user by email, and check the hashed password
// Static methods are accessible on the Model (Model methods)
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Unable to login!');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Unable to login!');
    }

    return user;
};

// Hash the plain text password before saving the user
userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

// Delete user tasks when user is removed
userSchema.pre('remove', async function (next) {
    const user = this;
    await Task.deleteMany({ owner: user._id });
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;