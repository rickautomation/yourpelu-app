// lib/apiPost.ts
export async function apiPost<T>(
  endpoint: string,
  body: Record<string, any>
): Promise<T> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include", // 👈 importante para que se guarde la cookie auth_token
  });

  if (!res.ok) {
    // Podés lanzar un error con el mensaje del backend
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Error en la petición");
  }

  return res.json() as Promise<T>;
}