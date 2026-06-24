import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data: wallets, error: walletsError } = await supabaseAdmin
      .from("wallets")
      .select("balance");

    if (walletsError) throw walletsError;

    const totalBalance = wallets.reduce(
      (sum, wallet) => sum + Number(wallet.balance),
      0,
    );

    const now = new Date();
    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
    ).toISOString();

    const { data: transactions, error: txError } = await supabaseAdmin
      .from("transactions")
      .select("type, amount")
      .gte("transaction_date", startOfMonth);

    if (txError) throw txError;

    let income = 0;
    let expense = 0;

    transactions.forEach((tx) => {
      if (tx.type === "INCOME") income += Number(tx.amount);
      if (tx.type === "EXPENSE") expense += Number(tx.amount);
    });

    return NextResponse.json(
      {
        success: true,
        message: "Berhasil mengambil ringkasan",
        data: {
          totalBalance,
          income,
          expense,
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("GET Summary Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil ringkasan",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
