
import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { increeseAPILimit, checkApiLimit } from '@/lib/api-limit';
import { checkSub } from '@/lib/subscription';


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {

    try {

        const { userId } = auth();
        const body = await req.json();
        const { prompt, amount = 1, resolution = '512x512' } = body;
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

        const reponse = await openai.images.generate({
            model: 'dall-e-2',
            prompt,
            size: resolution,
            n: parseInt(amount) || 1,
            quality: "standard"

        });
        if (!isPro) {

            await increeseAPILimit();
        }

        return NextResponse.json([reponse.data[0].url]);



    } catch (error) {
        console.log('OPEN AI POST error', error);
        return new NextResponse('internal server error', { status: 500 })
    }
}