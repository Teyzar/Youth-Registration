import supabase from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();
        const response = await supabase.auth.signInWithPassword({
            email,
            password
        })

        const token = response.data.session?.access_token;

        if (token) {
            const response = NextResponse.json({ message: "Login successful" }, { status: 201 });
            response.cookies.set("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24 * 30,
                sameSite: "strict",
                path: "/"
            });
            return response;
        }

        return NextResponse.json({ message: response.error?.message }, { status: 400 });
        
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 400 });
    }
}