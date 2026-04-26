export function getCsrfToken(): string {
  const csrfCookie = document.cookie
    .split("; ")
    .find((cookieValue) => cookieValue.startsWith("trustanchor_csrf="));

  return csrfCookie ? decodeURIComponent(csrfCookie.split("=")[1] ?? "") : "";
}

export function withCsrfHeaders(headers: HeadersInit = {}): HeadersInit {
  return {
    ...headers,
    "x-csrf-token": getCsrfToken()
  };
}
