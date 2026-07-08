import type { ContactPayload, PortfolioData } from "./types";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export function fetchPortfolio(): Promise<PortfolioData> {
  return request<PortfolioData>("/portfolio");
}

export function submitContact(data: ContactPayload): Promise<{ message: string }> {
  return request<{ message: string }>("/contact", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
