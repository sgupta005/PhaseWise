import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, "Please provide name of user"],
        },
        email: {
            type: String,
            unique: true,
            required: [true, "Please provide email of user"],
        },
        phoneNo: {
            type: Number,
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Please provide password of user"],
        },
        role: {
            type: String,
            enum: ["student", "faculty", "admin"],
            required: true,
            default: "student",
        },
        profilePicture: {
            type: String,
        },
        refreshToken: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
