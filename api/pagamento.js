const { MercadoPagoConfig, Preference } = require('mercadopago');

export default async function handler(req, res) {
  // Apenas aceita métodos POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // 🔴 SUBSTITUA ABAIXO PELO ACCESS TOKEN QUE VOCÊ COPIOU
  const client = new MercadoPagoConfig({ accessToken: 'APP_USR-2322046720722810-092309-8ea814cb10953ce2fa3dfb9623ef7c11-605521917N' });

  try {
    const { itens, frete } = req.body;

    // Prepara os itens da sacola para o formato do Mercado Pago
    const itemsMercadoPago = itens.map(item => ({
      title: item.title,
      unit_price: Number(item.price),
      quantity: Number(item.quantity),
      currency_id: 'BRL',
    }));

    // Adiciona o frete como um item extra, se não for grátis
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
          // 🔴 SUBSTITUA PELO LINK DO SEU SITE NA VERCEL
          success: 'https://numa-store-gamma.vercel.app/', 
          failure: 'https://numa-store-gamma.vercel.app/',
          pending: 'https://numa-store-gamma.vercel.app/',
        },
        auto_return: 'approved',
      }
    });

    // Devolve o link de pagamento gerado para o cliente
    res.status(200).json({ init_point: response.init_point });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar pagamento' });
  }
}