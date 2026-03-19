(function() {
    console.log('✅ modulo.js cargado correctamente (Con Paginación y Búsqueda)');
    
    let todosLosModulos = [];
    let modulosFiltrados = [];
    let paginaActual = 1;
    const itemsPorPagina = 5;
    let permisosActuales = {};

    function init() {
        console.log('📡 Inicializando módulo de módulos');
        
        permisosActuales = window.obtenerPermisosModulo('MODULO');
        const btnNuevo = document.getElementById('btn-nuevo-modulo');
        if (btnNuevo) {
            btnNuevo.style.display = permisosActuales.bitAgregar ? 'flex' : 'none';
        }

        listarModulos();

        const buscador = document.getElementById('buscador-modulo');
        if (buscador) {
            buscador.addEventListener('input', (e) => filtrarDatos(e.target.value));
        }
    }

    async function listarModulos() {
        const tbody = document.getElementById('tabla-modulos');
        if (!tbody) return;
        
        tbody.innerHTML = '<tr><td colspan="2" class="text-center p-12"><div class="flex flex-col items-center"><i class="fas fa-spinner fa-spin text-4xl text-blue-500 mb-3"></i><p class="text-slate-500">Cargando módulos...</p></div></td></tr>';

        try {
            const token = localStorage.getItem('token_corporativo');
            if (!token) return;

            const response = await fetch(`${BASE_URL}modulo/listar`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            
            const result = await response.json();

            if (result.status === 'success') {
                todosLosModulos = result.data || [];
                modulosFiltrados = [...todosLosModulos];
                renderizarTabla();
            }
        } catch (error) {
            tbody.innerHTML = `<tr><td colspan="2" class="text-center p-12 text-red-500"><i class="fas fa-exclamation-triangle text-3xl mb-3"></i><br>Error al cargar</td></tr>`;
        }
    }

    function filtrarDatos(termino) {
        termino = termino.toLowerCase().trim();
        if (termino === '') {
            modulosFiltrados = [...todosLosModulos];
        } else {
            modulosFiltrados = todosLosModulos.filter(m => 
                m.strNombreModulo.toLowerCase().includes(termino)
            );
        }
        paginaActual = 1; 
        renderizarTabla();
    }

    function renderizarTabla() {
        const tbody = document.getElementById('tabla-modulos');
        const info = document.getElementById('info-resultados-modulo');
        tbody.innerHTML = '';

        if (modulosFiltrados.length === 0) {
            tbody.innerHTML = `<tr><td colspan="2" class="text-center p-12 text-slate-500 font-bold"><i class="fas fa-search text-4xl mb-3 block text-slate-300"></i>No hay resultados</td></tr>`;
            info.innerText = '0 resultados';
            document.getElementById('paginacion-modulo').innerHTML = '';
            return;
        }

        info.innerText = `Mostrando ${modulosFiltrados.length} módulos`;

        const indexInicio = (paginaActual - 1) * itemsPorPagina;
        const indexFin = indexInicio + itemsPorPagina;
        const modulosPagina = modulosFiltrados.slice(indexInicio, indexFin);

        let htmlRows = '';
        modulosPagina.forEach(modulo => {
            const botonesAccion = [];
            if (permisosActuales.bitEditar) {
                botonesAccion.push(`<button onclick="window.editarModulo(${modulo.id})" class="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center shadow-sm"><i class="fas fa-pen"></i></button>`);
            }
            if (permisosActuales.bitEliminar) {
                botonesAccion.push(`<button onclick="window.confirmarEliminarModulo(${modulo.id}, '${modulo.strNombreModulo.replace(/'/g, "\\'")}')" class="w-10 h-10 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all flex items-center justify-center shadow-sm"><i class="fas fa-trash"></i></button>`);
            }
            const htmlAcciones = botonesAccion.length > 0 
                ? `<div class="flex items-center justify-center gap-3">${botonesAccion.join('')}</div>`
                : `<span class="text-xs text-slate-400 font-bold flex justify-center">Sin permisos</span>`;

            htmlRows += `
                <tr class="hover:bg-blue-50/40 transition-colors group">
                    <td class="p-6 font-extrabold text-slate-800 tracking-wide">${modulo.strNombreModulo}</td>
                    <td class="p-6">${htmlAcciones}</td>
                </tr>
            `;
        });
        
        tbody.innerHTML = htmlRows;
        renderizarPaginacion();
    }

    function renderizarPaginacion() {
        const totalPaginas = Math.ceil(modulosFiltrados.length / itemsPorPagina);
        const nav = document.getElementById('paginacion-modulo');
        let html = '';

        if (totalPaginas <= 1) { nav.innerHTML = ''; return; }

        const baseClass = "w-9 h-9 flex items-center justify-center rounded-lg font-extrabold transition-all text-sm ";
        
        // << y <
        const disPrev = paginaActual === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-white hover:shadow-sm hover:text-blue-600';
        html += `<button onclick="window.cambiarPaginaModulo(1)" class="${baseClass} ${disPrev}" ${paginaActual === 1 ? 'disabled' : ''}><i class="fas fa-angle-double-left"></i></button>`;
        html += `<button onclick="window.cambiarPaginaModulo(${paginaActual - 1})" class="${baseClass} ${disPrev}" ${paginaActual === 1 ? 'disabled' : ''}><i class="fas fa-angle-left"></i></button>`;

        // Números
        for (let i = 1; i <= totalPaginas; i++) {
            const activo = i === paginaActual ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-white hover:shadow-sm hover:text-blue-600';
            html += `<button onclick="window.cambiarPaginaModulo(${i})" class="${baseClass} ${activo}">${i}</button>`;
        }

        // > y >>
        const disNext = paginaActual === totalPaginas ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-white hover:shadow-sm hover:text-blue-600';
        html += `<button onclick="window.cambiarPaginaModulo(${paginaActual + 1})" class="${baseClass} ${disNext}" ${paginaActual === totalPaginas ? 'disabled' : ''}><i class="fas fa-angle-right"></i></button>`;
        html += `<button onclick="window.cambiarPaginaModulo(${totalPaginas})" class="${baseClass} ${disNext}" ${paginaActual === totalPaginas ? 'disabled' : ''}><i class="fas fa-angle-double-right"></i></button>`;

        nav.innerHTML = html;
    }

    window.cambiarPaginaModulo = function(nuevaPagina) {
        const totalPaginas = Math.ceil(modulosFiltrados.length / itemsPorPagina);
        if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
            paginaActual = nuevaPagina;
            renderizarTabla();
        }
    };

    window.abrirFormularioModulo = function() {
        const template = document.getElementById('form-modulo-template').innerHTML;
        if (window.abrirModal) window.abrirModal('Crear Nuevo Módulo', template);
    };

    window.editarModulo = function(id) {
        const modulo = todosLosModulos.find(m => m.id == id);
        if (!modulo) return;

        const template = document.getElementById('form-modulo-template').innerHTML;
        if (window.abrirModal) window.abrirModal('Editar Módulo', template);

        setTimeout(() => {
            document.getElementById('modulo_id').value = modulo.id;
            document.getElementById('modulo_nombre').value = modulo.strNombreModulo;
        }, 50);
    };

    window.guardarModulo = async function(e) {
        e.preventDefault();
        
        const btn = document.getElementById('btn-guardar-modulo');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> GUARDANDO...';
        btn.disabled = true;

        const datos = {
            id: document.getElementById('modulo_id').value,
            strNombreModulo: document.getElementById('modulo_nombre').value
        };

        try {
            const token = localStorage.getItem('token_corporativo');
            const response = await fetch(`${BASE_URL}modulo/guardar`, {
                method: datos.id ? 'PUT' : 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(datos)
            });

            const result = await response.json();

            if (result.status === 'success') {
                if (window.cerrarModal) window.cerrarModal();
                await listarModulos();
                mostrarNotificacionToast('¡Éxito!', datos.id ? 'Módulo actualizado' : 'Módulo creado', 'success');
            } else {
                mostrarNotificacionToast('Error', result.message, 'error');
            }
        } catch (error) {
            mostrarNotificacionToast('Error', 'Error de conexión', 'error');
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    };

    window.confirmarEliminarModulo = function(id, nombre) {
        const modalHtml = `
            <div class="text-center p-2">
                <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                    <i class="fas fa-trash-alt text-4xl text-red-500"></i>
                </div>
                <h3 class="text-2xl font-black text-slate-800 mb-2">¿Estás seguro?</h3>
                <p class="text-base text-slate-600 mb-6">Estás a punto de eliminar el módulo:<br><span class="font-bold text-red-600 text-lg">"${nombre}"</span></p>
                <div class="flex gap-3 justify-center mt-8">
                    <button onclick="window.cerrarModal()" class="w-full px-6 py-3.5 bg-slate-100 text-slate-700 font-extrabold rounded-xl hover:bg-slate-200 transition-colors">CANCELAR</button>
                    <button onclick="window.eliminarModulo(${id})" class="w-full px-6 py-3.5 bg-red-500 text-white font-extrabold rounded-xl hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all hover:scale-105">SÍ, ELIMINAR</button>
                </div>
            </div>
        `;
        if (window.abrirModal) window.abrirModal('Confirmar Eliminación', modalHtml);
    };

    window.eliminarModulo = async function(id) {
        if (window.cerrarModal) window.cerrarModal();

        try {
            const token = localStorage.getItem('token_corporativo');
            const response = await fetch(`${BASE_URL}modulo/eliminar/${id}`, { 
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            const result = await response.json();
            
            if (result.status === 'success') {
                await listarModulos();
                mostrarNotificacionToast('¡Eliminado!', 'El módulo fue borrado correctamente', 'success');
            } else {
                mostrarNotificacionToast('Error', result.message, 'error');
            }
        } catch (error) {
            mostrarNotificacionToast('Error', 'No se pudo eliminar', 'error');
        }
    };

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
        
        setTimeout(() => {
            toast.classList.replace('animate-slideInUp', 'animate-fadeOutDown');
            setTimeout(() => toast.remove(), 500);
        }, 3500);
    }

    if (!document.getElementById('modulo-animations')) {
        const style = document.createElement('style');
        style.id = 'modulo-animations';
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
    } else {
        init();
    }
})();