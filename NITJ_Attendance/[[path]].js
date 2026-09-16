export async function onRequest(context) {
  const { request, env } = context;

  const url = new URL(request.url);

  const target = new URL(env.LAMBDA_URL);

  target.pathname = url.pathname;
  target.search = url.search;

  const headers = new Headers(request.headers);

  headers.set("x-proxy-secret", env.PROXY_SECRET);
  headers.delete("host");

  const response = await fetch(target.toString(), {
    method: request.method,
    headers,
    body: ["GET", "HEAD"].includes(request.method)
      ? undefined
      : request.body,
    redirect: "manual"
  });

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });
}