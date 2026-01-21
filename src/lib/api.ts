const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

if (!API_URL) {
  throw new Error("API_URL environment variable is not defined");
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error ?? `Request failed (${res.status})`);
  }

  return data as T;
}
