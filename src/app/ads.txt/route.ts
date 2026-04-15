import {getAdsTxtContent} from "@/config/site-integrations";

export const dynamic = "force-static";

export function GET() {
  const content = getAdsTxtContent();

  if (!content) {
    return new Response("Not found.", {status: 404});
  }

  return new Response(`${content}\n`, {
    headers: {
      "Cache-Control": "public, max-age=0, must-revalidate",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
