import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("wallets")
      .select("id, name, type, balance")
      .order("id", { ascending: true });

    if (error) throw error;

    return NextResponse.json(
      {
        success: true,
        message: "Berhasil mengambil data dompet",
        data: data,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("GET Wallets Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data dompet",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
