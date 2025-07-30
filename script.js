console.log("✅ script.js cargado correctamente");
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
window.onload = async () => {
  generarFormularioVentas();
  await cargarInventario(); // Cargar inventario al inicio
};

// Exponer funciones al global
window.guardarVentas = guardarVentas;
window.cargarInventario = cargarInventario;
window.generarReporte = generarReporte;