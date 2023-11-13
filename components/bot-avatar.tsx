import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";


const BotAvatar = () => {

    return (
        <div>
            <Avatar className="h-8 w-8">
                <AvatarImage className="p-1" src="/logo.png" />
            </Avatar>
        </div>
    );
}

export default BotAvatar
