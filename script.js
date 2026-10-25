
"use strict";

/*
 * CONFIGURAÇÃO DA HAMBURGUERIA
 *
 * Troque pelo WhatsApp comercial real.
 * Use código do país + DDD + número, somente números.
 * Exemplo de formato: 5551999999999
 */
const WHATSAPP_NUMBER = "5551999999999";

/*
 * PRODUTOS DE EXEMPLO
 *
 * Substitua nomes, descrições, preços e fotos
 * pelos dados oficiais da Ama Paellas.
 */
const products = [
    {
        id: 1,
        name: "Ama Clássico",
        category: "hamburgueres",
        description: "Pão brioche, hambúrguer artesanal, queijo cheddar e molho especial.",
        price: 29.90,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
        tag: "MAIS PEDIDO"
    },
    {
        id: 2,
        name: "Double Cheese",
        category: "hamburgueres",
        description: "Dois hambúrgueres, queijo derretido e molho da casa.",
        price: 36.90,
        image: "https://images.unsplash.com/photo-1553979459-d2229ba7433a?auto=format&fit=crop&w=800&q=80",
        tag: "DUPLO"
    },
    {
        id: 3,
        name: "Bacon Supreme",
        category: "hamburgueres",
        description: "Hambúrguer artesanal, bacon crocante, cheddar e cebola.",
        price: 34.90,
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
        tag: "ESPECIAL"
    },
    {
        id: 4,
        name: "Burger da Casa",
        category: "hamburgueres",
        description: "Pão macio, carne artesanal, queijo, alface e tomate.",
        price: 27.90,
        image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=800&q=80",
        tag: ""
    },
    {
        id: 5,
        name: "Batata Crocante",
        category: "acompanhamentos",
        description: "Porção de batatas douradas e crocantes.",
        price: 16.90,
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80",
        tag: "ACOMPANHAMENTO"
    },
    {
        id: 6,
        name: "Batata com Cheddar",
        category: "acompanhamentos",
        description: "Batatas crocantes cobertas com cheddar cremoso.",
        price: 22.90,
        image: "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?auto=format&fit=crop&w=800&q=80",
        tag: ""
    },
    {
        id: 7,
        name: "Refrigerante Lata",
        category: "bebidas",
        description: "Refrigerante em lata. Consulte os sabores disponíveis.",
        price: 7.00,
        image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=800&q=80",
        tag: ""
    },
    {
        id: 8,
        name: "Suco Natural",
        category: "bebidas",
        description: "Suco refrescante. Consulte os sabores disponíveis.",
        price: 9.90,
        image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=800&q=80",
        tag: ""
    },
    {
        id: 9,
        name: "Brownie",
        category: "sobremesas",
        description: "Brownie de chocolate para fechar o pedido com chave de ouro.",
        price: 12.90,
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
        tag: "DOCE FINAL"
    }
];

// Estado do cardápio
let selectedCategory = "todos";
let searchTerm = "";
const cart = new Map();

const productGrid = document.getElementById("products-grid");
const emptyMessage = document.getElementById("empty-message");
const searchInput = document.getElementById("search");
const cartCount = document.getElementById("cart-count");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalElement = document.getElementById("cart-total");
const toast = document.getElementById("toast");

