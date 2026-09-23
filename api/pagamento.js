const { MercadoPagoConfig, Preference } = require('mercadopago');

module.exports = async (req, res) => {
  // Cabeçalhos de segurança para a Vercel
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const client = new MercadoPagoConfig({ 
      accessToken: 'APP_USR-2322046720722810-092309-8ea814cb10953ce2fa3dfb9623ef7c11-605521917' 
    });

    const { itens, frete } = req.body;

    if (!itens || !Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({ error: 'Sacola vazia' });
    }

    const itemsMercadoPago = itens.map(item => ({
      title: item.title,
      unit_price: Number(item.price),
      quantity: Number(item.quantity),
      currency_id: 'BRL'
    }));

    if (frete && Number(frete) > 0) {
      itemsMercadoPago.push({
        title: 'Frete de Entrega',
        unit_price: Number(frete),
        quantity: 1,
        currency_id: 'BRL'
      });
    }

    const preference = new Preference(client);
    const response = await preference.create({
      body: {
        items: itemsMercadoPago,
        back_urls: {
          success: 'https://numa-store-taupe.vercel.app/',
          failure: 'https://numa-store-taupe.vercel.app/',
          pending: 'https://numa-store-taupe.vercel.app/'
        },
        auto_return: 'approved'
      }
    });

    return res.status(200).json({ init_point: response.init_point });
  } catch (error) {
    return res.status(500).json({ error: 'Erro no servidor do Mercado Pago', details: error.message });
  }
};