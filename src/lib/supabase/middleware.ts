import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // Si faltan variables de entorno, permite continuar la petición sin romper la navegación.
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: Validar la identidad con getUser() en el servidor.
  // No se debe confiar en getSession() por sí solo para decisiones de autorización.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Helper para construir respuestas de redirección conservando cookies renovadas
  const createRedirectResponse = (targetPath: string): NextResponse => {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = targetPath;
    redirectUrl.search = ''; // Evita propagar query params innecesarios

    const redirectResponse = NextResponse.redirect(redirectUrl);

    // Traspasar cookies renovadas a la respuesta de redirección
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
    });

    return redirectResponse;
  };

  // Regla 2: Proteger /admin y todas sus subrutas
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    if (!user) {
      return createRedirectResponse('/login');
    }

    // Regla 5: El rol de administrador se lee estrictamente de user.app_metadata.role
    const role = user.app_metadata?.role;
    if (role !== 'admin') {
      return createRedirectResponse('/mi-cuenta');
    }
  }

  // Regla 3: Proteger /mi-cuenta y todas sus subrutas
  if (pathname === '/mi-cuenta' || pathname.startsWith('/mi-cuenta/')) {
    if (!user) {
      return createRedirectResponse('/login');
    }
  }

  return supabaseResponse;
}
