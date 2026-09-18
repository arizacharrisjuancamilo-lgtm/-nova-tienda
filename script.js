const WHATSAPP = "573187501520"; // CAMBIA ESTE NÚMERO por el WhatsApp real de NOVA, con código de país.

const products = [
  {id:1,name:"Oversize Essential 230",category:"Camisetas",supplier:"Aritex",price:59900,badge:"BEST SELLER",dark:true,desc:"Algodón premium, ajuste oversize para todos los días."},
  {id:2,name:"Oversize Qatar 250",category:"Camisetas",supplier:"Aritex",price:69900,badge:"NUEVO",dark:false,desc:"Mayor estructura y acabado premium."},
  {id:3,name:"Oversize Cropped 230",category:"Camisetas",supplier:"Aritex",price:49900,badge:"NUEVO",dark:true,desc:"Corte más corto con estilo urbano."},
  {id:4,name:"Boxy Urban Fit",category:"Camisetas",supplier:"Aritex",price:54900,badge:"BEST SELLER",dark:true,desc:"Calce cuadrado, moderno y fácil de combinar."},
  {id:5,name:"Fresh Basic",category:"Camisetas",supplier:"Aritex",price:39900,badge:"NUEVO",dark:false,desc:"Ligera, fresca y perfecta para el día a día."},
  {id:6,name:"Long Sleeve Essential",category:"Camisetas",supplier:"Aritex",price:49900,badge:"NUEVO",dark:true,desc:"Manga larga para un look urbano."},
  {id:7,name:"Crewneck Nova",category:"Buzos",supplier:"Aritex",price:79900,badge:"BEST SELLER",dark:false,desc:"Suave, cómodo y resistente."},
  {id:8,name:"Hoodie Shadow",category:"Buzos",supplier:"Aritex",price:99900,badge:"NUEVO",dark:true,desc:"Capucha, comodidad y actitud."},
  {id:9,name:"Oversize Premium 290",category:"Camisetas",supplier:"AUREN",price:119900,badge:"NUEVO",dark:false,desc:"Algodón de alta densidad y acabado premium."},
  {id:10,name:"Jean Baggy NOVA",category:"Jeans",supplier:"Andreas Bodega",price:129900,badge:"NUEVO",jean:true,desc:"Corte amplio, moderno y versátil."}
];

let cart = JSON.parse(localStorage.getItem("novaCart") || "[]");
let category = "Todos";

const money = n => new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",maximumFractionDigits:0}).format(n);

function renderProducts(){
  const q = document.querySelector("#search").value.toLowerCase().trim();
  const sort = document.querySelector("#sort").value;
  let list = products.filter(p => category==="Todos" || p.category===category)
                    .filter(p => (p.name+" "+p.category+" "+p.supplier).toLowerCase().includes(q));
  if(sort==="low") list.sort((a,b)=>a.price-b.price);
  if(sort==="high") list.sort((a,b)=>b.price-a.price);
  const grid = document.querySelector("#productGrid");
  document.querySelector("#emptyState").hidden = list.length>0;
  grid.innerHTML = list.map(p => `
    <article class="card">
      <div class="visual ${p.dark?"dark":""} ${p.jean?"jean":""}">
        <span class="badge">${p.badge}</span>
        <div class="garment"><span>${p.jean?"": "NOVA"}</span></div>
      </div>
      <div class="card-body">
        <h3>${p.name}</h3>
        <div class="supplier">${p.supplier}</div>
        <p class="desc">${p.desc}</p>
        <div class="sizes">
          ${(p.jean?["28","30","32","34","36"]:["S","M","L","XL"]).map(s=>`<span class="size">${s}</span>`).join("")}
        </div>
        <div class="price"><div><strong>${money(p.price)}</strong></div></div>
        <button class="buy" onclick="addToCart(${p.id})">💬 Comprar por WhatsApp</button>
      </div>
    </article>
  `).join("");
}

function addToCart(id){
  const p = products.find(x=>x.id===id);
  const found = cart.find(x=>x.id===id);
  if(found) found.qty++;
  else cart.push({id:p.id,qty:1});
  saveCart();
  openCart();
}

function saveCart(){
  localStorage.setItem("novaCart",JSON.stringify(cart));
  renderCart();
}

function renderCart(){
  const items = document.querySelector("#cartItems");
  document.querySelector("#cartCount").textContent = cart.reduce((a,x)=>a+x.qty,0);
  if(!cart.length){
    items.innerHTML = '<p style="color:#777;text-align:center;padding:40px 10px">Tu pedido está vacío.</p>';
    document.querySelector("#cartTotal").textContent=money(0);
    return;
  }
  let total=0;
  items.innerHTML = cart.map(item=>{
    const p=products.find(x=>x.id===item.id);
    total += p.price*item.qty;
    return `<div class="cart-item">
      <div><h4>${p.name}</h4><p>${money(p.price)} · ${p.supplier}</p></div>
      <div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><span>${item.qty}</span><button onclick="changeQty(${p.id},1)">+</button></div>
    </div>`;
  }).join("");
  document.querySelector("#cartTotal").textContent=money(total);
}

function changeQty(id,delta){
  const item=cart.find(x=>x.id===id);
  if(!item)return;
  item.qty+=delta;
  if(item.qty<=0) cart=cart.filter(x=>x.id!==id);
  saveCart();
}

function openCart(){
  document.querySelector("#cartPanel").classList.add("open");
  document.querySelector("#overlay").classList.add("show");
  document.querySelector("#cartPanel").setAttribute("aria-hidden","false");
}
function closeCart(){
  document.querySelector("#cartPanel").classList.remove("open");
  document.querySelector("#overlay").classList.remove("show");
  document.querySelector("#cartPanel").setAttribute("aria-hidden","true");
}

function buyWhatsApp(){
  if(!cart.length){ alert("Agrega al menos una prenda a tu pedido."); return; }
  let total=0;
  const lines=cart.map(item=>{
    const p=products.find(x=>x.id===item.id);
    total += p.price*item.qty;
    return `• ${p.name} x${item.qty} — ${money(p.price*item.qty)}`;
  });
  const msg = `Hola NOVA 👋%0A%0AQuiero hacer este pedido:%0A${encodeURIComponent(lines.join("\n"))}%0A%0ATotal aproximado: ${encodeURIComponent(money(total))}%0A%0A¿Me confirman disponibilidad, tallas y colores?`;
  window.open(`https://wa.me/${WHATSAPP}?text=${msg}`,"_blank");
}

document.querySelectorAll(".filter").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    category=btn.dataset.category;
    renderProducts();
  });
});
document.querySelector("#search").addEventListener("input",renderProducts);
document.querySelector("#sort").addEventListener("change",renderProducts);
document.querySelector("#cartButton").addEventListener("click",openCart);
document.querySelector("#closeCart").addEventListener("click",closeCart);
document.querySelector("#overlay").addEventListener("click",closeCart);
document.querySelector("#clearCart").addEventListener("click",()=>{cart=[];saveCart()});
document.querySelector("#whatsappCheckout").addEventListener("click",buyWhatsApp);

document.querySelector("#contactWhatsapp").href=`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hola NOVA 👋 Quiero información sobre el catálogo.")}`;

renderProducts();
renderCart();
