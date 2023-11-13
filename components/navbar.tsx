import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import MobileSidebar from "@/components/mobile-sidebar";
import { checkSub } from "@/lib/subscription";

const NavBar = async({apiLimit = 0} : {apiLimit: number}) => {
    const isPro = await checkSub();
    return ( 
    <div className="flex items-center p-4">
       <MobileSidebar apiLimit={apiLimit} isPro={isPro}/>
        <div className="flex w-full justify-end">
        <UserButton afterSignOutUrl="/"/>

        </div>

    </div> 
    );
}
 
export default NavBar;