import { createClient } from "@/lib/supabase/server";
import { getFeeWithReceiptNo } from "@/app/actions/accounting";
import { notFound } from "next/navigation";
import ReceiptClient from "./ReceiptClient";

export default async function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const fee = await getFeeWithReceiptNo(resolvedParams.id);
  

  if (!fee) {
    return notFound();
  }

  return <ReceiptClient fee={fee} />;
}
