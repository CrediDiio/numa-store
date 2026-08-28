// Data com os produtos e variações
const productsData = {
  star: {
    id: "star",
    name: "Bolsa STAR ⭐",
    price: 189.90,
    description: "Design autoral feito à mão com detalhe trançado nas alças, correntes metálicas duplas e pingentes astrais exclusivos.",
    variants: [
      { id: "bag1", colorName: "Noir (Preta)", image: "assets/bag1.jpg", hex: "#18181b" },
      { id: "bag2", colorName: "Carmim (Vermelha)", image: "assets/bag2.jpg", hex: "#9f1239" },
      { id: "bag3", colorName: "Terracota", image: "assets/bag3.jpg", hex: "#c2410c" },
      { id: "bag4", colorName: "Esmeralda (Verde)", image: "assets/bag4.jpg", hex: "#047857" }
    ]
  },
  classica: {
    id: "classica",
    name: "Bolsa Clássica",
    price: 159.90,
    description: "Modelo atemporal e elegante feito em fio de malha com estrutura firme e argola lateral exclusiva.",
    variants: [
      { id: "bag8", colorName: "Carmesim (Vermelha)", image: "assets/bag8.jpg", hex: "#9f1239" },
      { id: "bag5", colorName: "Preta", image: "assets/bag5.jpg", hex: "#18181b" }
    ]
  },
  flora: {
    id: "flora",
    name: "Bolsa Flora",
    price: 179.90,
    description: "Design gracioso com aplicações de flores trançadas artesanalmente ao longo da alça e argolas metálicas.",
    variants: [
      { id: "bag6", colorName: "Lavanda e Musgo", image: "assets/bag6.jpg", hex: "#a855f7" },
      { id: "bag7", colorName: "P&B (Preta e Branca)", image: "assets/bag7.jpg", hex: "#000000" },
      { id: "bag10", colorName: "Morango e Rosé", image: "assets/bag10.jpg", hex: "#e11d48" }
    ]
  },
  nuvem: {
    id: "nuvem",
    name: "Bolsa Nuvem",
    price: 149.90,
    description: "Textura felpuda ultra macia em formato único, perfeita para composições autênticas e modernas.",
    variants: [
      { id: "bag9", colorName: "Lilás", image: "assets/bag9.jpg", hex: "#c084fc" }
    ]
  }
};

// Conteúdo para as páginas institucionais
const pageContents = {
  faq: {
    title: "Perguntas Frequentes",
    content: "<p><strong>Como são feitas as bolsas?</strong><br>Todas as peças são confeccionadas artesanalmente à mão com fios de malha selecionados.</p><p><strong>Qual o prazo de produção?</strong><br>O prazo médio de produção e envio é de 3 a 7 dias úteis após a confirmação do pagamento.</p>"
  },
  entrega: {
    title: "Prazo de Entrega",
    content: "<p>Realizamos envios para todo o Brasil via Correios (SEDEX e PAC) e transportadoras parceiras.</p><p>O prazo total é a soma do tempo de produção (3 a 7 dias) + o prazo do frete escolhido no momento do envio.</p>"
  },
  privacidade: {
    title: "Política de Privacidade",
    content: "<p>Garantimos a total segurança dos seus dados pessoais. Informações de contato e pagamento são utilizadas exclusivamente para o processamento e entrega dos seus pedidos.</p>"
  },
  atendimento: {
    title: "Atendimento",
    content: "<p>Estamos à disposição para tirar todas as suas dúvidas!</p><p><strong>WhatsApp:</strong> (21) 99999-9999<br><strong>Horário:</strong> Segunda a Sexta, das 09h às 18h.</p>"
  }
};

let currentSelectedProduct = productsData.star;
let currentSelectedVariantIndex = 0;
let cart = [];

function formatCurrency(amount) {
  return `R$ ${amount.toFixed(2).replace('.', ',')}`;
}

