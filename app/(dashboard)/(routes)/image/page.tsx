'use client';

import Heading from "@/components/heading";
import { Download, ImageIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from 'zod';
import { amountOptions, formSchema, resolutionOptions } from './constants'
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
import Image from 'next/image'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardFooter } from "@/components/ui/card";
import { UseProModal } from "@/hooks/use-pro-modal";
import toast from "react-hot-toast";


const ImagePage = () => {

    const router = useRouter();
    const proModal = UseProModal();

    const [images, setImages] = useState<string[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        defaultValues: {
            prompt: '',
            amount: '1',
            resolution: '512x512'
        },
        resolver: zodResolver(formSchema)
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setImages([])
            const res = await axios.post('/api/image', values);
            // const urls = res?.data?.map((url) => url);
            setImages(res.data);
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
                title="Image Generation"
                description="Generate images using prompt"
                icon={ImageIcon}
                iconColor="text-pink-700"
                bgColor="bg-pink-700/10" />

            <div className="px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}
                            className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2">

                            <FormField
                                name='prompt'
                                render={({ field }) => (
                                    <FormItem
                                        className="col-span-12 lg:col-span-6">
                                        <FormControl className="m-0 p-0">
                                            <Input
                                                className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent "
                                                disabled={isLoading}
                                                placeholder="picture of fish in ocaen?"
                                                {...field}
                                            />

                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField name='amount' control={form.control}
                                render={({ field }) => (
                                    <FormItem className="col-span-12 lg:col-span-2 ">
                                        <Select disabled={isLoading}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue defaultValue={field.value} />
                                                    <SelectContent>
                                                        {amountOptions.map((amt) => (
                                                            <SelectItem
                                                                key={amt.value}
                                                                value={amt.value}>
                                                                {amt.value}

                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </SelectTrigger>
                                            </FormControl>

                                        </Select>


                                    </FormItem>
                                )}
                            />

                            <FormField name='resolution' control={form.control}
                                render={({ field }) => (
                                    <FormItem className="col-span-12 lg:col-span-2 ">
                                        <Select disabled={isLoading}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue defaultValue={field.value} />
                                                    <SelectContent>
                                                        {resolutionOptions.map((res) => (
                                                            <SelectItem
                                                                key={res.value}
                                                                value={res.value}>
                                                                {res.value}

                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </SelectTrigger>
                                            </FormControl>

                                        </Select>


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
                            <div className="p-20">
                                <Loader />

                            </div>
                        )
                    }
                    {
                        images.length === 0 && !isLoading && (
                            <div>
                                <EmptyComponent
                                    label="No Images generated !!" />
                            </div>
                        )
                    }

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
                        {
                            images.map((src) => (
                                <Card key={src} className="rounded-lg overflow-hidden">
                                    <div className="relative aspect-square">
                                        <Image
                                            alt="images"
                                            fill
                                            src={src}
                                        />
                                    </div>
                                    <CardFooter className="p-2">
                                        <Button
                                            onClick={() => window.open(src)}
                                            variant="secondary" className="w-full">
                                            <Download className="h-4 w-4 mr-2" />
                                            Download
                                        </Button>
                                    </CardFooter>

                                </Card>
                            )
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ImagePage;