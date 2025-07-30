console.log("✅ script.js cargado correctamente");

// Importaciones de Firebase
import { db } from './firebase-config.js';
import { collection, getDocs, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

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

// Inventario
let inventario = {};
productos.forEach(p => {
  inventario[p.nombre] = 50;
});

// ✅ Generar formulario usando data-nombre en lugar de IDs
function generarFormularioVentas() {
  const contenedor = document.getElementById('ventas-form');
  contenedor.innerHTML = '';
  productos.forEach(p => {
    const div = document.createElement('div');
    div.innerHTML = `
      <label>${p.nombre} ($${p.precio})</label>
      <input 
        type="number" 
        class="venta-input" 
        data-nombre="${p.nombre}" 
        value="0" 
        min="0" 
      />
    `;
    contenedor.appendChild(div);
  });
}

// ✅ Guardar ventas y reiniciar campos
async function guardarVentas() {
  const ventas = {};
  let total = 0;

  // Obtener todos los inputs por clase
  const inputs = document.querySelectorAll('.venta-input');
  inputs.forEach(input => {
    const nombre = input.dataset.nombre;
    const cantidad = parseInt(input.value) || 0;
    if (cantidad > 0) {
      ventas[nombre] = cantidad;
      total += cantidad * productos.find(p => p.nombre === nombre).precio;
      inventario[nombre] = (inventario[nombre] || 50) - cantidad;
    }
    // ✅ Reinicio directo
    input.value = 0;
  });

  try {
    await addDoc(collection(db, "ventas"), {
      fecha: new Date().toISOString().split('T')[0],
      ventas,
      total,
      timestamp: serverTimestamp()
    });
    alert(`Ventas guardadas. Total: $${total.toFixed(2)}`);
    cargarInventario();
  } catch (error) {
    console.error("Error al guardar en Firebase:", error);
    alert("Error al guardar. Revisa la consola.");
  }

  // ✅ Reinicio extra por seguridad
  document.querySelectorAll('.venta-input').forEach(input => {
    input.value = 0;
  });
}

// Cargar inventario
async function cargarInventario() {
  try {
    const querySnapshot = await getDocs(collection(db, "inventario"));
    inventario = {}; // Limpiar antes de cargar
    querySnapshot.forEach(doc => {
      inventario[doc.id] = doc.data().stock;
    });
  } catch (error) {
    console.error("Error al cargar inventario:", error);
  }

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
  document.querySelectorAll('.venta-input').forEach(input => {
    const nombre = input.dataset.nombre;
    const cantidad = parseInt(input.value) || 0;
    const producto = productos.find(p => p.nombre === nombre);
    if (cantidad > 0 && producto) {
      const subtotal = cantidad * producto.precio;
      totalVentas += subtotal;
      reporte += `${nombre}: ${cantidad} x $${producto.precio} = $${subtotal}\n`;
    }
  });

  reporte += `\n💰 Total Ventas: $${totalVentas.toFixed(2)}\n`;

  // Productos bajos
  reporte += `\n🛒 Productos bajos:\n`;
  let bajoStock = false;
  for (const [nombre, stock] of Object.entries(inventario)) {
    if (stock < 10) {
      reporte += `- ${nombre}: ${stock}\n`;
      bajoStock = true;
    }
  }
  if (!bajoStock) reporte += `- Ninguno\n`;

  document.getElementById('reporte').textContent = reporte;
}

// Inicializar
window.onload = () => {
  generarFormularioVentas();
  cargarInventario();
};

// ✅ Exponer funciones al global
window.guardarVentas = guardarVentas;
window.cargarInventario = cargarInventario;
window.generarReporte = generarReporte;