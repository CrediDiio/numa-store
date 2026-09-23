const { MercadoPagoConfig, Preference } = require('mercadopago');

module.exports = async (req, res) => {
  // 1. Evita que navegadores bloqueiem a requisição (CORS)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // 🔴 SUBSTITUA PELO SEU ACCESS TOKEN DO MERCADO PAGO AQUI DENTRO DAS ASPAS SIMPLES
  const client = new MercadoPagoConfig({ accessToken: 'APP_USR-2322046720722810-092309-8ea814cb10953ce2fa3dfb9623ef7c11-605521917' });

  try {
    const { itens, frete } = req.body;

    const itemsMercadoPago = itens.map(item => ({
      title: item.title,
      unit_price: Number(item.price),
      quantity: Number(item.quantity),
      currency_id: 'BRL',
    }));

    if (frete > 0) {
      itemsMercadoPago.push({
        title: 'Frete de Entrega',
        unit_price: Number(frete),
        quantity: 1,
        currency_id: 'BRL',
      });
    }

    const preference = new Preference(client);
    const response = await preference.create({
      body: {
        items: itemsMercadoPago,
        back_urls: {
          // 🔴 SUBSTITUA PELA SUA URL DA VERCEL
          success: 'https://numa-store-taupe.vercel.app/', 
          failure: 'https://numa-store-taupe.vercel.app/',
          pending: 'https://numa-store-taupe.vercel.app/',
        },
        auto_return: 'approved',
      }
    });

    res.status(200).json({ init_point: response.init_point });
  } catch (error) {
    // Exibe o erro real no console da Vercel para sabermos exatamente o que falhou
    console.error("Erro do Mercado Pago:", error); 
    res.status(500).json({ error: 'Erro ao gerar pagamento' });
  }
};