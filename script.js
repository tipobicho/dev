const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];

// Abrir o modal do carrinho
cartBtn.addEventListener("click", function() {
    updateCartModal();
    cartModal.style.display = "flex";
});

// Fechar modal
cartModal.addEventListener("click", function(event) {
    if (event.target == cartModal) {
        cartModal.style.display = "none";
    }
});
closeModalBtn.addEventListener("click", function() {
    cartModal.style.display = "none";
});

// Adicionar item ao carrinho
menu.addEventListener("click", function(event) {
    let parentButton = event.target.closest(".add-to-cart-btn");

    if (parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));
        addToCart(name, price);
    }
});

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1
        });
    }
    updateCartModal();
}

// Atualizar carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");
        cartItemElement.innerHTML = `
            <div class="flex justify-between">
                <p class="font-bold">${item.name}</p>
                <p>${item.quantity} x Kz ${item.price.toFixed(3)}</p>
            </div>
            <button class="bg-red-500 text-white px-4 py-1 rounded remove-from-cart-btn">Remover</button>
        `;

        cartItemsContainer.appendChild(cartItemElement);

        total += item.price * item.quantity;

        const removeBtn = cartItemElement.querySelector(".remove-from-cart-btn");
        removeBtn.addEventListener("click", function() {
            removeFromCart(item.name);
        });
    });

    cartTotal.innerText = total.toFixed(3);
    cartCounter.innerText = cart.length;
}

// Remover item do carrinho
function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    updateCartModal();
}
//



// Finalizar Pedido
checkoutBtn.addEventListener("click", function() {
    const isOpen = checkRestaurantOpen();
    if (!isOpen) {
        Toastify({
            text: "O Restaurante está fechado",
            duration: 3000,
            close: true,
            gravity: "top", // `top` ou `bottom`
            position: "left", // `left`, `center` ou `right`
            stopOnFocus: true, // Evita fechar o toast ao passar o mouse
            style: { background: "#ef4444" },
        }).showToast();
        return;
    }

    if (cart.length === 0) return;

    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        return;
    }

    // Formata os itens do carrinho em uma mensagem
    const cartItems = cart.map(item => 
        `${item.name} - Quantidade: ${item.quantity} - Preço: Kz ${item.price.toFixed(2)}`
    ).join("\n");

    // Adiciona o endereço de entrega
    const message = encodeURIComponent(
        `*Pedido Dev Burguer*\n\nItens:\n${cartItems}\n\nEndereço de Entrega: ${addressInput.value}`
    );
    
    // Número do WhatsApp da loja
    const phone = "244993769486"; // Inclua o código do país antes do número

    // Abre o WhatsApp em uma nova janela/tab com a mensagem preenchida
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

    // Limpa o carrinho e atualiza o modal após enviar
    cart = [];
    updateCartModal();
});



    


// horário
function checkRestaurantOpen(){
const data = new Date();
const hora = data.getHours();
return hora >= 8 && hora < 22;
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
spanItem.classList.remove("bg-red-500");
spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500")
}