export async function apiDelete<T>(url: string): Promise<T> {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // 👈 siempre incluimos cookies
  });

  if (!res.ok) {
    let msg = `Error en la petición DELETE (HTTP ${res.status})`;
    try {
      const errorData = await res.json();
      msg = errorData.message || msg;
    } catch {
      const text = await res.text();
      if (text) msg = text;
    }
    throw new Error(msg);
  }

  return res.json() as Promise<T>;
}