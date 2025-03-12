import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createTransaction } from "@/lib/actions/transaction.action";

export async function POST(req: NextRequest) {
    try {
        const body = await req.text();
        const signature = req.headers.get("x-razorpay-signature");

        if (!signature) {
            return NextResponse.json(
                { error: "No signature found" },
                { status: 400 }
            );
        }

        // Verify webhook signature
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
            .update(body)
            .digest("hex");

        if (expectedSignature !== signature) {
            return NextResponse.json(
                { error: "Invalid signature" },
                { status: 401 }
            );
        }

        const event = JSON.parse(body);

        // Handle different webhook events
        // switch (event.event) {
        //     case 'payment.captured':
        //         await handlePaymentCaptured(event.payload.payment.entity)
        //         break

        //     case 'payment.failed':
        //         await handlePaymentFailed(event.payload.payment.entity)
        //         break

        //     case 'refund.processed':
        //         await handleRefundProcessed(event.payload.refund.entity)
        //         break

        //     // Add more event handlers as needed
        // }

        if (event.event === "payment.captured") {
            await handlePaymentCaptured(event.payload.payment.entity);
        }

        return new Response("", { status: 200 });
    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

async function handlePaymentCaptured(payment: any) {
    // Example implementation
    try {
        // 1. Verify payment details
        const { id, order_id, amount, status, notes } = payment;

        const transction = {
            razorpayOrderId: order_id,
            amount: amount / 100,
            credits: notes.credits,
            plan: notes.plan,
            buyerId: notes.buyerId,
            createdAt: new Date(),
        };

        const newTransaction = await createTransaction(transction);

        return NextResponse.json({
            message: "OK",
            transaction: newTransaction,
        });
    } catch (error) {
        console.error("Error handling payment capture:", error);
        throw error;
    }
}

// async function handlePaymentFailed(payment: any) {
//     try {
//         // Handle failed payment
//         // 1. Update order status
//         // 2. Notify user
//         // 3. Log failure
//         console.log('Payment failed:', payment)
//     } catch (error) {
//         console.error('Error handling payment failure:', error)
//         throw error
//     }
// }

// async function handleRefundProcessed(refund: any) {
//     try {
//         // Handle refund
//         // 1. Update order status
//         // 2. Notify user
//         // 3. Update accounting records
//         console.log('Refund processed:', refund)
//     } catch (error) {
//         console.error('Error handling refund:', error)
//         throw error
//     }
// }
