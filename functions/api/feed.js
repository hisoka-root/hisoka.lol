// Cloudflare Worker — /api/feed
// Proxies the Substack RSS feed server-side, bypassing CORS and 403s.
//

export async function onRequest() {
  const FEED = 'https://ilovehisoka.substack.com/feed';

  const upstream = await fetch(FEED, {
    headers: {
      // Substack blocks requests without a browser UA
      'User-Agent': 'Mozilla/5.0 (compatible; RSS reader)',
      'Accept':     'application/rss+xml, application/xml, text/xml, */*',
    },
  });

  if (!upstream.ok) {
    return new Response(`upstream error: ${upstream.status}`, { status: 502 });
  }

  const body = await upstream.text();

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type':                'application/rss+xml; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      // cache for 15 minutes on the CDN edge
      'Cache-Control':               'public, max-age=900, s-maxage=900',
    },
  });
}
