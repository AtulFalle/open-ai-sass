'use client';

import { UserButton } from "@clerk/nextjs";
import { ArrowRight, Code, ImageIcon, MessageSquare, Music, Video } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const tools = [
  {
    label: "Conversation",
    icon: MessageSquare,
    href: '/conversation',
    color: 'text-violet-500',
    bgCOlor: 'bg-violet-500/10'

  },
  {
    label: "Image generation",
    icon: ImageIcon,
    href: '/image',
    color: 'text-pink-700',
    bgCOlor: 'bg-pink-500/10'


  },
  {
    label: "Video generation",
    icon: Video,
    href: '/video',
    color: 'text-orange-700',
    bgCOlor: 'bg-orange-500/10'


  },
  {
    label: "Music generation",
    icon: Music,
    href: '/music',
    color: 'text-emerald-700',
    bgCOlor: 'bg-emerald-500/10'


  },
  {
    label: "Code generation",
    icon: Code,
    href: '/code',
    color: 'text-green-700',
    bgCOlor: 'bg-green-500/10'


  },
]
export default function DashBoardPage() {
  const router = useRouter();
  return (
    <div>

      <div className="mb-8 space-y-8">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          Explore the power of AI
        </h2>
        <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
          Chat with AI
        </p>

      </div>

      <div className="px-4 md:px-20 lg:px-32 space-y-4">

        {
          tools.map((tool) => (
            <Card
              onClick={() => { router.push(tool.href) }}
              key={tool.href}
              className={cn(
                "p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer"
              )}
            >
              <div
                className="flex items-center gap-x-4">
                <div
                  className={
                    cn(
                      "p-2 w-fit rounded-md",
                      tool.bgCOlor
                    )
                  }>
                  <tool.icon
                    className={
                      cn("w-8 h-8", tool.color)
                    } />
                </div>
                <div className="font-semibold">
                  {tool.label}
                </div>
              </div>
              <ArrowRight className="w-5 h-5" />

            </Card>

          ))
        }


      </div>

    </div>
  )
}
