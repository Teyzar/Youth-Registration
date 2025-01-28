import supabase from "@/lib/supabase";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
    const { name, email, phone, message } = await req.json();
    const { data, error } = await supabase.from('messages').insert({ name, email, phone, message });
    return NextResponse.json({ data, error });
}
