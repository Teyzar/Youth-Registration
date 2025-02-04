import supabase from "@/lib/supabase";
import { RegistrationFormData } from "@/types";
import { calculateExtra, isFullyPaid, fixPayment } from "@/lib/functions";

export async function POST(req: Request) {
    const formData = await req.json();
    return await handleRegistration(formData);
}

export async function PUT(req: Request) {
    const formData = await req.json();
    const searchParams = new URL(req.url).searchParams;
    const id = searchParams.get('id');

    if (!id) {
        return Response.json({ error: 'ID is required for updates' }, { status: 400 });
    }

    return await handleRegistration(formData, id);
}

async function handleRegistration(
    formData: {
        name: string,
        nickname: string,
        birthdate: string,
        gender: string,
        contact_number: string,
        payment: number,
        sponsor_amount: number,
        tshirt_paid: boolean,
        remarks: string
    }, 
    id?: string
) {
    const { 
        name, 
        nickname,
        birthdate,
        gender,
        contact_number,
        payment,
        sponsor_amount,
        tshirt_paid,
        remarks,
    } = formData;

    const extra = calculateExtra(payment);
    const fullyPaid = isFullyPaid(payment);

    const reqBody: RegistrationFormData = {
        name,
        nickname,
        birthdate,
        gender,
        contact_number,
        sponsor_amount,
        tshirt_paid,
        remarks
    };

    if (extra > 0) {
        reqBody.extra = extra;
    }

    if (fullyPaid) {
        reqBody.fp_amount = fixPayment;
        reqBody.fp_date = new Date();
    } else {
        reqBody.dp_amount = payment;
        reqBody.dp_date = new Date();
    }

    let data;
    if (id) {
        data = await supabase
            .from('youth')
            .update(reqBody)
            .eq('id', id);
    } else {
        data = await supabase
            .from('youth')
            .insert(reqBody);
    }

    return Response.json({data: data, status: 200});
}
