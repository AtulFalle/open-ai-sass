'use client';
import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { MAX_FREE_COUNTS } from "@/constants";
import { Progress } from "@/components/ui/progress"
import { Button } from "./ui/button";
import { Zap } from "lucide-react";

const FreeCounter = ({ apiLimit = 0, isPro= false }: { apiLimit: number, isPro: boolean }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true)
    }, []);
    if (!mounted) {
        return null;
    }
    if(isPro) {
        return null;
    }
    return (
        <div className="px-3">
            <Card className="bg-white/10 border-0">
                <CardContent className="py-6">

                    <div className="text-center text-sm text-white mb-4 space-y-2">
                        <p>{apiLimit}/{MAX_FREE_COUNTS} Free generations</p>
                        
                        <Progress
                            className="h-3"
                            value={apiLimit / MAX_FREE_COUNTS * 100} />

                    </div>
                    <Button variant="premium" className="w-full ">
                        Upgrade
                        <Zap className="w-4 h-4 ml-2 fill-white"/>
                    </Button>
                </CardContent>

            </Card>
        </div>
    );
}

export default FreeCounter;