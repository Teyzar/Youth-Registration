import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import { TableData } from "@/types";

export async function GET() {
    const { data, error } = await supabase.from('youth').select('*');
    
    const campers: TableData[] = [];

    data?.forEach(async (item) => {
        const payment = item.dp_amount > 0 ? item.dp_amount : item.fp_amount;
        console.log(item.fp_amount);
        console.log(item.dp_amount);
        const dp_date = item.dp_date;
        const fp_date = item.fp_date;
        campers.push({
            id: item.id,
            name: item.name,
            nickname: item.nickname,
            age: new Date().getFullYear() - new Date(item.birthdate).getFullYear(),
            gender: item.gender,
            contact_number: item.contact_number,
            payment: payment,
            dp_date: dp_date,
            fp_date: fp_date,
            tshirt_paid: item.tshirt_paid,
            extra: item.extra,
            remarks: item.remarks,
            status: payment >= 1500 ? 'FP' : 'DP',
            role: item.role,
        });
    });

    
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(campers);
}

export async function DELETE(request: Request) {
    const { ids } = await request.json();
    const { error } = await supabase.from('youth').delete().in('id', ids);
    
    if (error) {
        return NextResponse.json({ error: error.message, status: 500 });
    }
    return NextResponse.json({ message: "Successfully Deleted!", status: 200 });
}
