console.log("✅ script.js cargado correctamente");

// Productos y precios
const productos = [
  { nombre: "Cóctel de conchas", precio: 3.50 },
  { nombre: "Cóctel de pescado", precio: 3.50 },
  { nombre: "Cóctel de camarón", precio: 3.50 },
  { nombre: "Cóctel mixto", precio: 3.50 },
  { nombre: "Michelada tradicional (nac)", precio: 2.50 },
  { nombre: "Michelada tradicional (ext)", precio: 3.00 },
  { nombre: "Michelada Clamato (nac)", precio: 2.50 },
  { nombre: "Michelada Clamato (ext)", precio: 3.00 },
  { nombre: "Michelada tamarindo (nac)", precio: 2.50 },
  { nombre: "Michelada tamarindo (ext)", precio: 3.00 },
  { nombre: "Michelada soda mineral", precio: 2.00 },
  { nombre: "Cerveza Pilsener", precio: 1.25 },
  { nombre: "Cerveza Golden", precio: 1.25 },
  { nombre: "Cerveza Suprema", precio: 1.25 },
  { nombre: "Cerveza Regia", precio: 1.25 },
  { nombre: "Cerveza Corona", precio: 2.00 },
  { nombre: "Coca Cola", precio: 0.75 },
  { nombre: "Salutaris limón", precio: 0.75 },
  { nombre: "Salutaris toronja", precio: 0.75 },
  { nombre: "Salutaris naranja", precio: 0.75 },
  { nombre: "Salutaris simple", precio: 0.75 },
  { nombre: "Fanta", precio: 0.75 },
  { nombre: "Uva", precio: 0.75 },
  { nombre: "Fresa", precio: 0.75 },
  { nombre: "Fresca", precio: 0.75 },
  { nombre: "Sprite", precio: 0.75 },
  { nombre: "Crema soda", precio: 0.75 }
];

// Inventario local (solo en memoria, no depende de Firebase)
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

// Mostrar inventario en pantalla (sin Firebase)
function mostrarInventario() {
  const contenedor = document.getElementById('inventario-lista');
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
  mostrarInventario();
};

// Hacer funciones accesibles globalmente
window.guardarVentas = guardarVentas;
window.mostrarInventario = mostrarInventario;
window.generarReporte = generarReporte;