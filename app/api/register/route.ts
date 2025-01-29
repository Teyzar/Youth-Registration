import supabase from "@/lib/supabase";
import RegistrationFormData from "@/types/register.types";


const fixPayment = 1500;

function calculateExtra(payment: number) : number {

    let extra = 0;
    if (payment > fixPayment) {
        extra = Math.abs(payment - fixPayment);
    }
    return extra
}

function isFullyPaid(payment: number) : boolean {
    return payment >= fixPayment ? true : false;
}

export async function POST(req: Request) {
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
    } = await req.json();

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

    const data = await supabase.from('youth').insert(reqBody);

    return Response.json(data);
}
