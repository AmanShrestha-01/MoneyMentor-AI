import type { Metadata } from "next";
import { Lesson } from "@/components/lesson";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "My Learning" };

export default function LearningPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="My Learning">
        Short lessons, about five minutes each. Pick any topic — the order is a suggestion, not a requirement.
      </PageHeader>
      <Lesson />
    </div>
  );
}