function formatPrice(value) {
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// Cria os cartões dos produtos
function renderProducts() {
    const filteredProducts = products.filter(product => {
        const matchesCategory =
            selectedCategory === "todos" ||
            product.category === selectedCategory;

        const searchableText =
            `${product.name} ${product.description}`.toLocaleLowerCase("pt-BR");

        const matchesSearch = searchableText.includes(searchTerm);

        return matchesCategory && matchesSearch;
    });

    productGrid.replaceChildren();

    emptyMessage.hidden = filteredProducts.length !== 0;

    filteredProducts.forEach(product => {
        const card = document.createElement("article");
        card.className = "product-card";

        const imageArea = document.createElement("div");
        imageArea.className = "product-image";

        const img = document.createElement("img");
        img.src = product.image;
        img.alt = product.name;
        img.loading = "lazy";
        img.onerror = () => {
            img.style.display = "none";
        };

        imageArea.appendChild(img);

        if (product.tag) {
            const tag = document.createElement("span");
            tag.className = "product-tag";
            tag.textContent = product.tag;
            imageArea.appendChild(tag);
        }

        const content = document.createElement("div");
        content.className = "product-content";

        const name = document.createElement("h3");
        name.textContent = product.name;

        const description = document.createElement("p");
        description.className = "product-description";
        description.textContent = product.description;

        const bottom = document.createElement("div");
        bottom.className = "product-bottom";

        const price = document.createElement("span");
        price.className = "product-price";
        price.textContent = formatPrice(product.price);

        const addButton = document.createElement("button");
        addButton.className = "add-button";
        addButton.type = "button";
        addButton.textContent = "+ Adicionar";
        addButton.setAttribute(
            "aria-label",
            `Adicionar ${product.name} à sacola`
        );

        addButton.addEventListener("click", () => {
            addToCart(product.id);
        });

        bottom.append(price, addButton);
        content.append(name, description, bottom);
        card.append(imageArea, content);

        productGrid.appendChild(card);
    });
}

// Pesquisa de produtos
searchInput.addEventListener("input", event => {
    searchTerm = event.target.value
        .trim()
        .toLocaleLowerCase("pt-BR");

    renderProducts();
});

// Filtros de categorias
document.querySelectorAll(".category").forEach(button => {
    button.addEventListener("click", () => {
        selectedCategory = button.dataset.category;

        document.querySelectorAll(".category").forEach(categoryButton => {
            const active = categoryButton === button;

            categoryButton.classList.toggle("active", active);
            categoryButton.setAttribute("aria-pressed", String(active));
        });

        renderProducts();
    });

    button.setAttribute(
        "aria-pressed",
        String(button.classList.contains("active"))
    );
});

// Sacola de compras
function addToCart(productId) {
    const currentQuantity = cart.get(productId) || 0;
    cart.set(productId, currentQuantity + 1);

    renderCart();
    showToast("Produto adicionado à sacola!");
}

function changeQuantity(productId, difference) {
    const newQuantity = (cart.get(productId) || 0) + difference;

    if (newQuantity <= 0) {
        cart.delete(productId);
    } else {
        cart.set(productId, newQuantity);
    }

    renderCart();
}

function getCartCount() {
    let count = 0;

    cart.forEach(quantity => {
        count += quantity;
    });

    return count;
}

function getCartTotal() {
    let total = 0;

    cart.forEach((quantity, productId) => {
        const product = products.find(item => item.id === productId);

        if (product) {
            total += product.price * quantity;
        }
    });

    return total;
}

function renderCart() {
    cartCount.textContent = getCartCount();
    cartItemsContainer.replaceChildren();

    if (cart.size === 0) {
        const empty = document.createElement("p");
        empty.className = "product-description";
        empty.textContent = "Sua sacola está vazia. Adicione algo delicioso!";
        cartItemsContainer.appendChild(empty);
    }

    cart.forEach((quantity, productId) => {
        const product = products.find(item => item.id === productId);

        if (!product) return;

        const item = document.createElement("div");
        item.className = "cart-item";

        const info = document.createElement("div");

        const name = document.createElement("h3");
        name.textContent = product.name;

        const price = document.createElement("p");
        price.textContent = formatPrice(product.price * quantity);

        const controls = document.createElement("div");
        controls.className = "quantity-controls";

        const minus = document.createElement("button");
        minus.type = "button";
        minus.textContent = "−";
        minus.setAttribute("aria-label", `Diminuir ${product.name}`);
        minus.addEventListener("click", () => {
            changeQuantity(productId, -1);
        });

        const qty = document.createElement("span");
        qty.textContent = quantity;
        qty.setAttribute("aria-label", "Quantidade");

        const plus = document.createElement("button");
        plus.type = "button";
        plus.textContent = "+";
        plus.setAttribute("aria-label", `Aumentar ${product.name}`);
        plus.addEventListener("click", () => {
            changeQuantity(productId, 1);
        });

        controls.append(minus, qty, plus);
        info.append(name, price, controls);

        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "close-button remove-item";
        remove.textContent = "✕";
        remove.setAttribute("aria-label", `Remover ${product.name}`);
        remove.addEventListener("click", () => {
            cart.delete(productId);
            renderCart();
        });

        item.append(info, remove);
        cartItemsContainer.appendChild(item);
    });

    cartTotalElement.textContent = formatPrice(getCartTotal());
}

// Abrir e fechar sacola
function openCart() {
    cartModal.hidden = false;
    document.body.classList.add("modal-open");
    document.getElementById("close-cart").focus();
}

function closeCart() {
    cartModal.hidden = true;
    document.body.classList.remove("modal-open");
    document.getElementById("open-cart").focus();
}

document.getElementById("open-cart").addEventListener("click", openCart);

document.getElementById("close-cart").addEventListener("click", closeCart);

cartModal.addEventListener("click", event => {
    if (event.target === cartModal) {
        closeCart();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !cartModal.hidden) {
        closeCart();
    }
});

// Notificação
let toastTimeout;

function showToast(message) {
    toast.textContent = message;
    toast.hidden = false;

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {
        toast.hidden = true;
    }, 2200);
}

// Monta o pedido para enviar pelo WhatsApp
function checkoutWhatsApp() {
    if (cart.size === 0) {
        showToast("Adicione pelo menos um produto à sacola.");
        return;
    }

    if (!/^\d{12,13}$/.test(WHATSAPP_NUMBER)) {
        showToast("Configure o número comercial no script.js.");
        return;
    }

    const lines = [
        "Olá, Ama Paellas! Gostaria de fazer um pedido:",
        ""
    ];

    cart.forEach((quantity, productId) => {
        const product = products.find(item => item.id === productId);

        if (product) {
            lines.push(
                `${quantity}x ${product.name} - ${formatPrice(product.price * quantity)}`
            );
        }
    });

    lines.push("");
    lines.push(`Total dos produtos: ${formatPrice(getCartTotal())}`);

    const observation = document
        .getElementById("observation")
        .value.trim();

    if (observation) {
        lines.push("");
        lines.push(`Observações: ${observation}`);
    }

    lines.push("");
    lines.push("Por favor, confirmem a disponibilidade e as opções de entrega ou retirada.");

    const message = encodeURIComponent(lines.join("\n"));

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

    window.open(url, "_blank", "noopener,noreferrer");
}

document.getElementById("checkout").addEventListener(
    "click",
    checkoutWhatsApp
);

document.getElementById("contact-button").addEventListener("click", () => {
    if (cart.size > 0) {
        openCart();
    } else {
        document.getElementById("cardapio").scrollIntoView({
            behavior: "smooth"
        });

        showToast("Escolha seus produtos para começar!");
    }
});

// Ano atualizado automaticamente
document.getElementById("year").textContent =
    new Date().getFullYear();

// Inicialização
renderProducts();
renderCart();
toast.hidden = true;
