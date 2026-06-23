export type TransactionType = "INCOME" | "EXPENSE" | "TRANSFER";
export type AllocationStatus = "PENDING" | "PAID";

export interface TransactionPayload {
  type: TransactionType;
  source_wallet_id: number | null;
  destination_wallet_id: number | null;
  amount: number;
  description: string;
}
