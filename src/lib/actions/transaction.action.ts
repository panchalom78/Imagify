"use server";
import Razorpay from "razorpay";
import Transaction from "../database/models/transaction.model";
import { connectToDatabase } from "../database/mongoose";
import { updateCredits } from "./user.action";
import { handleError } from "../utils";

var instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function createOrder(params: CreateOrderParams) {
    try {
        const options = {
            amount: params.amount * 100, // amount in smallest currency unit (paise for INR)
            currency: "INR",
            receipt: "order_" + Date.now(),
            notes: {
                plan: params.plan,
                credits: params.credits,
                buyerId: params.buyerId,
            },
        };

        const order = await instance.orders.create(options);
        return { success: true, data: order };
    } catch (error) {
        return { success: false, error: "Error creating order" };
    }
}

export async function verifyPayment(
    razorpay_order_id: string,
    razorpay_payment_id: string,
    razorpay_signature: string
) {
    try {
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const crypto = require("crypto");
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        return { success: true, isValid: isAuthentic };
    } catch (error) {
        return { success: false, error: "Error verifying payment" };
    }
}

export async function createTransaction(params: CreateTransactionParams) {
    try {
        await connectToDatabase();
        const transaction = await Transaction.create(params);
        await updateCredits(params.buyerId, params.credits);
        return JSON.parse(JSON.stringify(transaction));
    } catch (error) {
        handleError(error);
    }
}
