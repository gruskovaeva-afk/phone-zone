
const products = [["p1", "Apple", "iPhone 15 128 ГБ", "Телефони", 28999, 4.9, "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=700"], ["p2", "Samsung", "Galaxy S24", "Телефони", 31999, 4.8, "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=700"], ["p3", "Xiaomi", "Redmi Note 13", "Телефони", 8999, 4.6, "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=700"], ["p4", "Sony", "WH-1000XM5", "Навушники", 13999, 4.9, "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=700"], ["p5", "JBL", "Tune 520BT", "Навушники", 1899, 4.5, "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=700"], ["p6", "Logitech", "G Pro X Keyboard", "Клавіатури", 6499, 4.7, "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=700"], ["p7", "Redragon", "Kumara K552", "Клавіатури", 1799, 4.6, "https://images.unsplash.com/photo-1595225476474-87563907a212?w=700"], ["p8", "ASUS", "TUF Gaming A15", "Ноутбуки", 42999, 4.8, "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=700"], ["p9", "Apple", "MacBook Air 13", "Ноутбуки", 51999, 4.9, "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=700"], ["p10", "Samsung", "Galaxy Tab S9 FE", "Планшети", 18999, 4.7, "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=700"], ["p11", "Logitech", "MX Master 3S", "Мишки", 4299, 4.8, "https://images.unsplash.com/photo-1527814050087-3793815479db?w=700"], ["p12", "Razer", "DeathAdder Essential", "Мишки", 1199, 4.6, "https://images.unsplash.com/photo-1615663245857-acda7b9f7d8b?w=700"]];
const categories = ["Телефони","Навушники","Клавіатури","Ноутбуки","Планшети","Мишки"];
const $ = s => document.querySelector(s);
const money = n => new Intl.NumberFormat('uk-UA').format(n) + ' ₴';
let cart = JSON.parse(localStorage.getItem('phonezone_cart') || '[]');
const isCatalog = document.body.dataset.page === 'catalog';
function saveCart(){localStorage.setItem('phonezone_cart',JSON.stringify(cart));updateCartCount();renderCart()}
function updateCartCount(){$('#cartCount').textContent=cart.reduce((s,x)=>s+x.qty,0)}
function addToCart(id){const item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({id,qty:1});saveCart();$('#cartPanel').classList.add('open')}
function changeQty(id,delta){const item=cart.find(x=>x.id===id);if(!item)return;item.qty+=delta;if(item.qty<=0)cart=cart.filter(x=>x.id!==id);saveCart()}
function removeItem(id){cart=cart.filter(x=>x.id!==id);saveCart()}
function renderCart(){
 const el=$('#cartItems');if(!el)return;
 if(!cart.length){el.innerHTML='<p class="notice">Корзина поки порожня.</p>';$('#cartTotal').textContent='Разом: 0 ₴';return}
 el.innerHTML=cart.map(c=>{const p=products.find(x=>x[0]===c.id);return `<div class="cart-item"><img src="${p[6]}" alt=""><div class="cart-item-info"><b>${p[2]}</b><div>${money(p[4])}</div><div class="qty"><button onclick="changeQty('${p[0]}',-1)">−</button>${c.qty}<button onclick="changeQty('${p[0]}',1)">+</button><button class="remove" onclick="removeItem('${p[0]}')">Видалити</button></div></div></div>`}).join('');
 $('#cartTotal').textContent='Разом: '+money(cart.reduce((s,c)=>s+products.find(p=>p[0]===c.id)[4]*c.qty,0));
}
function getFiltered(){
 let list=products.filter(p=>{
  const q=($('#searchInput')?.value||'').toLowerCase();
  const selected=[...document.querySelectorAll('.cat-filter:checked')].map(x=>x.value);
  const brands=[...document.querySelectorAll('.brand-filter:checked')].map(x=>x.value);
  const min=Number($('#minPrice')?.value||0),max=Number($('#maxPrice')?.value||Infinity);
  return (!q||(p[1]+' '+p[2]+' '+p[3]).toLowerCase().includes(q))&&(!selected.length||selected.includes(p[3]))&&(!brands.length||brands.includes(p[1]))&&p[4]>=min&&p[4]<=max;
 });
 const sort=$('#sortSelect')?.value||'popular';
 if(sort==='cheap')list.sort((a,b)=>a[4]-b[4]);if(sort==='expensive')list.sort((a,b)=>b[4]-a[4]);if(sort==='name')list.sort((a,b)=>a[2].localeCompare(b[2],'uk'));
 if(!isCatalog)list=list.slice(0,6);
 return list;
}
function renderProducts(){
 const el=$('#products');if(!el)return;const list=getFiltered();
 el.innerHTML=list.length?list.map(p=>`<article class="card"><div class="product-image"><img src="${p[6]}" alt="${p[2]}" loading="lazy"></div><div class="card-body"><div class="brand">${p[1]} · ${p[3]}</div><h3>${p[2]}</h3><div class="rating">★★★★★ <span style="color:#aaa">${p[5]}</span></div><div class="price">${money(p[4])}</div><div class="card-actions"><button class="add" onclick="addToCart('${p[0]}')">До кошика</button><button class="details" onclick="alert('${p[2]}\\nВиробник: ${p[1]}\\nКатегорія: ${p[3]}\\nЦіна: ${money(p[4])}')">Деталі</button></div></div></article>`).join(''):'<div class="empty">За цими параметрами товарів не знайдено. Спробуй змінити фільтри.</div>';
 const count=$('#resultCount');if(count)count.textContent=`Знайдено товарів: ${list.length}`;
}
function buildFilters(){
 $('#categoryFilters').innerHTML=categories.map(c=>`<label class="filter-option"><input class="cat-filter" type="checkbox" value="${c}">${c}</label>`).join('');
 const brands=[...new Set(products.map(p=>p[1]))];
 $('#brandFilters').innerHTML=brands.map(b=>`<label class="filter-option"><input class="brand-filter" type="checkbox" value="${b}">${b}</label>`).join('');
 document.querySelectorAll('.cat-filter,.brand-filter').forEach(x=>x.addEventListener('change',renderProducts));
}
function resetFilters(){document.querySelectorAll('.cat-filter,.brand-filter').forEach(x=>x.checked=false);$('#minPrice').value='';$('#maxPrice').value='';$('#searchInput').value='';renderProducts()}
function init(){
 buildFilters();renderProducts();updateCartCount();renderCart();
 $('#searchInput').addEventListener('input',renderProducts);
 $('#searchForm').addEventListener('submit',e=>{e.preventDefault();renderProducts()});
 $('#sortSelect').addEventListener('change',renderProducts);
 $('#minPrice').addEventListener('input',renderProducts);$('#maxPrice').addEventListener('input',renderProducts);
 $('#resetFilters').addEventListener('click',resetFilters);
 $('#cartToggle').addEventListener('click',()=>$('#cartPanel').classList.toggle('open'));
 $('#closeCart').addEventListener('click',()=>$('#cartPanel').classList.remove('open'));
}
document.addEventListener('DOMContentLoaded',init);
