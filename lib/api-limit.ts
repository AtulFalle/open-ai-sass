import { auth } from '@clerk/nextjs';
import prismadb from './prismadb';
import { MAX_FREE_COUNTS } from '@/constants';

export const increeseAPILimit = async () => {

    const { userId } = auth();

    if (!userId) {
        return;
    }

    const userApiLimit = await prismadb.userApiLimit.findUnique({
        where: {
            userId
        }
    });
    if (userApiLimit) {
        await prismadb.userApiLimit.update({
            where: { userId },
            data: { count: userApiLimit.count + 1 }
        })
    } else {
        await prismadb.userApiLimit.create({
            data: { userId: userId, count: 1 }
        })
    }
}

export const checkApiLimit = async () => {

    const { userId } = auth();
    if (!userId) {
        return;
    }

    const limit = await prismadb.userApiLimit.findUnique({
        where: { userId }
    });

    if (!limit || limit.count < MAX_FREE_COUNTS) {
        return true;
    }
    return false
}

export const getAPILimitCount = async () => {
    const { userId } = auth();
    if (!userId) {
        return 0;
    }
    const limit = await prismadb.userApiLimit.findUnique({
        where: {
            userId
        }
    });

    if (!limit) {
        return 0
    }
    return limit.count;
}