const BASE_URL = 'https://modelservice.jdcloud.com/anthropic';
const AUTH_TOKEN = 'pk-0f965c3e-2133-4976-9a77-9910de9f20f0';
const MODEL = 'Claude-Sonnet-4.6';

export default {
  async fetch(request) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(request.url);
    if (request.method !== 'POST' || url.pathname !== '/chat') {
      return new Response('Not Found', { status: 404, headers: corsHeaders });
    }

    try {
      const { messages, system } = await request.json();

      const apiRes = await fetch(`${BASE_URL}/v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 2048,
          system,
          messages,
        }),
      });

      const data = await apiRes.json();
      return new Response(JSON.stringify(data), {
        status: apiRes.ok ? 200 : apiRes.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: { message: 'Proxy error: ' + e.message } }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};
