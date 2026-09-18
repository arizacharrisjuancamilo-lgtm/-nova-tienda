let products=[
{id:1,name:"Camiseta Oversize Nova",cat:"Camisetas",price:89900},
{id:2,name:"Buzo Essential Nova",cat:"Buzos",price:129900},
{id:3,name:"Pantalón Cargo Urban",cat:"Pantalones",price:119900},
{id:4,name:"Gorra Nova Classic",cat:"Gorras",price:59900},
{id:5,name:"Tenis Air Style",cat:"Tenis",price:179900},
{id:6,name:"Camiseta Basic Logo",cat:"Camisetas",price:79900},
{id:7,name:"Buzo Heavy Nova",cat:"Buzos",price:149900},
{id:8,name:"Cargo Relax Black",cat:"Pantalones",price:124900}];
let cart=JSON.parse(localStorage.getItem("novaCart")||"[]");
const money=n=>new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",maximumFractionDigits:0}).format(n);
function render(){let q=(search.value||"").toLowerCase(),c=cat.value;let list=products.filter(p=>(c==="Todos"||p.cat===c)&&p.name.toLowerCase().includes(q));grid.innerHTML=list.map(p=>`<article class="card"><div class="pic"><span class="new">NUEVO</span>${p.cat.toUpperCase()} · NOVA</div><div class="info"><h3>${p.name}</h3><div class="price">${money(p.price)}</div></div><div class="card-actions"><button onclick="detail(${p.id})">Ver</button><button class="add" onclick="add(${p.id})">Añadir</button></div></article>`).join("")||"<p>No encontramos productos.</p>"}
function add(id){cart.push(id);save();openCart()}
function remove(i){cart.splice(i,1);save()}
function save(){localStorage.setItem("novaCart",JSON.stringify(cart));renderCart();count.textContent=cart.length}
function renderCart(){if(!cart.length){items.innerHTML="<p>Tu carrito está vacío.</p>";total.textContent=money(0);return}let t=0;items.innerHTML=cart.map((id,i)=>{let p=products.find(x=>x.id===id);t+=p.price;return `<div class="cartrow"><span>${p.name}<br><small>${money(p.price)}</small></span><button onclick="remove(${i})">×</button></div>`}).join("");total.textContent=money(t)}
function openCart(){drawer.classList.add("open");shade.classList.add("open");renderCart()}
function closeCart(){drawer.classList.remove("open");shade.classList.remove("open")}
function setCat(x){cat.value=x;render();document.getElementById("shop").scrollIntoView({behavior:"smooth"})}
function focusSearch(){document.getElementById("search").focus();document.getElementById("shop").scrollIntoView({behavior:"smooth"})}
function detail(id){let p=products.find(x=>x.id===id);modalBody.innerHTML=`<button class="close" onclick="closeModal()">×</button><div class="detail"><div class="pic">${p.cat.toUpperCase()} · NOVA</div><div><span class="eyebrow dark">${p.cat}</span><h2>${p.name}</h2><h3>${money(p.price)}</h3><p>Prenda de demostración. Agrega aquí descripción, materiales, cuidados y medidas reales de tu producto.</p><div class="variants"><b>Talla</b><br><button class="sel">S</button><button>M</button><button>L</button><button>XL</button></div><button class="btn black" onclick="add(${p.id});closeModal()">Añadir al carrito</button></div></div>`;modal.classList.add("show")}
function closeModal(){modal.classList.remove("show")}
function checkout(){if(!cart.length)return alert("Tu carrito está vacío.");let counts={};cart.forEach(id=>counts[id]=(counts[id]||0)+1);let lines=Object.entries(counts).map(([id,n])=>{let p=products.find(x=>x.id==id);return `${n} x ${p.name} — ${money(p.price*n)}`}).join("%0A");let t=cart.reduce((s,id)=>s+products.find(p=>p.id===id).price,0);modalBody.innerHTML=`<button class="close" onclick="closeModal()">×</button><h2>Datos del pedido</h2><p>Completa tus datos y luego te llevaremos a WhatsApp.</p><input id="cust" placeholder="Nombre completo" style="width:100%;padding:13px;margin:6px 0"><input id="phone" placeholder="Teléfono" style="width:100%;padding:13px;margin:6px 0"><input id="addr" placeholder="Dirección de entrega" style="width:100%;padding:13px;margin:6px 0"><select id="pay" style="width:100%;padding:13px;margin:6px 0"><option>Contra entrega</option><option>Transferencia / Nequi</option></select><button class="btn black" onclick="sendOrder(\`${lines}\`,${t})">Enviar pedido por WhatsApp</button>`;modal.classList.add("show")}
function sendOrder(lines,t){let n=document.getElementById("cust").value,a=document.getElementById("phone").value,ad=document.getElementById("addr").value,p=document.getElementById("pay").value;if(!n||!a||!ad)return alert("Completa los datos del pedido.");let msg=`Hola NOVA, quiero hacer un pedido.%0A%0A${lines}%0A%0ATotal: ${money(t)}%0A%0ANombre: ${encodeURIComponent(n)}%0ATeléfono: ${encodeURIComponent(a)}%0ADirección: ${encodeURIComponent(ad)}%0APago: ${encodeURIComponent(p)}`;window.open("https://wa.me/573000000000?text="+msg,"_blank")}
function openAdmin(){modalBody.innerHTML=`<button class="close" onclick="closeModal()">×</button><h2>Panel NOVA</h2><p>Demo local: los cambios quedan guardados en este navegador.</p><div id="adminList"></div><button class="btn black" onclick="addProduct()">+ Añadir producto</button>`;modal.classList.add("show");adminRender()}
function adminRender(){document.getElementById("adminList").innerHTML=products.map((p,i)=>`<div class="admin-row"><input value="${p.name}" onchange="products[${i}].name=this.value;saveProducts()"><input type="number" value="${p.price}" onchange="products[${i}].price=+this.value;saveProducts()"><input value="${p.cat}" onchange="products[${i}].cat=this.value;saveProducts()"><button class="danger" onclick="products.splice(${i},1);saveProducts();adminRender();render()">Eliminar</button></div>`).join("")}
function addProduct(){products.push({id:Date.now(),name:"Nuevo producto",cat:"Camisetas",price:99900});saveProducts();adminRender();render()}
function saveProducts(){localStorage.setItem("novaProducts",JSON.stringify(products))}
const saved=localStorage.getItem("novaProducts");if(saved)products=JSON.parse(saved);
function toggleNav(){document.getElementById("nav").classList.toggle("show")}
render();save();