import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { url } = await request.json();

    if (!url || !url.includes('tiktok.com')) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Please provide a valid TikTok link" 
      }), { status: 400 });
    }

    // Clean the URL first
    let cleanUrl = url.trim();
    if (cleanUrl.includes('vm.tiktok.com')) {
      // For short links, you may need to resolve redirect (advanced)
      cleanUrl = cleanUrl;
    }

    // === OPTION A: Quick & Easy (use a public downloader API) ===
    // Replace with a working one (test first in browser or Postman)
    const apiUrl = `https://api.example.com/tiktok/download?url=${encodeURIComponent(cleanUrl)}`; 
    // Popular ones in 2026: some free tiers of SnapTik-style APIs or RapidAPI TikTok endpoints

    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const data = await response.json();

    return new Response(JSON.stringify({
      success: true,
      videoUrl: data.video?.noWatermark || data.download_url,  // adjust based on the API response
      thumbnail: data.thumbnail,
      title: data.title || "TikTok Video"
    }), { status: 200 });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: "Video not found or TikTok blocked the request. Try again." 
    }), { status: 500 });
  }
};