// --- MODAL DE PÁGINAS INSTITUCIONAIS ---
function openPageModal(pageKey) {
  const modal = document.getElementById('info-modal');
  const page = pageContents[pageKey];
  if (!page) return;

  document.getElementById('info-modal-title').innerText = page.title;
  document.getElementById('info-modal-body').innerHTML = page.content;

  modal.classList.remove('opacity-0', 'pointer-events-none');
  document.body.style.overflow = 'hidden';
}

function closePageModal() {
  const modal = document.getElementById('info-modal');
  modal.classList.add('opacity-0', 'pointer-events-none');
  document.body.style.overflow = 'auto';
}

// --- MENU MOBILE ---
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('mobile-menu-overlay');
  const panel = document.getElementById('mobile-menu-panel');
  const isOpen = !panel.classList.contains('-translate-x-full');

  if (isOpen) {
    panel.classList.add('-translate-x-full');
    overlay.classList.add('opacity-0', 'pointer-events-none');
    menu.classList.add('pointer-events-none');
    document.body.style.overflow = 'auto';
  } else {
    menu.classList.remove('pointer-events-none');
    overlay.classList.remove('pointer-events-none', 'opacity-0');
    panel.classList.remove('-translate-x-full');
    document.body.style.overflow = 'hidden';
  }
}

// --- BUSCA ---
function toggleSearch() {
  const searchBar = document.getElementById('search-bar');
  const searchInput = document.getElementById('search-input');
  
  if (searchBar.classList.contains('hidden')) {
    searchBar.classList.remove('hidden');
    searchInput.focus();
  } else {
    searchBar.classList.add('hidden');
    searchInput.value = '';
    filterProducts();
  }
}

function filterProducts() {
  const query = document.getElementById('search-input').value.toLowerCase();
  const productCards = document.querySelectorAll('[data-product-card]');

  productCards.forEach(card => {
    const title = card.querySelector('.product-title')?.innerText.toLowerCase() || '';
    if (title.includes(query)) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

// --- MODAL DE PRODUTO ---
function openProductModal(productId = 'star') {
  const modal = document.getElementById('product-modal');
  currentSelectedProduct = productsData[productId] || productsData.star;
  currentSelectedVariantIndex = 0;

  updateModalUI();

  modal.classList.remove('opacity-0', 'pointer-events-none');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  const modal = document.getElementById('product-modal');
  modal.classList.add('opacity-0', 'pointer-events-none');
  document.body.style.overflow = 'auto';
}

function selectColorVariant(index) {
  currentSelectedVariantIndex = index;
  updateModalUI();
}

function updateModalUI() {
  const variant = currentSelectedProduct.variants[currentSelectedVariantIndex];

  document.getElementById('modal-product-title').innerText = currentSelectedProduct.name;
  document.getElementById('modal-product-price').innerText = formatCurrency(currentSelectedProduct.price);
  document.getElementById('modal-product-desc').innerText = currentSelectedProduct.description;
  document.getElementById('modal-product-img').src = variant.image;
  document.getElementById('selected-color-name').innerText = variant.colorName;

  const colorWrapper = document.getElementById('modal-color-selector-wrapper');
  if (currentSelectedProduct.variants.length <= 1) {
    colorWrapper.style.display = 'none';
  } else {
    colorWrapper.style.display = 'block';
  }

  const container = document.getElementById('color-options-container');
  container.innerHTML = currentSelectedProduct.variants.map((v, i) => {
    const isSelected = i === currentSelectedVariantIndex;
    return `
      <button onclick="selectColorVariant(${i})" 
              title="${v.colorName}"
              class="flex items-center gap-2 px-3 py-2 border rounded-md text-xs font-semibold uppercase tracking-wider transition-all ${
                isSelected 
                  ? 'border-black bg-black text-white shadow-sm' 
                  : 'border-numa-border bg-white text-numa-dark hover:border-black'
              }">
        <span class="w-3.5 h-3.5 rounded-full border border-black/20" style="background-color: ${v.hex};"></span>
        ${v.colorName.split(' ')[0]}
      </button>
    `;
  }).join('');
}

function addSelectedVariantToCart() {
  const variant = currentSelectedProduct.variants[currentSelectedVariantIndex];
  const itemTitle = `${currentSelectedProduct.name} - ${variant.colorName}`;
  
  addToCart(itemTitle, currentSelectedProduct.price, variant.image);
  closeProductModal();
}

// --- CARRINHO ---
function toggleCart() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  const panel = document.getElementById('cart-panel');
  const isOpen = !panel.classList.contains('translate-x-full');

  if (isOpen) {
    panel.classList.add('translate-x-full');
    overlay.classList.add('opacity-0', 'pointer-events-none');
    drawer.classList.add('pointer-events-none');
    document.body.style.overflow = 'auto';
  } else {
    drawer.classList.remove('pointer-events-none');
    overlay.classList.remove('pointer-events-none', 'opacity-0');
    panel.classList.remove('translate-x-full');
    document.body.style.overflow = 'hidden';
  }
}

function addToCart(title, price, image) {
  const existing = cart.find(item => item.title === title);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ title, price, image, quantity: 1 });
  }
  
  updateCartUI();
  toggleCart();
}

