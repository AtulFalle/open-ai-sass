import { auth } from "@clerk/nextjs";
import prismadb from "./prismadb";


const DAY_IN_MS = 86_400_000;

export const checkSub = async () => {
    const { userId } = auth();

    if (!userId) {
        return false;
    }

    const sub = await prismadb.userSubscription.findUnique({
        where: {
            userId
        }
    });
    if (!sub) {
        return false;
    }

    const isValid = sub.stripePriceId && (sub.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now());

    return !!isValid;
}
