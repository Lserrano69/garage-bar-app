console.log("✅ script.js cargado correctamente");

// Productos y precios
const productos = [
  { nombre: "Cóctel de conchas", precio: 3.50 },
  { nombre: "Cóctel de pescado", precio: 3.50 },
  // ... otros productos ...
];

// Inventario local (solo en memoria)
let inventario = {};
productos.forEach(p => {
  inventario[p.nombre] = 50; // Stock inicial
});

// Generar formulario de ventas
function generarFormularioVentas() {
  const contenedor = document.getElementById('ventas-form');
  contenedor.innerHTML = '';
  productos.forEach(p => {
    const div = document.createElement('div');
    div.innerHTML = `
      <label>${p.nombre} ($${p.precio})</label>
      <input type="number" id="venta_${p.nombre}" value="0" min="0" />
    `;
    contenedor.appendChild(div);
  });
}

// Guardar ventas
function guardarVentas() {
  const ventas = {};
  let total = 0;

  productos.forEach(p => {
    const input = document.getElementById(`venta_${p.nombre}`);
    const cantidad = parseInt(input.value) || 0;
    if (cantidad > 0) {
      ventas[p.nombre] = cantidad;
      total += cantidad * p.precio;
      inventario[p.nombre] = (inventario[p.nombre] || 50) - cantidad;
    }
    input.value = 0; // Reiniciar campo
  });

  alert(`Ventas guardadas. Total: $${total.toFixed(2)}`);
  mostrarInventario(); // Actualiza el inventario en pantalla
}

// Mostrar inventario en pantalla
function mostrarInventario() {
  const contenedor = document.getElementById('inventario-lista');
  if (!contenedor) {
    console.error("Contenedor 'inventario-lista' no encontrado");
    return;
  }

  contenedor.innerHTML = '<ul>';
  for (const [nombre, stock] of Object.entries(inventario)) {
    const color = stock < 10 ? 'style="color: red; font-weight: bold;"' : '';
    contenedor.innerHTML += `<li ${color}>${nombre}: ${stock} unidades</li>`;
  }
  contenedor.innerHTML += '</ul>';
}

// Generar reporte
function generarReporte() {
  const fecha = new Date().toLocaleDateString();
  let reporte = `📅 Reporte ${fecha}\n\n`;

  let totalVentas = 0;
  productos.forEach(p => {
    const input = document.getElementById(`venta_${p.nombre}`);
    const cantidad = parseInt(input.value) || 0;
    if (cantidad > 0) {
      const subtotal = cantidad * p.precio;
      totalVentas += subtotal;
      reporte += `${p.nombre}: ${cantidad} x $${p.precio} = $${subtotal}\n`;
    }
  });

  reporte += `\n💰 Total Ventas: $${totalVentas.toFixed(2)}\n`;

  reporte += `\n🛒 Productos bajos:\n`;
  for (const [nombre, stock] of Object.entries(inventario)) {
    if (stock < 10) {
      reporte += `- ${nombre}: ${stock}\n`;
    }
  }

  document.getElementById('reporte').textContent = reporte;
}

// Inicializar al cargar
window.onload = () => {
  generarFormularioVentas();
  mostrarInventario(); // Muestra el inventario al cargar
};

// Hacer funciones accesibles globalmente
window.guardarVentas = guardarVentas;
window.mostrarInventario = mostrarInventario;
window.generarReporte = generarReporte;