import supabase from "@/lib/supabase";
import { calculateExtra, fixPayment, isFullyPaid } from "@/lib/functions";
import { RegistrationFormData } from "@/types";

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
  } else {
      reqBody.extra = 0;
  }

  if (fullyPaid) {
      reqBody.fp_amount = fixPayment;
      reqBody.fp_date = new Date();

      reqBody.dp_amount = 0;
      reqBody.dp_date = undefined;
  } else {
      reqBody.dp_amount = payment;
      reqBody.dp_date = new Date();

      if (reqBody.fp_date) {
          reqBody.fp_date = undefined;
          reqBody.fp_amount = 0;
      }
  }

  console.log(reqBody);

  const data = await supabase
      .from('youth')
      .update(reqBody)
      .eq('id', id);
  return Response.json({data: data, status: 200});
}