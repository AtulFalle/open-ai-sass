'use client';

import Heading from "@/components/heading";
import { Video } from "lucide-react";
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
import { UseProModal } from "@/hooks/use-pro-modal";
import toast from "react-hot-toast";

const VideoPage = () => {

    const router = useRouter();
    const proModal = UseProModal();

    const [video, setVideo] = useState<string>('');

    const form = useForm<z.infer<typeof formSchema>>({
        defaultValues: {
            prompt: ''
        },
        resolver: zodResolver(formSchema)
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setVideo('');
            const res = await axios.post('/api/video', values);
            setVideo(res?.data[0])
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
                title="Video Generator"
                description="Generate Video using AI"
                icon={Video}
                iconColor="text-orange-700"
                bgColor="bg-orange-700/10" />

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
                                                placeholder="fish swimming in coral"
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
                        !video && !isLoading && (
                            <div>
                                <EmptyComponent
                                    label="No   !!" />
                            </div>
                        )
                    }

                    {
                        video && (
                            <video controls className="w-full mt-8 aspect-video rounded-lg border">
                                <source src={video} />
                            </video>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default VideoPage;