function changeQuantity(index, delta) {
  if (cart[index]) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
    updateCartUI();
  }
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function updateCartUI() {
  const cartItemsContainer = document.getElementById('cart-items');
  const cartCount = document.getElementById('cart-count');
  const cartDrawerCount = document.getElementById('cart-drawer-count');
  const cartSubtotal = document.getElementById('cart-subtotal');

  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (cartCount) cartCount.innerText = totalCount;
  if (cartDrawerCount) cartDrawerCount.innerText = totalCount;
  if (cartSubtotal) cartSubtotal.innerText = formatCurrency(totalAmount);

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="text-center py-12 text-numa-subtle uppercase text-xs tracking-wider">
        Sua sacola está vazia no momento.
      </div>
    `;
    return;
  }

  cartItemsContainer.innerHTML = cart.map((item, index) => `
    <div class="flex items-center space-x-4 border-b border-numa-border pb-4">
      <img src="${item.image}" class="w-16 h-20 object-cover bg-numa-bg rounded-sm">
      <div class="flex-1">
        <h4 class="text-xs font-bold uppercase tracking-wider text-numa-dark">${item.title}</h4>
        <p class="text-xs text-numa-subtle mt-1">${formatCurrency(item.price)} cada</p>
        
        <div class="flex items-center space-x-2 mt-2">
          <button onclick="changeQuantity(${index}, -1)" class="w-5 h-5 bg-numa-bg hover:bg-numa-border text-numa-dark text-xs font-bold rounded flex items-center justify-center">-</button>
          <span class="text-xs font-semibold px-1 text-numa-dark">${item.quantity}</span>
          <button onclick="changeQuantity(${index}, 1)" class="w-5 h-5 bg-numa-bg hover:bg-numa-border text-numa-dark text-xs font-bold rounded flex items-center justify-center">+</button>
        </div>
      </div>
      <div class="text-right">
        <p class="text-xs font-bold text-black mb-2">${formatCurrency(item.price * item.quantity)}</p>
        <button onclick="removeFromCart(${index})" class="text-[10px] text-numa-subtle hover:text-red-600 font-bold uppercase tracking-widest transition-colors">
          Remover
        </button>
      </div>
    </div>
  `).join('');
}

function checkoutWhatsApp() {
  if (cart.length === 0) {
    alert('Adicione peças ao carrinho antes de finalizar!');
    return;
  }

  let message = "*Novo Pedido - NUMA*\n\n";
  
  cart.forEach((item) => {
    message += `• *${item.title}* (x${item.quantity}) - ${formatCurrency(item.price * item.quantity)}\n`;
  });
  
  const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  message += `\n*Total:* ${formatCurrency(totalAmount)}`;

  const phone = "5521999999999"; 
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  
  window.open(url, '_blank');
}