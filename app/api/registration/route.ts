import supabase from "@/lib/supabase";
import { RegistrationFormData } from "@/types";
import { calculateExtra, isFullyPaid, fixPayment } from "@/lib/functions";

export async function POST(req: Request) {
    const formData = await req.json();
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        console.error('Authentication error:', authError);
        return Response.json(
            { error: 'Authentication required' },
            { status: 401 }
        );
    }
    return await handleRegistration(formData);
}

export async function PUT(req: Request) {
    const formData = await req.json();
    const id = req.url.split('?id=')[1];

    console.log('id', id);

    if (!id) {
        return Response.json({ error: 'ID is required for updates' }, { status: 400 });
    }

    return await handleRegistration(formData, id);
}

async function handleRegistration(
    formData: {
        name: string,
        nickname: string,
        birthdate: Date,
        gender: string,
        contact_number: string,
        payment: number,
        sponsor_amount: number,
        tshirt_paid: boolean,
        remarks: string,
        age: number
    }, 
    id?: string
) {
    const { 
        name, 
        nickname,
        birthdate,
        age,
        gender,
        contact_number,
        payment = 0,
        sponsor_amount = 0,
        tshirt_paid = false,
        remarks = '',
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
    } else {
        reqBody.extra = 0;
    }

    if (age) {
        reqBody.birthdate = new Date(new Date().getFullYear() - age, 0, 1);
    }

    if (fullyPaid) {
        reqBody.fp_amount = fixPayment;
        reqBody.fp_date = new Date();

        if (id) {
            reqBody.dp_amount = 0;
            reqBody.dp_date = null;
        }
    } else {
        reqBody.dp_amount = payment;
        reqBody.dp_date = new Date();
        
        if (id) {
            reqBody.fp_date = null;
            reqBody.fp_amount = 0;
        }
    }
    // For testing purposes only
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

    if (data.error) {
        return Response.json({ error: data.error.message, status: data.status});
    }

    return Response.json({data: data, status: 200});
}
