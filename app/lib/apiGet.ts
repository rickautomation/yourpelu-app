export async function apiGet<T>(url: string): Promise<T> {
  const isPublic = url.includes("me-fake") || url.includes("login") || url.includes("register");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + url, {
    method: "GET",
    headers,
    credentials: "include",
  });

  if (!res.ok) {
    let msg = `Error en la petición GET (HTTP ${res.status})`;
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