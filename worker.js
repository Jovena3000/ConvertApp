export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method === 'GET') {
      return new Response('ConvertAPK Proxy Online! Use POST.', {
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    if (request.method === 'POST') {
      try {
        const formData = await request.formData();
        const name = formData.get('name');
        const url = formData.get('url');

        if (!name || !url) {
          return new Response('Faltam name e url', { status: 400 });
        }

        const resposta = await fetch('https://pwa2apk.com/api/generate', {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/vnd.android.package-archive' }
        });

        const apk = await resposta.arrayBuffer();

        return new Response(apk, {
          status: 200,
          headers: {
            'Content-Type': 'application/vnd.android.package-archive',
            'Access-Control-Allow-Origin': '*',
            'Content-Disposition': `attachment; filename="${name.replace(/[^a-z0-9]/gi, '_')}.apk"`
          }
        });
      } catch (erro) {
        return new Response(erro.message, { status: 500 });
      }
    }

    return new Response('Method Not Allowed', { status: 405 });
  }
};
