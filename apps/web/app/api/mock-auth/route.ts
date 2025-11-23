import { NextResponse } from "next/server";

/**
 * API Route para simular autenticación
 * TODO: Reemplazar con Supabase Auth en el próximo step
 */
export async function POST(request: Request) {
  const { email, password, role } = await request.json();

  // Mock de autenticación
  const response = NextResponse.json({
    success: true,
    user: {
      id: "mock-user-id",
      email,
      role: role || "club_admin",
    },
  });

  // Establecer cookies de autenticación
  response.cookies.set("mock_authenticated", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  response.cookies.set("mock_user_role", role || "club_admin", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}

