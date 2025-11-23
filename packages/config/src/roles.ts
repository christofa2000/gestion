export type UserRole = "super_admin" | "club_admin" | "professional" | "student";

export const ROLES = {
  SUPER_ADMIN: "super_admin" as const,
  CLUB_ADMIN: "club_admin" as const,
  PROFESSIONAL: "professional" as const,
  STUDENT: "student" as const,
};

export const ROLE_PERMISSIONS = {
  super_admin: ["read", "write", "delete", "manage_users", "manage_clubs", "manage_all"],
  club_admin: ["read", "write", "delete", "manage_users", "manage_club"],
  professional: ["read", "write", "manage_appointments"],
  student: ["read", "book_appointments", "view_payments"],
} as const;

export const ROLE_ROUTES = {
  super_admin: "/admin",
  club_admin: "/admin",
  professional: "/admin",
  student: "/student",
} as const;

