import mongoose, { Schema } from "mongoose";

const phaseSchema = new Schema({
    title: {
        type: String,
        required: [true, "Please provide title of phase"],
    },
    deadline: {
        type: Date,
        required: [true, "Set deadline for phase"],
    },
    currentPhase: {
        type: Number,
        default: 1,
    },
    tasks: [
        {
            type: Schema.Types.ObjectId,
            ref: "Task",
            required: [true, "Please add some task in your phase"],
        },
    ],
});

const Phase = mongoose.models.Phase || mongoose.model("Phase", phaseSchema);
export default Phase;
