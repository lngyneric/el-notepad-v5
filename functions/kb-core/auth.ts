// kb-core 鉴权：Bearer token（可选 secret 模式）
// 仅当配置了 token 才强制；未配置则保持开放（向后兼容）

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function isAuthorized(request: Request, token: string | undefined): boolean {
  if (!token) return true;
  const auth = request.headers.get("authorization") ?? "";
  return timingSafeEqual(auth, `Bearer ${token}`);
}
