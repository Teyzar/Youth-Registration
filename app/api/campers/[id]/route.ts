import supabase from "@/lib/supabase";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const { name, nickname, birthdate, gender, contact_number, payment, sponsor_amount, tshirt_paid, remarks, extra } = await request.json();
        const { error } = await supabase.from('youth').update({
            name, 
            nickname,
            birthdate,
            gender,
            contact_number,
            payment,
            sponsor_amount,
            tshirt_paid,
            extra,
            remarks,
        }).eq('id', id);

        if (error) {
            return Response.json({ error: `${error}` }, { status: 400 });
        }

        return Response.json({ message: 'Successfully Updated!', status: 200 });

    } catch (error) {
        return Response.json({ error: `${error}` }, { status: 500 });
    }
}
