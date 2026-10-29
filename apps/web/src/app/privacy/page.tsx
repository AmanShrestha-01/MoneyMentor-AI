import type { Metadata } from "next";
import { PrivacySettings } from "@/components/privacy-settings";
import { PageHeader } from "@/components/ui";
import { brand } from "@/lib/brand";

export const metadata: Metadata = { title: "Profile & Privacy" };

export default function PrivacyPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Profile & Privacy">
        You decide what {brand.assistantName} can use. Everything here can be changed at any time, and changes take
        effect right away.
      </PageHeader>
      <PrivacySettings />
    </div>
  );
}
