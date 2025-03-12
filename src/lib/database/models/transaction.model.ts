import { Schema, model, models } from "mongoose";

const TransactionSchema = new Schema({
    createdAt: {
        type: Date,
        default: Date.now,
    },
    razorPayOrderId: {
        type: String,
    },
    amount: {
        type: Number,
        required: true,
    },
    plan: {
        type: String,
    },
    credits: {
        type: Number,
    },
    buyerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

const Transaction =
    models?.Transaction || model("Transaction", TransactionSchema);

export default Transaction;
