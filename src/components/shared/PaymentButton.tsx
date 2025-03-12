"use client";

import { useEffect } from "react";
import { createOrder, verifyPayment } from "@/lib/actions/transaction.action";
import { Button } from "../ui/button";
import { toast } from "sonner";

const PaymentButton = ({
    plan,
    amount,
    credits,
    buyerId,
}: CreateOrderParams) => {
    useEffect(() => {
        // Load Razorpay script
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handlePayment = async () => {
        try {
            // Create order
            const orderResponse = await createOrder({
                plan,
                amount,
                credits,
                buyerId,
            });
            if (!orderResponse.success) {
                return;
            }

            // Initialize Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderResponse.data?.amount,
                currency: "INR",
                name: "Your Company Name",
                description: "Payment Description",
                order_id: orderResponse.data?.id,
                handler: async (response: any) => {
                    try {
                        // Verify payment
                        const verification = await verifyPayment(
                            response.razorpay_order_id,
                            response.razorpay_payment_id,
                            response.razorpay_signature
                        );

                        if (verification.success && verification.isValid) {
                            toast.success("Payment successful");
                        } else {
                            toast.error("Payment failed");
                        }
                    } catch (error) {
                        toast.error("Payment failed");
                    }
                },
                prefill: {
                    name: "", // User's name
                    email: "", // User's email
                    contact: "", // User's phone
                },
                theme: {
                    color: "#3399cc",
                },
            };

            const razorpay = new (window as any).Razorpay(options);
            razorpay.open();
        } catch (error) {
            toast.error("Payment failed");
        }
    };

    return (
        <form action={handlePayment} method="POST">
            <section>
                <Button
                    type="submit"
                    role="link"
                    className="w-full rounded-full bg-purple-gradient bg-cover"
                >
                    Buy Credit
                </Button>
            </section>
        </form>
    );
};

export default PaymentButton;
