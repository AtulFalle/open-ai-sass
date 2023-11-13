'use client';

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import SideBar from "@/components/sidebar";
import { useEffect, useState } from "react";


const MobileSidebar = ({apiLimit = 0, isPro = false}: {apiLimit: number, isPro: boolean}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true)
    }, []);
    if (!isMounted) {
        return null;
    }
   
    return (
        <Sheet >
            <SheetTrigger>
                <Button variant="ghost" size="icon" className="md:hidden" >
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side='left' className="p-0">
                <SideBar isPro={isPro} apiLimit={apiLimit} />
            </SheetContent>
        </Sheet>
    );
}

export default MobileSidebar;