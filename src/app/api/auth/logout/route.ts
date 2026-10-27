import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const supabase = await createClient();
    // Invalidar la sesión en el servidor
    await supabase.auth.signOut({ scope: 'global' });
  } catch {
    // Continuar aunque falle — lo importante es limpiar las cookies
  }

  // Borrar TODAS las cookies que comiencen con 'sb-' (Supabase SSR tokens)
  const cookieStore = await cookies();
  const response = NextResponse.json({ success: true });

  cookieStore.getAll().forEach(({ name }) => {
    if (name.startsWith('sb-') || name.includes('supabase')) {
      response.cookies.set(name, '', {
        path: '/',
        maxAge: 0,
        expires: new Date(0),
        httpOnly: true,
        sameSite: 'lax',
      });
    }
  });

  return response;
}
