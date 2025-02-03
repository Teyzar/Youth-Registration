import supabase from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function DELETE(
    request: Request,
    { params }: {params: Promise<{ id: string }>}
  ) {
    const id = (await params).id
    const camper = await supabase.from('campers').delete().eq('id', id);
    return NextResponse.json(camper)
}