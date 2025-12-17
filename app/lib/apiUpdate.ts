export async function apiUpdate<T>(url: string, body: any): Promise<T> {
  const token = localStorage.getItem("auth_token");

  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}), // 👈 fallback localStorage
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("Error en la petición PUT");
  }

  return res.json() as Promise<T>;
}