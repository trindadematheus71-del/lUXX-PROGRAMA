// Cloudflare Pages Function — API de estado do aplicativo.
// Proteja o site/API com Cloudflare Access antes de usar dados reais de clientes.
export async function onRequest(context) {
  const { request, env } = context;
  if (!env.DB) return new Response(JSON.stringify({error:"D1 binding DB não configurado"}), {status:500, headers:{"content-type":"application/json"}});
  if (request.method === "GET") {
    const row = await env.DB.prepare("SELECT payload, updated_at FROM luxx_state WHERE id = ?").bind("main").first();
    return Response.json(row ? {data: JSON.parse(row.payload), updatedAt: row.updated_at} : {data:{products:[],clients:[],sales:[],settings:{}}}, {headers:{"cache-control":"no-store"}});
  }
  if (request.method === "PUT") {
    let body; try { body = await request.json(); } catch { return Response.json({error:"JSON inválido"},{status:400}); }
    if (!body || typeof body !== "object" || !Array.isArray(body.products) || !Array.isArray(body.clients) || !Array.isArray(body.sales)) return Response.json({error:"Formato de dados inválido"},{status:400});
    const payload = JSON.stringify(body);
    await env.DB.prepare("INSERT INTO luxx_state (id,payload,updated_at) VALUES ('main',?,CURRENT_TIMESTAMP) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload, updated_at=CURRENT_TIMESTAMP").bind(payload).run();
    return Response.json({ok:true,updatedAt:new Date().toISOString()});
  }
  return new Response("Method Not Allowed", {status:405, headers:{Allow:"GET, PUT"}});
}
