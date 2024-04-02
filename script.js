const menu = document.getElementById("menu")
const cartbtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn =document.getElementById("address-warn")


let cart = [];


// Abrir o modal do carrinho
cartbtn.addEventListener("click", function(){
    updateCartModal()
    cartModal.style.display = "flex"
   
})

// Fecha o modal quando clicar fora
cartModal.addEventListener("click", function(event){
   if(event.target === cartModal){
    cartModal.style.display = "none"
   } 
})

// Fecha o modal quando clicar no fechar
closeModalBtn.addEventListener("click",function(){
    cartModal.style.display = "none"
})


// pegando o item do menu
menu.addEventListener("click",function(event){
   // console.log(event.target)
   let parentButton = event.target.closest(".add-to-cart-btn")

   if(parentButton){
    const name = parentButton.getAttribute("data-name")
    const price = parseFloat(parentButton.getAttribute("data-price"))
    // Adicionar no carrinho
    addCart(name, price )
   
   }
   
})

// função para adicionar no carrinho

function addCart(name, price ){
const existingItem = cart.find(item => item.name === name)

 if(existingItem){
    // se o item ja existe, aumenta apenas a quantidade + 1
    existingItem.quantity += 1;
    
 }else{
    cart.push({
        name,
        price,
        quantity: 1,
    })
 }
   updateCartModal()
  

}

// Atualizando carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElemnent = document.createElement("div");
        cartItemElemnent.classList.add("flex", "justify-between", "mb-4", "flex-col")
        
        cartItemElemnent.innerHTML = `
         <div class="flex items-center justify-between">
         <div>
          <p class="font-bold">${item.name}</p>
          <p>Qtd: ${item.quantity}</p>
          <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
         </div>

         <div>
         <button class= " bg-red-600 px-4 py-1 rounded-lg mt-4 text-lg text-white  remove-from-cart-btn " data-name="${item.name}">
          Remover
         </button>
         </div>
         
         </div>
        
        `
        total += item.price * item.quantity;


        cartItemsContainer.appendChild(cartItemElemnent)
    })
    
    cartTotal.textContent = total.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"   
    });
    cartCounter.innerHTML = cart.length;

}

// função remover item do carrinho
cartItemsContainer.addEventListener("click", function(event){
  if(event.target.classList.contains("remove-from-cart-btn")){
    const name = event.target.getAttribute("data-name")

    removerItemsCart(name)
  }
})

function  removerItemsCart(name){
 const index = cart.findIndex(item => item.name === name);
 
 if(index !== -1){
    const item = cart[index];
    
    if(item.quantity > 1){
       item.quantity -= 1;
       updateCartModal();
       return; 
    }
    cart.splice(index, 1);
    updateCartModal();
 }
}

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})
// Finalizar pedido
checkoutBtn.addEventListener("click", function(){

    const isOpen = checkRestaurantOpen();
    if(!isOpen){

        Toastify({
            text: "Ops o restaurante está fechado",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
        }).showToast();  

    }

    if(cart.length === 0)return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;  
    }
   
    // Enviar o pedido para API do whats

   const cartItems = cart.map((item) => {
     return(
        `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price.toFixed(2)} | `
     )
   }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "32991121261"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")
    cart = [];
    updateCartModal();

})
// Verificar a hora e manipular o card horario
function checkRestaurantOpen(){
 const data = new Date();
 const hora = data.getHours();
 return hora >= 18 && hora < 22; //trua aberto
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}