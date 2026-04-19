import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const { pin } = await req.json();

  if (!pin || typeof pin !== "string" || pin.length !== 6) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("admin_config")
    .select("value")
    .eq("key", "pin_hash")
    .single();

  if (error || !data) {
    return NextResponse.json({ success: false }, { status: 500 });
  }

  const match = await bcrypt.compare(pin, data.value);
  return NextResponse.json({ success: match });
}
