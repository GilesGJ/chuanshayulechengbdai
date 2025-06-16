 default {
    async fetch(request, env) {
        const url = new URL(request.url);
        
        if (url.pathname === '/api/record' && request.method === 'POST') {
            const data = await request.json();
            const timestamp = new Date().toISOString();
            let records = await env.KV_STORE.get('records', 'json') || [];
            
            records.unshift({ type: data.type, timestamp });
            records = records.slice(0, 100);
            
            await env.KV_STORE.put('records', JSON.stringify(records));
            return new Response(JSON.stringify({ success: true }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        if (url.pathname === '/api/records') {
            const records = await env.KV_STORE.get('records', 'json') || [];
            return new Response(JSON.stringify(records), {
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        return new Response('Not found', { status: 404 });
    }
}
