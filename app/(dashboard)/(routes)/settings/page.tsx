import Heading from "@/components/heading";
import SubButton from "@/components/sub-btn";
import { checkSub } from "@/lib/subscription";
import { Settings } from "lucide-react";


const SettingPage = async () => {

    const isPro = await checkSub();
    return (<div>
        <Heading
            title="Settings"
            description="Manage account setting"
            icon={Settings}
            iconColor="text-gray-700"
            bgColor="text-gray-700/10" />


        <div
            className="px-4 g-px-8 space-y-4">
            <div className="text-muted-foreground text-sm">
                {isPro ? "You are currently on a PRO plan" : "you are currently on FREE plan"}

            </div>
        </div>
        <SubButton isPro={isPro} />
    </div>);
}

export default SettingPage;