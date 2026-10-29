import type { Metadata } from "next";
import { ResourceList } from "@/components/resource-list";
import { PageHeader } from "@/components/ui";
import { brand } from "@/lib/brand";

export const metadata: Metadata = { title: "Resources" };

export default function ResourcesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Resources">
        Real help from people and programs. Lots of students use these — asking is normal, and you don&apos;t have to
        explain why.
      </PageHeader>
      <ResourceList />
      <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
        {brand.assistantName} only shows listings stored in {brand.productName}&apos;s verified directory. It won&apos;t
        guess whether you&apos;re eligible — each program decides that. Campus entries in brackets are placeholders until
        the research team confirms them with each office.
      </p>
    </div>
  );
}
