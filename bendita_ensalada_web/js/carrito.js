let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let total = JSON.parse(localStorage.getItem("total")) || 0;


function agregarAlCarrito(boton) {
  const articulo = boton.closest(".menu_item");
  const nombre = articulo.querySelector(".item_title").textContent;
  const opcion = articulo.querySelector("input[type='radio']:checked");



   // 🚨 Validación tamaño
  if (!opcion) {
mostrarMiniModal("Debes seleccionar el tamaño de la ensalada 🥗");
    return;
  }
  const precio = Number(opcion.value);
  const tamaño = opcion.parentElement.textContent.trim();

  carrito.push({ nombre, precio, tamaño });
  total += precio;

  actualizarMiniCart();
}

function actualizarMiniCart() {
  const miniCart = document.getElementById("miniCart");
  if (!miniCart) return;

  miniCart.style.display = "flex";
  document.getElementById("cartCount").textContent = `${carrito.length} artículos`;
  document.getElementById("cartTotal").textContent = `MX $${total}`;

  // 🔒 Guardar siempre el estado del carrito
  localStorage.setItem("carrito", JSON.stringify(carrito));
  localStorage.setItem("total", JSON.stringify(total));
}
const btnVerPedido = document.getElementById("btnVerPedido");
if (btnVerPedido) {
  btnVerPedido.addEventListener("click", mostrarPedido);
}

//document.getElementById("btnVerPedido").addEventListener("click", mostrarPedido);

function mostrarPedido() {
  const lista = document.getElementById("listaPedido");
  lista.innerHTML = "";

  carrito.forEach((item, index) => {
    const li = document.createElement("li");

    let detalleIngredientes = "";
    if (item.ingredientes) {
      detalleIngredientes = `<br><small>${item.ingredientes.join(", ")}</small>`;
    }

    li.innerHTML = `
      <strong>${item.nombre}</strong> (${item.tamaño}) - MX $${item.precio}
      ${detalleIngredientes}
      <button onclick="eliminarProducto(${index})">❌</button>
    `;
    lista.appendChild(li);
  });

  document.getElementById("pedidoModal").style.display = "flex";
}

function cerrarPedido() {
  document.getElementById("pedidoModal").style.display = "none";
}

function eliminarProducto(index) {
  total -= carrito[index].precio;
  carrito.splice(index, 1);

  actualizarMiniCart();
  mostrarPedido();

  if (carrito.length === 0) {
    document.getElementById("miniCart").style.display = "none";
    cerrarPedido();
  }
}
document.addEventListener("DOMContentLoaded", () => {
  if (carrito.length > 0) {
    const miniCart = document.getElementById("miniCart");
    if (miniCart) {
      miniCart.style.display = "flex";
      document.getElementById("cartCount").textContent = `${carrito.length} artículos`;
      document.getElementById("cartTotal").textContent = `MX $${total}`;
    }
  }
});

function getLimiteIngredientes(articulo) {
  const size = articulo.querySelector("input[type='radio']:checked");

  if (!size) return 0;

  if (size.value == "120") return 4; // Sencillo
  if (size.value == "159") return 5; // Compartir

  return 0;
}

function agregarEnsaladaPersonalizada(boton) {
  const articulo = boton.closest(".custom_salad");
  const nombre = articulo.querySelector(".item_title").textContent;

  const ingredientes = [];
  let seleccionado = false;

  articulo.querySelectorAll(".accordion-content .item").forEach(item => {
    const nombreIng = item.querySelector("span").textContent;
    const qtySpan = item.querySelector(".item_qty");
    const qty = qtySpan ? Number(qtySpan.textContent) : 0;

    if (qty === 1) {
      seleccionado = true;

      let texto = nombreIng;
      const extra = item.querySelector(".extra input[data-extra]");

      if (extra && extra.checked) {
        texto += " (Extra)";
      }

      ingredientes.push(texto);
    }
  });

  // ⛔ obligatorio
  if (!seleccionado) {
    alert("⚠️ Debes seleccionar una opción obligatoria");
    return;
  }

  const opcion = articulo.querySelector("input[type='radio']:checked");
  const precio = Number(opcion.value);
  const tamaño = opcion.parentElement.textContent.trim();

  carrito.push({ nombre, precio, tamaño, ingredientes });
  total += precio;

  actualizarMiniCart();
}



//function agregarEnsaladaPersonalizada(boton) {
  const articulo = boton.closest(".custom_salad");

  const nombre = articulo.querySelector(".item_title").textContent;

const ingredientes = [];

articulo.querySelectorAll(".accordion-content .item").forEach(item => {
  const nombreIng = item.querySelector("span").textContent;
  const qty = parseInt(item.querySelector(".controls span").textContent);

  if (qty > 0) {
    ingredientes.push(`${nombreIng} x${qty}`);
  }
});


  const opcion = articulo.querySelector("input[type='radio']:checked");
  const precio = Number(opcion.value);
  const tamaño = opcion.parentElement.textContent.trim();

  carrito.push({nombre, precio, tamaño,ingredientes });
  total += precio;

  actualizarMiniCart();
//} 

function changeQty(btn, delta) {
  const item = btn.closest(".item");
  const qtySpan = item.querySelector(".item_qty");
  let qty = Number(qtySpan.textContent);

  const accordion = btn.closest(".accordion");
  const max = accordion.dataset.max ? Number(accordion.dataset.max) : null;

  // 🟢 SOLO INGREDIENTES
  if (!max && accordion.classList.contains("ingredientes")) {

  const articulo = btn.closest(".custom_salad")
const limite = getLimiteIngredientes(articulo);
if (!limite) return;


    let total = 0;
accordion
  .querySelectorAll(".item_qty")
  .forEach(span => total += Number(span.textContent));

    if (delta > 0 && total >= limite) {
      mostrarModal(
        limite === 4
          ? "En tamaño Sencillo solo puedes elegir 4 ingredientes."
          : "En tamaño Para compartir solo puedes elegir 5 ingredientes."
      );
      return;
    }
  }

  qty += delta;

  if (qty < 0) qty = 0;

  // 🔒 solo limitar si es proteína
  if (max === 1 && qty > 1) qty = 1;

  qtySpan.textContent = qty;

  // 👉 si NO es proteína, aquí termina
  if (max !== 1) return;

  // ===== LÓGICA EXCLUSIVA PROTEÍNA =====
  const items = accordion.querySelectorAll(".item");

  items.forEach(i => {
    i.classList.remove("bloqueado", "seleccionado");
  });

  if (qty === 1) {
    item.classList.add("seleccionado");

    items.forEach(i => {
      if (i !== item) {
        i.classList.add("bloqueado");
        const span = i.querySelector(".item_qty");
        if (span) span.textContent = "0";
      }
    });
  }
}





//function changeQty(btn, delta) {
 // const qtySpan = btn.parentElement.querySelector(".item_qty");
  //let qty = Number(qtySpan.textContent);
 // qty = Math.max(0, qty + delta);
  //qtySpan.textContent = qty;
//}
function mostrarModal(mensaje) {
  const modal = document.getElementById("modalAviso");
  modal.querySelector("p").textContent = mensaje;
  modal.classList.add("show");
}



function mostrarMiniModal(mensaje) {
  document.getElementById("miniModalText").textContent = mensaje;
  document.getElementById("miniModal").style.display = "flex";
}

function cerrarMiniModal() {
  document.getElementById("miniModal").style.display = "none";
}