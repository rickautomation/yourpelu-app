export async function apiPut<T>(url: string, body: any): Promise<T> {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // 👈 agregado para enviar cookies
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let msg = `Error en la petición PUT (HTTP ${res.status})`;
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