
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import Replicate from 'replicate';
import { increeseAPILimit, checkApiLimit } from '@/lib/api-limit';
import { checkSub } from '@/lib/subscription';

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN
})


export async function POST(req: Request) {

    try {

        const { userId } = auth();
        const body = await req.json();
        const { prompt } = body;
        const isPro = await checkSub();

        if (!userId) {
            return new NextResponse('UnAuthorized', { status: 401 });
        }
        if (!prompt) {
            return new NextResponse('prompt required', { status: 400 });

        }
        const freetTrial = await checkApiLimit();

        if (!freetTrial && !isPro) {
            return new NextResponse('Free trial expired', { status: 403 });
        }

        const output = await replicate.run(
            "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
            {
                input: {
                    prompt
                }
            }
        );
        if (!isPro) {
            await increeseAPILimit();
        }

        return NextResponse.json(output);



    } catch (error) {
        console.log('OPEN AI POST error', error);
        return new NextResponse('internal server error', { status: 500 })
    }
}