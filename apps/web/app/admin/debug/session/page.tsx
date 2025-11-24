/**
 * Página de Debug de Sesión
 * 
 * Muestra información detallada de la sesión de Supabase para debugging.
 * Útil para verificar que los datos de role y club_id están correctamente configurados.
 */

import { createClient } from '@repo/supabase/server'

export const dynamic = 'force-dynamic'

export default async function DebugSessionPage() {
  const supabase = await createClient()
  const { data: { session }, error } = await supabase.auth.getSession()

  const debugData = {
    session: session ? {
      access_token: session.access_token ? `${session.access_token.substring(0, 20)}...` : null,
      refresh_token: session.refresh_token ? `${session.refresh_token.substring(0, 20)}...` : null,
      expires_at: session.expires_at,
      expires_in: session.expires_in,
      token_type: session.token_type,
      user: session.user ? {
        id: session.user.id,
        email: session.user.email,
        created_at: session.user.created_at,
        email_confirmed_at: session.user.email_confirmed_at,
        last_sign_in_at: session.user.last_sign_in_at,
        user_metadata: session.user.user_metadata,
        app_metadata: session.user.app_metadata,
      } : null,
    } : null,
    user_metadata: session?.user?.user_metadata ?? null,
    app_metadata: session?.user?.app_metadata ?? null,
    email: session?.user?.email ?? null,
    role: session?.user?.user_metadata?.role ?? 'NO ROLE DETECTED',
    club_id: session?.user?.user_metadata?.club_id ?? 'NO CLUB_ID',
    error: error ? {
      message: error.message,
      status: error.status,
    } : null,
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Debug de Sesión Supabase
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            Información completa de la sesión actual para debugging
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h2 className="text-lg font-semibold text-red-900 mb-2">Error al obtener sesión</h2>
              <pre className="text-sm text-red-800 overflow-auto">
                {JSON.stringify(error, null, 2)}
              </pre>
            </div>
          )}

          {!session && !error && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-900 font-medium">
                ⚠️ No hay sesión activa. Por favor, inicia sesión primero.
              </p>
            </div>
          )}

          <div className="space-y-4">
            {/* Información crítica */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h2 className="text-lg font-semibold text-blue-900 mb-3">Información Crítica</h2>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="text-gray-900">{debugData.email ?? 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Role:</span>
                  <span className={`font-bold ${debugData.role === 'NO ROLE DETECTED' ? 'text-red-600' : 'text-green-600'}`}>
                    {debugData.role}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Club ID:</span>
                  <span className={`font-bold ${debugData.club_id === 'NO CLUB_ID' ? 'text-red-600' : 'text-green-600'}`}>
                    {debugData.club_id}
                  </span>
                </div>
              </div>
            </div>

            {/* JSON completo */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Datos Completos (JSON)</h2>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto text-xs font-mono border border-gray-700">
                {JSON.stringify(debugData, null, 2)}
              </pre>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              💡 <strong>Tip:</strong> Si ves "NO ROLE DETECTED" o "NO CLUB_ID", verifica que los datos estén correctamente guardados en <code className="bg-gray-100 px-1 rounded">user_metadata</code> en Supabase.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

