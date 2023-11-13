'use client';

import Heading from "@/components/heading";
import { Code } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from 'zod';
import { formSchema } from './constants'
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import OpenAI from 'openai';
import EmptyComponent from "@/components/empty";
import Loader from "@/components/loader";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/user-avatar";
import BotAvatar from "@/components/bot-avatar";
import ReactMarkdown from 'react-markdown';
import { UseProModal } from "@/hooks/use-pro-modal";
import toast from "react-hot-toast";

const CodePage = () => {

    const router = useRouter();
    const proModal = UseProModal();

    const [messages, setMessages] = useState<OpenAI.Chat.CreateChatCompletionRequestMessage[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        defaultValues: {
            prompt: ''
        },
        resolver: zodResolver(formSchema)
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const userMessage: OpenAI.Chat.CreateChatCompletionRequestMessage = {
                role: 'user',
                content: values.prompt
            }
            const newMessages = [...messages, userMessage];
            const res = await axios.post('/api/code', {

                messages: newMessages
            });
            setMessages((current) => [...current, userMessage, res.data]);
            form.reset();
        } catch (error: any) {
            if(error?.response?.status === 403) {
                proModal.onOpen();
            }else {
                toast.error('something went wrong')
            }
            console.log(error);

        } finally {
            router.refresh();
        }
    }

    return (
        <div>
            <Heading
                title="Code Generation"
                description="Generate code using prompt"
                icon={Code}
                iconColor="text-green-700"
                bgColor="bg-green-700/10" />

            <div className="px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}
                            className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2">

                            <FormField
                                name='prompt'
                                render={({ field }) => (
                                    <FormItem
                                        className="col-span-12 lg:col-span-10">
                                        <FormControl className="m-0 p-0">
                                            <Input
                                                className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent "
                                                disabled={isLoading}
                                                placeholder="How to create microservices using java ?"
                                                {...field}
                                            />

                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}> Generate</Button>
                        </form>
                    </Form>
                </div>

                <div className="space-y-4 mt-4">
                    {
                        isLoading && (
                            <div className="p-8 rounded-lg w-ful flex items-center justify-center bg-muted">
                                <Loader />

                            </div>
                        )
                    }
                    {
                        messages.length === 0 && !isLoading && (
                            <div>
                                <EmptyComponent
                                    label="No Conversation started !!" />
                            </div>
                        )
                    }

                    <div className="flex flex-col-reverse gap-y-4">
                        {
                            messages.map((message: OpenAI.Chat.CreateChatCompletionRequestMessage) => (
                                <div
                                    key={JSON.stringify(message?.content)}
                                    className={
                                        cn(
                                            "p-8 w-full flex items-start gap-x-8 rounded-lg",
                                            message.role === 'user' ? "bg-white border border-black/10" : 'bg-muted'
                                        )
                                    }
                                >
                                    {
                                        message.role === 'user' ?
                                            <UserAvatar />
                                            :
                                            <BotAvatar />
                                    }
                                    <p className="text-sm">

                                        {/* {JSON.stringify(message?.content)} */}
                                        <ReactMarkdown
                                            components={{
                                                pre: ({ node, ...props }) => (
                                                    <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                                                        <pre {...props}/>
                                                    </div>
                                                ),
                                                code: ({ node, ...props }) => (
                                                    <div className=" bg-black/10 rounded-lg p-1">
                                                        <code {...props}/>
                                                    </div>
                                                ),
                                            }}
                                            className="text-sm overflow-hidden leading-7">

                                            {message.content?.toString() || ''}
                                        </ReactMarkdown>
                                    </p>
                                </div>
                            ))
                        }

                    </div>
                </div>
            </div>
        </div>
    );
}

export default CodePage;