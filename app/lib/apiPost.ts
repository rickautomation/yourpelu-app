import axios, { AxiosError } from "axios";

export async function apiPost<T>(url: string, body: any): Promise<T> {
  try {
    const token = localStorage.getItem("auth_token"); // 👈 unificado
    console.log("[apiPost] URL:", process.env.NEXT_PUBLIC_API_URL + url);
    console.log("[apiPost] Body:", body);
    console.log("[apiPost] Token:", token);

    const res = await axios.post<T>(
      process.env.NEXT_PUBLIC_API_URL + url,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        withCredentials: true, // cookies si existen
      }
    );

    console.log("[apiPost] Response status:", res.status);
    console.log("[apiPost] Response data:", res.data);

    return res.data;
  } catch (err) {
    const error = err as AxiosError;
    console.error("[apiPost] Error:", error);

    if (error.response) {
      console.error("[apiPost] Error response data:", error.response.data);
      const msg =
        (error.response.data as any)?.message ||
        `HTTP ${error.response.status}`;
      throw new Error(msg);
    }
    throw new Error("Error en la petición POST PR....");
  }
}