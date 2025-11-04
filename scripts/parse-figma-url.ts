export function parseFigmaUrl(url: string): { fileKey: string; nodeId: string } {
  const u = new URL(url);
  const m = u.pathname.match(/\/(design|file)\/([^/]+)/);
  if (!m) throw new Error("Invalid Figma URL: missing /design/ or /file/ segment");
  const fileKey = m[2];
  const node = u.searchParams.get("node-id");
  if (!node) throw new Error("Figma URL missing node-id param");
  // Normalize first hyphen to colon: 1137-26143 -> 1137:26143
  const nodeId = node.replace("-", ":");
  return { fileKey, nodeId };
}
