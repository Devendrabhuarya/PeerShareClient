import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'please provide a username']
    },
    email: {
        type: String,
        required: [true, 'please provide a email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'please provide a password']
    }
});

const User = mongoose.models.users || mongoose.model("users", userSchema);
export default User;