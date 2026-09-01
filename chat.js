// Função serverless. A chave da API fica aqui no servidor, nunca no navegador.
// Configure a variável de ambiente ANTHROPIC_API_KEY no painel da Vercel.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'método não permitido' });
  }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY não configurada' });
  }

  const { system, transcript } = req.body || {};
  if (!system || !transcript) {
    return res.status(400).json({ error: 'faltou system ou transcript' });
  }

  const prompt = system
    + "\n\n--- CONVERSA ---\n" + transcript
    + "\n--- FIM ---\n\nBel mandou as últimas mensagens acima. Responda como os personagens. Só o array JSON.";

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1200,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await r.json();

    if (!r.ok) {
      return res.status(r.status).json({
        error: (data && data.error && data.error.message) || ('erro da API (' + r.status + ')')
      });
    }

    return res.status(200).json({ content: data.content });
  } catch (err) {
    return res.status(500).json({ error: String(err.message || err) });
  }
}
