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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 50;

    const { data, error } = await supabaseAdmin
      .from("transactions")
      .select(
        `
        id, 
        type, 
        amount, 
        description, 
        transaction_date,
        source_wallet:wallets!source_wallet_id(name),
        destination_wallet:wallets!destination_wallet_id(name)
      `,
      )
      .order("transaction_date", { ascending: false })
      .limit(limit);

    if (error) throw error;

    const formattedData = data.map((tx: any) => ({
      id: tx.id,
      type: tx.type,
      amount: tx.amount,
      description: tx.description,
      transaction_date: tx.transaction_date,
      source_wallet_name: tx.source_wallet ? tx.source_wallet.name : null,
      destination_wallet_name: tx.destination_wallet
        ? tx.destination_wallet.name
        : null,
    }));

    return NextResponse.json(
      {
        success: true,
        message: "Berhasil mengambil riwayat transaksi",
        data: formattedData,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("GET Transactions Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil riwayat transaksi",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
