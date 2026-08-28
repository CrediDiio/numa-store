export default async function handler(req, res) {
  // Garante que a requisição seja do tipo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Use POST.' });
  }

  const { postalCode } = req.body;

  if (!postalCode) {
    return res.status(400).json({ error: 'CEP de destino não informado.' });
  }

  // Substitua pelo seu token real gerado no painel do Melhor Envio (Sandbox ou Produção)
  const MELHOR_ENVIO_TOKEN = process.env.MELHOR_ENVIO_TOKEN || 'SEU_TOKEN_AQUI';
  
  // CEP de origem da sua loja (ex: CEP do Rio de Janeiro)
  const CEP_ORIGEM = '20000000'; 

  // Dados padrão da Bolsa NUMA para o cálculo de dimensões e peso
  const payload = {
    from: { postal_code: CEP_ORIGEM },
    to: { postal_code: postalCode.replace(/\D/g, '') },
    products: [
      {
        id: 'numa-bag-1',
        width: 20,
        height: 15,
        length: 25,
        weight: 0.600, // 600 gramas
        insurance_value: 150.00,
        quantity: 1
      }
    ]
  };

  try {
    const response = await fetch('https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MELHOR_ENVIO_TOKEN}`,
        'User-Agent': 'Aplicativo contato@numa.com.br' // Exigido pela API do Melhor Envio
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Erro ao calcular frete no Melhor Envio', details: data });
    }

    // Filtra apenas as opções válidas e retorna para o front-end
    const availableOptions = data.filter(item => !item.error);

    return res.status(200).json(availableOptions);
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno ao processar o frete.', details: error.message });
  }
}