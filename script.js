/* ===== Configuración: edita estos valores ===== */
const WHATSAPP = "573000000000";   // número con código de país, sin + ni espacios
const MONEDA = { locale: "es-CO", currency: "COP" };

/* ===== Productos: agrega, quita o cambia juegos aquí ===== */
const PRODUCTOS = [
  { id: 1, titulo: "Aventura del Reino",   plataforma: "Switch",      precio: 249900, color: "#2bb673", fondo: "#0e5b44", banda: "#ff5c5c" },
  { id: 2, titulo: "Kart Rush Deluxe",     plataforma: "Switch",      precio: 229900, color: "#ff5c5c", fondo: "#8f1d3a", banda: "#ff5c5c" },
  { id: 3, titulo: "Ragnar: Fin del Mundo",plataforma: "PlayStation", precio: 259900, color: "#4aa3ff", fondo: "#1b3d8f", banda: "#4aa3ff" },
  { id: 4, titulo: "Arácnido 2",           plataforma: "PlayStation", precio: 239900, color: "#c0392b", fondo: "#4a0f0f", banda: "#4aa3ff" },
  { id: 5, titulo: "Horizonte Racing",     plataforma: "Xbox",        precio: 219900, color: "#f39c12", fondo: "#7a3b00", banda: "#2bb673" },
  { id: 6, titulo: "Halo Eterno",          plataforma: "Xbox",        precio: 199900, color: "#27ae60", fondo: "#0b3d2a", banda: "#2bb673" },
  { id: 7, titulo: "Estrategia Total",     plataforma: "PC",          precio: 179900, color: "#8e44ad", fondo: "#2c1250", banda: "#ffd23f" },
  { id: 8, titulo: "Fútbol Pro 25",        plataforma: "PlayStation", precio: 249900, color: "#16a085", fondo: "#0a3d4a", banda: "#4aa3ff" }
];

/* ===== Utilidades ===== */
const $ = (sel) => document.querySelector(sel);
const dinero = (n) => new Intl.NumberFormat(MONEDA.locale, { style: "currency", currency: MONEDA.currency, maximumFractionDigits: 0 }).format(n);

let carrito = [];
try { carrito = JSON.parse(localStorage.getItem("carrito")) || []; } catch (e) { carrito = []; }
const guardar = () => { try { localStorage.setItem("carrito", JSON.stringify(carrito)); } catch (e) {} };

/* ===== Catálogo ===== */
const grid = $("#grid");

function pintarCatalogo(filtro = "todos") {
  const lista = filtro === "todos" ? PRODUCTOS : PRODUCTOS.filter(p => p.plataforma === filtro);
  grid.innerHTML = lista.map(p => `
    <article class="card">
      <div class="cover" data-platform="${p.plataforma}"
           style="background: linear-gradient(160deg, ${p.color}, ${p.fondo}); --band: ${p.banda};">
        ${p.titulo}
      </div>
      <h3>${p.titulo}</h3>
      <div class="price-row">
        <span class="price">${dinero(p.precio)}</span>
        <button class="add" data-id="${p.id}">Agregar</button>
      </div>
    </article>`).join("");
}

$("#filters").addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
  chip.classList.add("active");
  pintarCatalogo(chip.dataset.filter);
});

grid.addEventListener("click", (e) => {
  const btn = e.target.closest(".add");
  if (!btn) return;
  const prod = PRODUCTOS.find(p => p.id === Number(btn.dataset.id));
  carrito.push(prod.id);
  guardar();
  pintarCarrito();
  avisar(`${prod.titulo} agregado al carrito`);
});

/* ===== Carrito ===== */
const drawer = $("#drawer");
const overlay = $("#overlay");

function pintarCarrito() {
  const lista = $("#cartList");
  if (!carrito.length) {
    lista.innerHTML = `<li class="empty">Tu carrito está vacío. Elige un juego del catálogo.</li>`;
  } else {
    lista.innerHTML = carrito.map((id, i) => {
      const p = PRODUCTOS.find(x => x.id === id);
      return `<li><div>${p.titulo}<small>${p.plataforma} · ${dinero(p.precio)}</small></div>
              <button class="remove" data-index="${i}">Quitar</button></li>`;
    }).join("");
  }
  const total = carrito.reduce((s, id) => s + PRODUCTOS.find(x => x.id === id).precio, 0);
  $("#cartTotal").textContent = dinero(total);
  $("#cartCount").textContent = carrito.length;
}

function abrirCarrito() {
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  overlay.hidden = false;
}
function cerrarCarrito() {
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  overlay.hidden = true;
}

$("#openCart").addEventListener("click", abrirCarrito);
$("#closeCart").addEventListener("click", cerrarCarrito);
overlay.addEventListener("click", cerrarCarrito);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrarCarrito(); });

$("#cartList").addEventListener("click", (e) => {
  const btn = e.target.closest(".remove");
  if (!btn) return;
  carrito.splice(Number(btn.dataset.index), 1);
  guardar();
  pintarCarrito();
});

$("#checkout").addEventListener("click", () => {
  if (!carrito.length) { avisar("Agrega al menos un juego"); return; }
  const lineas = carrito.map(id => {
    const p = PRODUCTOS.find(x => x.id === id);
    return `- ${p.titulo} (${p.plataforma}): ${dinero(p.precio)}`;
  });
  const total = carrito.reduce((s, id) => s + PRODUCTOS.find(x => x.id === id).precio, 0);
  const msg = `Hola, quiero hacer este pedido:\n${lineas.join("\n")}\nTotal: ${dinero(total)}`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
});

/* ===== Aviso ===== */
let timer;
function avisar(texto) {
  const t = $("#toast");
  t.textContent = texto;
  t.classList.add("show");
  clearTimeout(timer);
  timer = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ===== Menú móvil ===== */
const menuBtn = $("#menuBtn");
const nav = $("#nav");
menuBtn.addEventListener("click", () => {
  const abierto = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", abierto);
});
nav.addEventListener("click", (e) => {
  if (e.target.tagName === "A") { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); }
});

/* ===== Inicio ===== */
$("#waLink").href = `https://wa.me/${WHATSAPP}`;
$("#year").textContent = new Date().getFullYear();
pintarCatalogo();
pintarCarrito();
