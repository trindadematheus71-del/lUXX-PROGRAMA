const WORKER_URL =
  "https://luxx-store-dados.luxxstoread.workers.dev/api/data";

export async function onRequest({ request, env }) {
  if (!["GET", "PUT"].includes(request.method)) {
    return new Response("Método não permitido", { status: 405 });
  }

  if (!env.APP_TOKEN) {
    return new Response("Configuração de segurança ausente", {
      status: 500
    });
  }

  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.set("Authorization", `Bearer ${env.APP_TOKEN}`);

  try {
    const response = await fetch(WORKER_URL, {
      method: request.method,
      headers,
      body: request.method === "PUT" ? request.body : undefined
    });

    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") || "application/json"
      }
    });
  } catch {
    return new Response("Erro na comunicação com o banco", {
      status: 502
    });
  }
}
