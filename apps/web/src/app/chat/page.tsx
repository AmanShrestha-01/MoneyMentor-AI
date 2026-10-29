import type { Metadata } from "next";
import { ChatDemo } from "@/components/chat-demo";
import { PageHeader } from "@/components/ui";
import { brand } from "@/lib/brand";

export const metadata: Metadata = { title: `${brand.assistantName} Chat` };

export default function ChatPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={`${brand.assistantName} Chat`}>
        Your money-learning companion. This preview walks through one scripted scenario; the AI connection
        arrives in Sprint 2.
      </PageHeader>
      <ChatDemo />
    </div>
  );
}
