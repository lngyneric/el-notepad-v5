// Cloudflare Pages Middleware - inject chat widget into HTML pages
export async function onRequest(context) {
  const { request, next } = context;
  const response = await next();
  
  const contentType = response.headers.get("Content-Type") || "";
  if (!contentType.includes("text/html")) return response;
  
  const html = await response.text();
  
  // Inject chat widget script before closing body tag
  const scriptTag = '<script src="/static/chat-widget.js" defer></script>';
  const modified = html.replace("</body>", scriptTag + "\n</body>");
  
  return new Response(modified, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}
