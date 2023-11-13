
import prismadb from "@/lib/prismadb";
import stripe from "@/lib/stripe";

import { absoluteUrl } from "@/lib/utils";
import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";


const settingUrl = absoluteUrl("/settings");

export async function GET() {
    try {
        const { userId } = auth();
        const user = await currentUser();

        if (!userId || !user) {
            return new NextResponse('Unauthorized', { status: 410 })
        }

        const sub = await prismadb.userSubscription.findUnique({
            where: {
                userId
            }
        });

        if (sub && sub.stripeCustomerId) {
            const session = await stripe.billingPortal.sessions.create({
                customer: sub.stripeCustomerId,
                return_url: settingUrl
            });

            return NextResponse.json({ url: session.url });
        }
        const session = await stripe.checkout.sessions.create({
            success_url: settingUrl,
            cancel_url: settingUrl,
            payment_method_types: ['card'],
            mode: "subscription",
            billing_address_collection: "auto",
            customer_email: user.emailAddresses[0].emailAddress,
            line_items: [
                {
                    price_data: {
                        currency: 'INR',
                        product_data: {
                            name: 'Open AI buddy',
                            description: 'Unlimited AI Generations'
                        },
                        unit_amount: 2000,
                        recurring: {
                            interval: "month"
                        }
                    },
                    quantity: 1
                }
            ],
            metadata: {
                userId
            }
        });
        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal server error', { status: 500 })

    }
}