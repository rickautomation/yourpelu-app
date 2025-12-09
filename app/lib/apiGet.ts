// lib/apiGet.ts
export async function apiGet<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    method: "GET",
    credentials: "include", // 👈 esto manda la cookie
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Error en la petición");
  }

  return res.json() as Promise<T>;
}