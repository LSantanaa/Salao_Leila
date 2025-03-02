const BASE_URL = 'http://localhost:8080/api';

export const api = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    });

    const data = await res.json();
    if (res.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.error || "Erro desconhecido" };
    }
  } catch (error) {
    return { success: false, error: "Erro na requisição, verifique a conexão ou o backend" };
  }
};