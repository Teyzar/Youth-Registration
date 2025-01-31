import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import TableData from "@/types/table.interface";

export async function GET() {
    const { data, error } = await supabase.from('youth').select('*');

    const campers: TableData[] = [];

    data?.forEach(async (item) => {
        const payment = item.dp_amount > 0 ? item.dp_amount : item.fp_amount;
        const payment_date = item.dp_date > item.fp_date ? item.dp_date : item.fp_date;
        campers.push({
            id: item.id,
            name: item.name,
            age: item.age,
            gender: item.gender,
            contact_number: item.contact_number,
            payment: payment,
            payment_date: payment_date,
            tshirt_paid: item.tshirt_paid,
            extra: item.extra,
            remarks: item.remarks,
        });
    });

    
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(campers);
}