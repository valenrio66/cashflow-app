import { supabaseAdmin } from "@/lib/supabase";
import { TransactionPayload } from "@/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const apiKey = request.headers.get("x-api-key");
    if (apiKey !== process.env.API_SECRET_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: TransactionPayload = await request.json();

    const { data, error } = await supabaseAdmin
      .from("transactions")
      .insert([
        {
          type: body.type,
          source_wallet_id: body.source_wallet_id,
          destination_wallet_id: body.destination_wallet_id,
          amount: body.amount,
          description: body.description,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      {
        success: true,
        message: "Transaksi berhasil dicatat",
        data,
      },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
