import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function GET() {
    await supabase.auth.signOut();
    const response = NextResponse.json(
        { message: "Logout successful" },
        { status: 200 }
    );
    response.cookies.delete("token");
    
    // Add redirect header to the response
    response.headers.set("Location", "/");
    response.headers.set("Content-Type", "application/json");
    
    return response;
}
