import supabase from "@/lib/supabase";


export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        const response = await supabase.auth.signUp({
            email,
            password
        })
        return Response.json({ message: response }, { status: 201 });

    } catch (error) {
        return Response.json({ message: error }, { status: 400 });
    }
}
