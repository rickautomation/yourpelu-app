export async function apiGet<T>(url: string): Promise<T> {
  const token = localStorage.getItem("token");

  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}), // 👈 fallback localStorage
    },
    credentials: "include", // 👈 cookies si están disponibles
  });

  if (!res.ok) throw new Error("Error en la petición GET");
  return res.json() as Promise<T>;
}