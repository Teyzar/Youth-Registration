import supabase from "@/lib/supabase";
import { calculateExtra, fixPayment, isFullyPaid } from "@/lib/functions";
import { RegistrationFormData } from "@/types";

export async function DELETE(
  context: { params: Promise<{ ids: string[] }> }
) {
  try {
    const { ids } = await context.params;
    const numericIds = ids[0].split(',').map(id => parseInt(id));

    console.log('numericIds', numericIds);

    const { data, error } = await supabase
      .from('youth')
      .delete()
      .in('id', numericIds)
      .select();
    
    console.log('error', data);

    if (error) {
      return Response.json({ error: `${error}` }, { status: 400 });
    }

    return Response.json(
      { message: 'Successfully Deleted!', status: 200 }
    );
  } catch (error) {
    return Response.json(
      { error: `${error}`},
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const {
      name,
      age,
      gender,
      contact_number,
      payment,
      tshirt_paid,
      remarks,
  } = await req.json();
  const searchParams = new URL(req.url).searchParams;
  const id = searchParams.get('id');

  const fullyPaid = isFullyPaid(payment);
  const extra = calculateExtra(payment);

  const reqBody: RegistrationFormData = {
      name,
      gender,
      contact_number,
      tshirt_paid,
      remarks,
  };

  if (age) {
      reqBody.birthdate = new Date(new Date().getFullYear() - age, 0, 1);
  }

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

  console.log(reqBody);

  const data = await supabase
      .from('youth')
      .update(reqBody)
      .eq('id', id);
  return Response.json({data: data, status: 200});
}