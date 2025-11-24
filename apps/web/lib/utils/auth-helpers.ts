import { ROLE_ROUTES, type UserRole } from "@repo/config";

/**
 * Obtiene el rol del usuario actual
 * TODO: Integrar con Supabase Auth en el próximo prompt
 */
export function getUserRole(): UserRole | null {
  // Por ahora, retornamos null. 
  // En el próximo paso se integrará con Supabase Auth
  if (typeof window !== "undefined") {
    const mockRole = localStorage.getItem("mock_user_role") as UserRole;
    return mockRole || null;
  }
  return null;
}

/**
 * Verifica si el usuario tiene un rol específico
 */
export function hasRole(role: UserRole): boolean {
  const userRole = getUserRole();
  return userRole === role;
}

/**
 * Verifica si el usuario tiene alguno de los roles especificados
 */
export function hasAnyRole(roles: UserRole[]): boolean {
  const userRole = getUserRole();
  return userRole ? roles.includes(userRole) : false;
}

/**
 * Obtiene la ruta de redirección según el rol del usuario
 */
export function getRedirectByRole(role: UserRole): string {
  return ROLE_ROUTES[role] || "/";
}

/**
 * Verifica si el usuario está autenticado
 * TODO: Integrar con Supabase Auth
 */
export function isAuthenticated(): boolean {
  if (typeof window !== "undefined") {
    return localStorage.getItem("mock_authenticated") === "true";
  }
  return false;
}




