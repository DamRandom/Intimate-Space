import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabaseUser = await createClient();
    const { data: { user } } = await supabaseUser.auth.getUser();

    if (!user || user.app_metadata?.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { nombre, nombreDisplay, whatsapp, especialidades, estado, fotoUrl, notas } = body;

    const supabase = createAdminClient();

    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (nombre !== undefined) updateData.nombre = nombre;
    if (nombreDisplay !== undefined) updateData.nombre_display = nombreDisplay;
    if (whatsapp !== undefined) updateData.whatsapp = whatsapp;
    if (especialidades !== undefined) updateData.especialidades = especialidades;
    if (estado !== undefined) updateData.estado = estado;
    if (fotoUrl !== undefined) updateData.foto_url = fotoUrl;
    if (notas !== undefined) updateData.notas = notas;

    const { data, error } = await supabase
      .from('masajistas')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error interno' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabaseUser = await createClient();
    const { data: { user } } = await supabaseUser.auth.getUser();

    if (!user || user.app_metadata?.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const supabase = createAdminClient();

    // Ver si tiene reservas asociadas
    const { count, error: countErr } = await supabase
      .from('reservas')
      .select('id', { count: 'exact', head: true })
      .eq('masajista_id', id);

    if (countErr) {
      return NextResponse.json({ error: countErr.message }, { status: 500 });
    }

    // Si tiene reservas, en lugar de borrar para mantener integridad, se deshabilita
    if (count && count > 0) {
      const { data, error } = await supabase
        .from('masajistas')
        .update({ estado: 'deshabilitado', updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Masajista tiene historial de reservas; se marcó como deshabilitado.',
        data 
      });
    }

    const { error } = await supabase
      .from('masajistas')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Masajista eliminado' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error interno' }, { status: 500 });
  }
}
