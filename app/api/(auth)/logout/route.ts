import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function GET() {
    await supabase.auth.signOut();
    
    const response = NextResponse.json({ message: "Logout successful" });
    response.cookies.delete("token");
    return response;
}
