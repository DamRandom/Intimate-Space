/**
 * Cliente Supabase con service_role_key para operaciones de servidor admin.
 * ¡NUNCA usar en el cliente/browser! Solo en API routes y server actions.
 *
 * CONFIGURACIÓN REQUERIDA en .env.local y Vercel:
 *   SUPABASE_SERVICE_ROLE_KEY=eyJ...  (obtenla en Supabase → Settings → API)
 */
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

let adminClient: any = null;

export function createAdminClient() {
  if (adminClient) return adminClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.warn(
      '⚠️  Falta SUPABASE_SERVICE_ROLE_KEY en las variables de entorno. ' +
      'Configúrala en .env.local para bypass de RLS en el panel admin.'
    );
  }

  adminClient = createSupabaseClient<any>(supabaseUrl || '', serviceRoleKey || '', {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return adminClient;
}
