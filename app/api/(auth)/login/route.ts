import supabase from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (authError) {
            return NextResponse.json(
                { message: authError.message }, 
                { status: authError.status || 400 }
            );
        }

        const token = authData.session?.access_token;
        
        if (token) {
            const response = NextResponse.json(
                { message: "Login successful" }, 
                { status: 200 }  // Changed from 201 to 200 as login is not creating a resource
            );
            
            // Set the session in Supabase client
            await supabase.auth.setSession({
                access_token: token,
                refresh_token: authData.session?.refresh_token || token
            });

            // Set the cookie
            response.cookies.set("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24 * 30,
                sameSite: "strict",
                path: "/"
            });
            
            return response;
        }

        return NextResponse.json(
            { message: "Authentication failed" }, 
            { status: 401 }
        );
        
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { message: "An unexpected error occurred" }, 
            { status: 500 }
        );
    }
}