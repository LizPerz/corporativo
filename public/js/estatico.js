(function() {
    console.log('✅ estatico.js cargado');

    let todosLosProductos = [];
    let productosFiltrados = [];
    let paginaActual = 1;
    const itemsPorPagina = 5;
    let permisosActuales = {};

    function init() {
        const tituloModulo = window.moduloEstaticoActivo || 'Módulo Estático';
        const tituloEl = document.getElementById('titulo-dinamico-estatico');
        if (tituloEl) tituloEl.innerText = `${tituloModulo}`;

        permisosActuales = window.obtenerPermisosModulo(tituloModulo);
        
        if (!permisosActuales.bitAgregar) {
            const btn = document.getElementById('btn-agregar-estatico');
            if(btn) btn.style.display = 'none';
        }

        cargarDatos();

        const buscador = document.getElementById('buscador-estatico');
        if (buscador) {
            buscador.addEventListener('input', (e) => filtrarDatos(e.target.value));
        }
    }

    async function cargarDatos() {
        const tbody = document.getElementById('tabla-estatica');
        tbody.innerHTML = `<tr><td colspan="6" class="text-center p-12"><i class="fas fa-circle-notch fa-spin text-4xl text-blue-500"></i></td></tr>`;

        try {
            const token = localStorage.getItem('token_corporativo');
            const response = await fetch(`${BASE_URL}estatico/listar`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();

            if (result.status === 'success') {
                todosLosProductos = result.data;
                productosFiltrados = [...todosLosProductos];
                renderizarTabla();
            }
        } catch (error) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center p-8 text-red-500 font-bold">Error de conexión</td></tr>`;
        }
    }

    function filtrarDatos(termino) {
        termino = termino.toLowerCase().trim();
        if (termino === '') {
            productosFiltrados = [...todosLosProductos];
        } else {
            productosFiltrados = todosLosProductos.filter(p => 
                p.nombre.toLowerCase().includes(termino) || 
                p.categoria.toLowerCase().includes(termino)
            );
        }
        paginaActual = 1; 
        renderizarTabla();
    }

    function renderizarTabla() {
        const tbody = document.getElementById('tabla-estatica');
        const info = document.getElementById('info-resultados');
        tbody.innerHTML = '';

        if (productosFiltrados.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center p-12 text-slate-500 font-bold"><i class="fas fa-search text-4xl mb-3 block text-slate-300"></i>No hay resultados</td></tr>`;
            info.innerText = '0 resultados';
            document.getElementById('paginacion-estatica').innerHTML = '';
            return;
        }

        info.innerText = `Mostrando ${productosFiltrados.length} productos`;

        const indexInicio = (paginaActual - 1) * itemsPorPagina;
        const indexFin = indexInicio + itemsPorPagina;
        const productosPagina = productosFiltrados.slice(indexInicio, indexFin);

        let html = '';
        productosPagina.forEach(prod => {
            const btnEditar = permisosActuales.bitEditar 
                ? `<button onclick="window.editarProductoEstatico(${prod.id})" class="w-9 h-9 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"><i class="fas fa-pen"></i></button>` : '';
            const btnEliminar = permisosActuales.bitEliminar 
                ? `<button onclick="window.confirmarEliminarEstatico(${prod.id}, '${prod.nombre.replace(/'/g, "\\'")}')" class="w-9 h-9 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"><i class="fas fa-trash"></i></button>` : '';

            const acciones = (btnEditar || btnEliminar) ? `<div class="flex justify-center gap-2">${btnEditar}${btnEliminar}</div>` : `<span class="text-xs text-slate-400 font-bold">Bloqueado</span>`;

            const precioF = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(prod.precio);
            const stockBadge = prod.stock > 10 
                ? `<span class="bg-green-100 text-green-700 px-3 py-1 rounded-md text-xs font-extrabold border border-green-200">${prod.stock} u.</span>`
                : `<span class="bg-red-100 text-red-700 px-3 py-1 rounded-md text-xs font-extrabold border border-red-200">${prod.stock} u.</span>`;

            html += `
                <tr class="hover:bg-blue-50/40 transition-colors">
                    <td class="p-5 font-extrabold text-slate-800">${prod.nombre}</td>
                    <td class="p-5 text-slate-500 font-medium text-sm">${prod.categoria}</td>
                    <td class="p-5 font-bold text-slate-700 text-right">${precioF}</td>
                    <td class="p-5 text-center">${stockBadge}</td>
                    <td class="p-5 text-center">${acciones}</td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
        renderizarPaginacion();
    }

    // 🚀 PAGINACIÓN PROFESIONAL << < 1 2 > >>
    function renderizarPaginacion() {
        const totalPaginas = Math.ceil(productosFiltrados.length / itemsPorPagina);
        const nav = document.getElementById('paginacion-estatica');
        let html = '';

        if (totalPaginas <= 1) { nav.innerHTML = ''; return; }

        const baseClass = "w-9 h-9 flex items-center justify-center rounded-lg font-extrabold transition-all text-sm ";
        
        // << Primera y < Anterior
        const disPrev = paginaActual === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-white hover:shadow-sm hover:text-blue-600';
        html += `<button onclick="window.cambiarPagina(1)" class="${baseClass} ${disPrev}" ${paginaActual === 1 ? 'disabled' : ''}><i class="fas fa-angle-double-left"></i></button>`;
        html += `<button onclick="window.cambiarPagina(${paginaActual - 1})" class="${baseClass} ${disPrev}" ${paginaActual === 1 ? 'disabled' : ''}><i class="fas fa-angle-left"></i></button>`;

        // Números
        for (let i = 1; i <= totalPaginas; i++) {
            const activo = i === paginaActual ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-white hover:shadow-sm hover:text-blue-600';
            html += `<button onclick="window.cambiarPagina(${i})" class="${baseClass} ${activo}">${i}</button>`;
        }

        // > Siguiente y >> Última
        const disNext = paginaActual === totalPaginas ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-white hover:shadow-sm hover:text-blue-600';
        html += `<button onclick="window.cambiarPagina(${paginaActual + 1})" class="${baseClass} ${disNext}" ${paginaActual === totalPaginas ? 'disabled' : ''}><i class="fas fa-angle-right"></i></button>`;
        html += `<button onclick="window.cambiarPagina(${totalPaginas})" class="${baseClass} ${disNext}" ${paginaActual === totalPaginas ? 'disabled' : ''}><i class="fas fa-angle-double-right"></i></button>`;

        nav.innerHTML = html;
    }

    window.cambiarPagina = function(nuevaPagina) {
        const totalPaginas = Math.ceil(productosFiltrados.length / itemsPorPagina);
        if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
            paginaActual = nuevaPagina;
            renderizarTabla();
        }
    };

    // --- CRUD Y MODALES ---
    window.abrirFormularioEstatico = function() {
        const template = document.getElementById('form-estatico-template').innerHTML;
        if (window.abrirModal) window.abrirModal('Nuevo Producto', template);
    };

    window.editarProductoEstatico = function(id) {
        const prod = todosLosProductos.find(p => p.id === id);
        if(!prod) return;
        
        const template = document.getElementById('form-estatico-template').innerHTML;
        if (window.abrirModal) window.abrirModal('Editar Producto', template);

        setTimeout(() => {
            document.getElementById('estatico_id').value = prod.id;
            document.getElementById('estatico_nombre').value = prod.nombre;
            document.getElementById('estatico_categoria').value = prod.categoria;
            document.getElementById('estatico_precio').value = prod.precio;
            document.getElementById('estatico_stock').value = prod.stock;
        }, 50);
    };

    window.guardarProductoEstatico = async function(e) {
        e.preventDefault();
        const btn = document.getElementById('btn-guardar-estatico');
        const btnText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> GUARDANDO...';
        btn.disabled = true;
        
        const idProd = document.getElementById('estatico_id').value;
        const nuevoProd = {
            id: idProd ? parseInt(idProd) : null,
            nombre: document.getElementById('estatico_nombre').value,
            categoria: document.getElementById('estatico_categoria').value,
            precio: parseFloat(document.getElementById('estatico_precio').value),
            stock: parseInt(document.getElementById('estatico_stock').value)
        };

        try {
            const token = localStorage.getItem('token_corporativo');
            const response = await fetch(`${BASE_URL}estatico/guardar`, {
                method: idProd ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(nuevoProd)
            });
            const result = await response.json();

            if (result.status === 'success') {
                if(!idProd) {
                    nuevoProd.id = result.nuevo_id;
                    todosLosProductos.unshift(nuevoProd); 
                    mostrarNotificacionToast('¡Producto Agregado!', 'Se guardó correctamente en el inventario.', 'success');
                } else {
                    const index = todosLosProductos.findIndex(p => p.id === nuevoProd.id);
                    todosLosProductos[index] = nuevoProd;
                    mostrarNotificacionToast('¡Producto Actualizado!', 'Los datos se modificaron con éxito.', 'success');
                }
                
                document.getElementById('buscador-estatico').value = '';
                filtrarDatos(''); 
                if (window.cerrarModal) window.cerrarModal();
            }
        } catch (e) {
            mostrarNotificacionToast('Error', 'No se pudo guardar el producto.', 'error');
        } finally {
            btn.innerHTML = btnText;
            btn.disabled = false;
        }
    };

    // MODAL DE CONFIRMACIÓN PARA ELIMINAR (Rojo y Vistoso)
    window.confirmarEliminarEstatico = function(id, nombre) {
        const modalHtml = `
            <div class="text-center p-2">
                <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                    <i class="fas fa-trash-alt text-4xl text-red-500"></i>
                </div>
                <h3 class="text-2xl font-black text-slate-800 mb-2">¿Estás completamente seguro?</h3>
                <p class="text-base text-slate-600 mb-6">Estás a punto de eliminar el producto:<br><span class="font-bold text-red-600 text-lg">"${nombre}"</span></p>
                <div class="flex gap-3 justify-center mt-8">
                    <button onclick="window.cerrarModal()" class="w-full px-6 py-3.5 bg-slate-100 text-slate-700 font-extrabold rounded-xl hover:bg-slate-200 transition-colors">CANCELAR</button>
                    <button onclick="window.eliminarProductoEstatico(${id})" class="w-full px-6 py-3.5 bg-red-500 text-white font-extrabold rounded-xl hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all hover:scale-105">SÍ, ELIMINAR</button>
                </div>
            </div>
        `;
        if (window.abrirModal) window.abrirModal('Confirmar Eliminación', modalHtml);
    };

    window.eliminarProductoEstatico = async function(id) {
        if (window.cerrarModal) window.cerrarModal();
        try {
            const token = localStorage.getItem('token_corporativo');
            const response = await fetch(`${BASE_URL}estatico/eliminar/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();

            if (result.status === 'success') {
                todosLosProductos = todosLosProductos.filter(p => p.id !== id);
                filtrarDatos(document.getElementById('buscador-estatico').value);
                mostrarNotificacionToast('¡Eliminado!', 'El producto fue borrado correctamente.', 'success');
            }
        } catch (e) {
            mostrarNotificacionToast('Error', 'No se pudo eliminar el producto.', 'error');
        }
    };

    // TOAST NOTIFICATION (Pop-up suave y elegante)
    function mostrarNotificacionToast(titulo, mensaje, tipo) {
        const colorClass = tipo === 'success' ? 'from-emerald-500 to-teal-600' : 'from-red-500 to-rose-600';
        const icono = tipo === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-5 right-5 z-[9999] animate-slideInUp';
        toast.innerHTML = `
            <div class="bg-gradient-to-r ${colorClass} text-white rounded-2xl shadow-2xl shadow-black/20 p-4 pr-8 flex items-center gap-4 min-w-[300px]">
                <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-inner">
                    <i class="fas ${icono} text-xl"></i>
                </div>
                <div>
                    <h4 class="font-black text-base leading-tight">${titulo}</h4>
                    <p class="text-sm text-white/90 font-medium">${mensaje}</p>
                </div>
            </div>
        `;
        document.body.appendChild(toast);
        
        // Efecto de entrada y salida
        setTimeout(() => {
            toast.classList.replace('animate-slideInUp', 'animate-fadeOutDown');
            setTimeout(() => toast.remove(), 500);
        }, 3500);
    }

    // CSS para las animaciones del Toast si no existen
    if (!document.getElementById('estatico-animations')) {
        const style = document.createElement('style');
        style.id = 'estatico-animations';
        style.innerHTML = `
            @keyframes slideInUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            @keyframes fadeOutDown { from { transform: translateY(0); opacity: 1; } to { transform: translateY(100%); opacity: 0; } }
            .animate-slideInUp { animation: slideInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            .animate-fadeOutDown { animation: fadeOutDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        `;
        document.head.appendChild(style);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else { init(); }
})();