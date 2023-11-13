import NavBar from "@/components/navbar";
import SideBar from "@/components/sidebar";
import { getAPILimitCount } from "@/lib/api-limit";
import { checkSub } from "@/lib/subscription";

const DashboardLayout = async (
    { children }: { children: React.ReactNode }
) => {
    const apiLimit = await getAPILimitCount();
    const isPro = await checkSub();
    return (
        <div className="h-full relative">
            <div className="hidden md:flex h-full md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900 md:w-72">
                <SideBar apiLimit={apiLimit} isPro={isPro} />
            </div>

            <main className="md:pl-72">
                <NavBar apiLimit={apiLimit} />
                {children}</main>

        </div>
    );
}

export default DashboardLayout;