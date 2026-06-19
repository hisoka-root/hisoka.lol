export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/feed') {
      const upstream = await fetch('https://ilovehisoka.substack.com/feed', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; RSS reader)',
          'Accept': 'application/rss+xml, application/xml, text/xml, */*',
        },
      });

      if (!upstream.ok) {
        return new Response(`upstream error: ${upstream.status}`, { status: 502 });
      }

      return new Response(await upstream.text(), {
        headers: {
          'Content-Type': 'application/rss+xml; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=900, s-maxage=900',
        },
      });
    }

    // everything else → serve static assets
    return env.ASSETS.fetch(request);
  }
}
