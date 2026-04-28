export const prerender = false;

export async function GET({ request }) {
  const url = new URL(request.url);
  const videoUrl = url.searchParams.get("url");

  if (!videoUrl) {
    return new Response(JSON.stringify({ error: "No URL provided" }), {
      status: 400,
    });
  }

  const response = await fetch(
    `https://tiktok-video-no-watermark2.p.rapidapi.com/?url=${encodeURIComponent(videoUrl)}`,
    {
      headers: {
        "x-rapidapi-host": "tiktok-video-no-watermark2.p.rapidapi.com",
        "x-rapidapi-key": import.meta.env.RAPIDAPI_KEY,
      },
    }
  );

  const data = await response.json();
  return new Response(JSON.stringify(data), { status: 200 });
}
