(function() {
    console.log('✅ perfil.js cargado correctamente (Con Paginación y Búsqueda)');
    
    let todosLosPerfiles = [];
    let perfilesFiltrados = [];
    let paginaActual = 1;
    const itemsPorPagina = 5;
    let permisosActuales = {};

    function init() {
        console.log('📡 Inicializando módulo de perfiles');
        
        permisosActuales = window.obtenerPermisosModulo('PERFIL');
        const btnNuevo = document.getElementById('btn-nuevo-perfil');
        if (btnNuevo) {
            btnNuevo.style.display = permisosActuales.bitAgregar ? 'flex' : 'none';
        }

        listarPerfiles();

        const buscador = document.getElementById('buscador-perfil');
        if (buscador) {
            buscador.addEventListener('input', (e) => filtrarDatos(e.target.value));
        }
    }

    async function listarPerfiles() {
        const tbody = document.getElementById('tabla-perfiles');
        if (!tbody) return;
        
        tbody.innerHTML = '<tr><td colspan="3" class="text-center p-12"><div class="flex flex-col items-center"><i class="fas fa-spinner fa-spin text-4xl text-blue-500 mb-3"></i><p class="text-slate-500 text-base">Cargando perfiles...</p></div></td></tr>';

        try {
            const token = localStorage.getItem('token_corporativo');
            if (!token) return;

            const response = await fetch(`${BASE_URL}perfil/listar`, {
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
                todosLosPerfiles = result.data || [];
                perfilesFiltrados = [...todosLosPerfiles];
                renderizarTabla();
            }
        } catch (error) {
            tbody.innerHTML = `<tr><td colspan="3" class="text-center p-12 text-red-500"><i class="fas fa-exclamation-triangle text-3xl mb-3"></i><br>Error al cargar</td></tr>`;
        }
    }

    function filtrarDatos(termino) {
        termino = termino.toLowerCase().trim();
        if (termino === '') {
            perfilesFiltrados = [...todosLosPerfiles];
        } else {
            perfilesFiltrados = todosLosPerfiles.filter(p => 
                p.strNombrePerfil.toLowerCase().includes(termino)
            );
        }
        paginaActual = 1; 
        renderizarTabla();
    }

    function renderizarTabla() {
        const tbody = document.getElementById('tabla-perfiles');
        const info = document.getElementById('info-resultados-perfil');
        tbody.innerHTML = '';

        if (perfilesFiltrados.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" class="text-center p-12 text-slate-500 font-bold"><i class="fas fa-search text-4xl mb-3 block text-slate-300"></i>No hay resultados</td></tr>`;
            info.innerText = '0 resultados';
            document.getElementById('paginacion-perfil').innerHTML = '';
            return;
        }

        info.innerText = `Mostrando ${perfilesFiltrados.length} perfiles`;

        const indexInicio = (paginaActual - 1) * itemsPorPagina;
        const indexFin = indexInicio + itemsPorPagina;
        const perfilesPagina = perfilesFiltrados.slice(indexInicio, indexFin);

        let htmlRows = '';
        perfilesPagina.forEach(perfil => {
            const isAdmin = perfil.bitAdministrador == 1 || perfil.bitAdministrador === true;
            const badgeAdmin = isAdmin 
                ? `<span class="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-extrabold border border-green-200"><i class="fas fa-check-circle mr-1"></i> ADMINISTRADOR</span>`
                : `<span class="bg-slate-100 text-slate-500 px-4 py-2 rounded-full text-sm font-bold border border-slate-200"><i class="fas fa-times-circle mr-1"></i> ESTÁNDAR</span>`;

            const botonesAccion = [];
            if (permisosActuales.bitEditar) {
                botonesAccion.push(`<button onclick="window.editarPerfil(${perfil.id})" class="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><i class="fas fa-pen text-base"></i></button>`);
            }
            if (permisosActuales.bitEliminar) {
                botonesAccion.push(`<button onclick="window.confirmarEliminarPerfil(${perfil.id}, '${perfil.strNombrePerfil.replace(/'/g, "\\'")}')" class="w-11 h-11 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><i class="fas fa-trash text-base"></i></button>`);
            }
            const htmlAcciones = botonesAccion.length > 0 
                ? `<div class="flex items-center justify-center gap-3">${botonesAccion.join('')}</div>`
                : `<span class="text-sm text-slate-400 font-bold flex justify-center">Sin permisos</span>`;

            htmlRows += `
                <tr class="hover:bg-blue-50/50 transition-colors">
                    <td class="p-5 font-extrabold text-slate-800 text-base">${perfil.strNombrePerfil}</td>
                    <td class="p-5 text-center">${badgeAdmin}</td>
                    <td class="p-5 text-center">${htmlAcciones}</td>
                </tr>
            `;
        });
        
        tbody.innerHTML = htmlRows;
        renderizarPaginacion();
    }

    function renderizarPaginacion() {
        const totalPaginas = Math.ceil(perfilesFiltrados.length / itemsPorPagina);
        const nav = document.getElementById('paginacion-perfil');
        let html = '';

        if (totalPaginas <= 1) { nav.innerHTML = ''; return; }

        const baseClass = "w-9 h-9 flex items-center justify-center rounded-lg font-extrabold transition-all text-sm ";
        
        // << y <
        const disPrev = paginaActual === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-white hover:shadow-sm hover:text-blue-600';
        html += `<button onclick="window.cambiarPaginaPerfil(1)" class="${baseClass} ${disPrev}" ${paginaActual === 1 ? 'disabled' : ''}><i class="fas fa-angle-double-left"></i></button>`;
        html += `<button onclick="window.cambiarPaginaPerfil(${paginaActual - 1})" class="${baseClass} ${disPrev}" ${paginaActual === 1 ? 'disabled' : ''}><i class="fas fa-angle-left"></i></button>`;

        // Números
        for (let i = 1; i <= totalPaginas; i++) {
            const activo = i === paginaActual ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-white hover:shadow-sm hover:text-blue-600';
            html += `<button onclick="window.cambiarPaginaPerfil(${i})" class="${baseClass} ${activo}">${i}</button>`;
        }

        // > y >>
        const disNext = paginaActual === totalPaginas ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-white hover:shadow-sm hover:text-blue-600';
        html += `<button onclick="window.cambiarPaginaPerfil(${paginaActual + 1})" class="${baseClass} ${disNext}" ${paginaActual === totalPaginas ? 'disabled' : ''}><i class="fas fa-angle-right"></i></button>`;
        html += `<button onclick="window.cambiarPaginaPerfil(${totalPaginas})" class="${baseClass} ${disNext}" ${paginaActual === totalPaginas ? 'disabled' : ''}><i class="fas fa-angle-double-right"></i></button>`;

        nav.innerHTML = html;
    }

    window.cambiarPaginaPerfil = function(nuevaPagina) {
        const totalPaginas = Math.ceil(perfilesFiltrados.length / itemsPorPagina);
        if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
            paginaActual = nuevaPagina;
            renderizarTabla();
        }
    };

    window.abrirFormularioPerfil = function() {
        const template = document.getElementById('form-perfil-template').innerHTML;
        if (window.abrirModal) window.abrirModal('Crear Nuevo Perfil', template);
    };

    window.editarPerfil = function(id) {
        const perfil = todosLosPerfiles.find(p => p.id == id);
        if (!perfil) return;

        const template = document.getElementById('form-perfil-template').innerHTML;
        if (window.abrirModal) window.abrirModal('Editar Perfil', template);

        setTimeout(() => {
            document.getElementById('perfil_id').value = perfil.id;
            document.getElementById('perfil_nombre').value = perfil.strNombrePerfil;
            document.getElementById('perfil_admin').checked = perfil.bitAdministrador == 1 || perfil.bitAdministrador === true;
        }, 50);
    };

    window.guardarPerfil = async function(e) {
        e.preventDefault();
        const btn = document.getElementById('btn-guardar-perfil');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> GUARDANDO...';
        btn.disabled = true;

        const datos = {
            id: document.getElementById('perfil_id').value,
            strNombrePerfil: document.getElementById('perfil_nombre').value,
            bitAdministrador: document.getElementById('perfil_admin').checked ? 1 : 0
        };

        try {
            const token = localStorage.getItem('token_corporativo');
            const response = await fetch(`${BASE_URL}perfil/guardar`, {
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
                await listarPerfiles();
                mostrarNotificacionToast('¡Éxito!', datos.id ? 'Perfil actualizado' : 'Perfil creado', 'success');
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

    window.confirmarEliminarPerfil = function(id, nombre) {
        const modalHtml = `
            <div class="text-center p-2">
                <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                    <i class="fas fa-trash-alt text-4xl text-red-500"></i>
                </div>
                <h3 class="text-2xl font-black text-slate-800 mb-2">¿Estás seguro?</h3>
                <p class="text-base text-slate-600 mb-6">Estás a punto de eliminar el perfil:<br><span class="font-bold text-red-600 text-lg">"${nombre}"</span></p>
                <div class="flex gap-3 justify-center mt-8">
                    <button onclick="window.cerrarModal()" class="w-full px-6 py-3.5 bg-slate-100 text-slate-700 font-extrabold rounded-xl hover:bg-slate-200 transition-colors">CANCELAR</button>
                    <button onclick="window.eliminarPerfil(${id})" class="w-full px-6 py-3.5 bg-red-500 text-white font-extrabold rounded-xl hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all hover:scale-105">SÍ, ELIMINAR</button>
                </div>
            </div>
        `;
        if (window.abrirModal) window.abrirModal('Confirmar Eliminación', modalHtml);
    };

    window.eliminarPerfil = async function(id) {
        if (window.cerrarModal) window.cerrarModal();

        try {
            const token = localStorage.getItem('token_corporativo');
            const response = await fetch(`${BASE_URL}perfil/eliminar/${id}`, { 
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            const result = await response.json();
            
            if (result.status === 'success') {
                await listarPerfiles();
                mostrarNotificacionToast('¡Eliminado!', 'El perfil fue borrado.', 'success');
            } else {
                mostrarNotificacionToast('Error', result.message, 'error');
            }
        } catch (error) {
            mostrarNotificacionToast('Error', 'Error de conexión', 'error');
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

    if (!document.getElementById('perfil-animations')) {
        const style = document.createElement('style');
        style.id = 'perfil-animations';
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