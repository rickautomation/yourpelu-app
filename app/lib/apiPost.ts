export async function apiPost<T>(url: string, body: any): Promise<T> {
  console.log("body: ", JSON.stringify(body))
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // 👈 siempre incluimos cookies
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let msg = `Error en la petición POST (HTTP ${res.status})`;
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