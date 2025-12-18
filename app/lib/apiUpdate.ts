export async function apiUpdate<T>(url: string, body: any): Promise<T> {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + url, {
    method: "PUT", // 👈 importante
    headers: {
      "Content-Type": "application/json",
    },
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