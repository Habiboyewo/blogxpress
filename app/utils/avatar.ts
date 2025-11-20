
export function getAuthorAvatar(url?: string | null) {
  if (url && url.startsWith("http")) return url;
  return "/userAvatar.jpg";
}
