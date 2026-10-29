import type { Metadata } from "next";
import { DecisionLab } from "@/components/decision-lab";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Decision Lab" };

export default function DecisionLabPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Decision Lab">
        Try out hypothetical numbers and see the trade-offs. Nothing here is saved, and nothing is connected to a bank
        account.
      </PageHeader>
      <DecisionLab />
    </div>
  );
}
