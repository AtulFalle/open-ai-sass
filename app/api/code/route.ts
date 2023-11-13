
import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { checkSub } from '@/lib/subscription';
import { checkApiLimit, increeseAPILimit } from '@/lib/api-limit';


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const instructionMesasge: any = {
    role: 'system',
    content: 'you are a code generator. You must answer only in markdown code snippet. Use code comments for explanations.'
}

export async function POST(req: Request) {

    try {

        const { userId } = auth();
        const body = await req.json();
        const { messages } = body;
        const isPro = await checkSub();
        const freetTrial = await checkApiLimit();


        if (!userId) {
            return new NextResponse('UnAuthorized', { status: 401 });
        }
        if (!messages) {
            return new NextResponse('Messages required', { status: 400 });

        }

        if (!freetTrial && !isPro) {
            return new NextResponse('Free trial expired', { status: 403 });
        }


        const reponse = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [instructionMesasge, ...messages]
        });
        if (!isPro) {

            await increeseAPILimit();
        }
        return NextResponse.json(reponse.choices[0].message);



    } catch (error) {
        console.log('OPEN AI POST error', error);
        return new NextResponse('internal server error', { status: 500 })
    }
}