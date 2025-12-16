// lib/apiGet.ts
export async function apiGet<T>(url: string): Promise<T> {
  const token = localStorage.getItem("auth_token");

  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include", // usa cookie si existe
  });

  if (!res.ok) throw new Error("Error en la petición GET");
  return res.json() as Promise<T>;
}