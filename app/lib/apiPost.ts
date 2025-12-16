// lib/apiPost.ts
import axios, { AxiosError } from "axios";

export async function apiPost<T>(url: string, body: any): Promise<T> {
  try {
    const res = await axios.post<T>(
      process.env.NEXT_PUBLIC_API_URL + url,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`, // 👈 unificado
        },
        withCredentials: true, // cookies si existen
      }
    );
    return res.data;
  } catch (err) {
    const error = err as AxiosError;
    if (error.response) {
      const msg =
        (error.response.data as any)?.message ||
        `HTTP ${error.response.status}`;
      throw new Error(msg);
    }
    throw new Error("Error en la petición POST");
  }
}