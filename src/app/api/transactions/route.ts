import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const apiKey = request.headers.get("x-api-key");
    if (apiKey !== process.env.API_SECRET_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rawBody: any = await request.json();

    const cleanSourceId =
      rawBody.source_wallet_id === 0 ||
      rawBody.source_wallet_id === "0" ||
      rawBody.source_wallet_id === "" ||
      !rawBody.source_wallet_id
        ? null
        : Number(rawBody.source_wallet_id);

    const cleanDestId =
      rawBody.destination_wallet_id === 0 ||
      rawBody.destination_wallet_id === "0" ||
      rawBody.destination_wallet_id === "" ||
      !rawBody.destination_wallet_id
        ? null
        : Number(rawBody.destination_wallet_id);

    const cleanAmount = Number(rawBody.amount);

    const { data, error } = await supabaseAdmin
      .from("transactions")
      .insert([
        {
          type: rawBody.type,
          source_wallet_id: cleanSourceId,
          destination_wallet_id: cleanDestId,
          amount: cleanAmount,
          description: rawBody.description,
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
