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
          Authorization: `Bearer ${localStorage.getItem("token")}`, // 👈 importante si usás JWT
        },
        withCredentials: true, // equivalente a credentials: "include"
      }
    );
    return res.data;
  } catch (err) {
    const error = err as AxiosError;
    // Lanzamos un error con más contexto
    if (error.response) {
      throw new Error(`HTTP ${error.response.status}`);
    }
    throw new Error("Error en la petición POST");
  }
}