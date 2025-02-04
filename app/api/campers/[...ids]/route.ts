import supabase from "@/lib/supabase";

export async function DELETE(
  request: Request,
  { params }: { params: { ids: string[] } }
) {
  try {
    const { ids } = params;
    const numericIds = ids[0].split(',').map(id => parseInt(id));

    const { error } = await supabase
      .from('youth')
      .delete()
      .in('id', numericIds);

    if (error) {
      return Response.json({ error: `${error}` }, { status: 400 });
    }

    return Response.json(
      { message: 'Successfully Deleted!', status: 200  },
    );
  } catch (error) {
    return Response.json(
      { error: `${error}`},
      { status: 500 }
    );
  }
}