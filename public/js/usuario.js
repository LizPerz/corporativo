(function() {
    console.log('✅ usuario.js cargado correctamente (Con Paginación y Búsqueda)');
    
    let todosLosUsuarios = [];
    let usuariosFiltrados = [];
    let perfilesDisponibles = [];
    
    // Variables de Paginación
    let paginaActual = 1;
    const itemsPorPagina = 5;
    let permisosActuales = {};

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    async function init() {
        console.log('📡 Inicializando módulo de usuarios');
        permisosActuales = window.obtenerPermisosModulo('USUARIO');
        
        const btnNuevo = document.getElementById('btn-nuevo-usuario');
        if (btnNuevo) {
            btnNuevo.style.display = permisosActuales.bitAgregar ? 'flex' : 'none';
        }

        await listarUsuarios();  
        await obtenerPerfiles(); 

        const buscador = document.getElementById('buscador-usuario');
        if (buscador) {
            buscador.addEventListener('input', (e) => filtrarDatos(e.target.value));
        }
    }

    async function obtenerPerfiles() {
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

            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            
            const result = await response.json(); 
            
            if (result.status === 'success') {
                perfilesDisponibles = result.data;
                if(document.getElementById('usuario_perfil')) {
                    llenarSelectPerfiles();
                }
            }
        } catch (error) {
            console.error('❌ Error cargando perfiles:', error);
        }
    }

    function llenarSelectPerfiles(idSeleccionado = '') {
        const select = document.getElementById('usuario_perfil');
        if(!select) return;
        
        if (perfilesDisponibles.length === 0) {
            select.innerHTML = '<option value="">No hay perfiles disponibles</option>';
            return;
        }
        
        select.innerHTML = '<option value="">Selecciona un perfil...</option>';
        perfilesDisponibles.forEach(p => {
            const selected = (p.id == idSeleccionado) ? 'selected' : '';
            select.innerHTML += `<option value="${p.id}" ${selected}>${p.strNombrePerfil}</option>`;
        });
    }

    window.previsualizarFoto = function(input) {
        const preview = document.getElementById('foto-preview');
        const icon = document.getElementById('foto-preview-icon');
        const btnLimpiar = document.getElementById('btn-limpiar-foto');
        
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.src = e.target.result;
                preview.classList.remove('hidden');
                icon.classList.add('hidden');
                btnLimpiar.classList.remove('hidden');
                btnLimpiar.classList.add('flex');
            }
            reader.readAsDataURL(input.files[0]);
        }
    };

    window.limpiarFoto = function() {
        const input = document.getElementById('usuario_foto');
        const preview = document.getElementById('foto-preview');
        const icon = document.getElementById('foto-preview-icon');
        const btnLimpiar = document.getElementById('btn-limpiar-foto');
        
        input.value = '';
        preview.classList.add('hidden');
        icon.classList.remove('hidden');
        btnLimpiar.classList.add('hidden');
        btnLimpiar.classList.remove('flex');
    };

    async function listarUsuarios() {
        const tbody = document.getElementById('tabla-usuarios');
        if (!tbody) return;
        
        tbody.innerHTML = '<tr><td colspan="5" class="text-center p-12"><div class="flex flex-col items-center"><i class="fas fa-circle-notch fa-spin text-4xl text-blue-500 mb-3"></i><p class="text-slate-500">Cargando usuarios...</p></div></td></tr>';

        try {
            const token = localStorage.getItem('token_corporativo');
            if (!token) return;

            const response = await fetch(`${BASE_URL}usuario/listar`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Error al cargar usuarios');
            
            const result = await response.json();

            if (result.status === 'success') {
                todosLosUsuarios = result.data || [];
                usuariosFiltrados = [...todosLosUsuarios];
                renderizarTabla();
            }
        } catch (error) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center p-12 text-red-500 font-bold"><i class="fas fa-exclamation-triangle text-4xl mb-3"></i><br>Error al cargar usuarios</td></tr>';
        }
    }

    function filtrarDatos(termino) {
        termino = termino.toLowerCase().trim();
        if (termino === '') {
            usuariosFiltrados = [...todosLosUsuarios];
        } else {
            usuariosFiltrados = todosLosUsuarios.filter(u => 
                (u.strNombreUsuario && u.strNombreUsuario.toLowerCase().includes(termino)) || 
                (u.strCorreo && u.strCorreo.toLowerCase().includes(termino)) ||
                (u.strNumeroCelular && u.strNumeroCelular.toLowerCase().includes(termino)) ||
                (u.strNombrePerfil && u.strNombrePerfil.toLowerCase().includes(termino))
            );
        }
        paginaActual = 1; 
        renderizarTabla();
    }

    function renderizarTabla() {
        const tbody = document.getElementById('tabla-usuarios');
        const info = document.getElementById('info-resultados-usuario');
        tbody.innerHTML = '';

        if (usuariosFiltrados.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="text-center p-12 text-slate-500 font-bold"><i class="fas fa-search text-4xl mb-3 block text-slate-300"></i>No se encontraron usuarios</td></tr>`;
            info.innerText = '0 resultados';
            document.getElementById('paginacion-usuario').innerHTML = '';
            return;
        }

        info.innerText = `Mostrando ${usuariosFiltrados.length} usuarios`;

        const indexInicio = (paginaActual - 1) * itemsPorPagina;
        const indexFin = indexInicio + itemsPorPagina;
        const usuariosPagina = usuariosFiltrados.slice(indexInicio, indexFin);

        let htmlRows = '';
        usuariosPagina.forEach(user => {
            const isActive = user.idEstadoUsuario == 1 || user.idEstadoUsuario === '1';
            const badgeEstado = isActive 
                ? `<span class="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-extrabold border border-green-200">ACTIVO</span>`
                : `<span class="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-xs font-extrabold border border-red-200">INACTIVO</span>`;

            const fotoHTML = user.strImagenRuta 
                ? `<img src="${BASE_URL}uploads/usuarios/${user.strImagenRuta}" class="w-12 h-12 rounded-xl object-cover border-2 border-blue-200">`
                : `<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 flex items-center justify-center font-black shadow-sm text-lg border-2 border-blue-200">${user.strNombreUsuario ? user.strNombreUsuario.charAt(0).toUpperCase() : '?'}</div>`;

            const botonesAccion = [];
            if (permisosActuales.bitEditar) {
                botonesAccion.push(`<button onclick="window.editarUsuario(${user.id})" class="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center shadow-sm"><i class="fas fa-pen"></i></button>`);
            }
            if (permisosActuales.bitEliminar) {
                botonesAccion.push(`<button onclick="window.confirmarEliminarUsuario(${user.id}, '${user.strNombreUsuario.replace(/'/g, "\\'")}')" class="w-10 h-10 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all flex items-center justify-center shadow-sm"><i class="fas fa-trash"></i></button>`);
            }
            const htmlAcciones = botonesAccion.length > 0 
                ? `<div class="flex items-center justify-center gap-3">${botonesAccion.join('')}</div>`
                : `<span class="text-xs text-slate-400 font-bold flex justify-center">Sin permisos</span>`;

            htmlRows += `
                <tr class="hover:bg-blue-50/40 transition-colors group">
                    <td class="p-6">
                        <div class="flex items-center gap-4">
                            ${fotoHTML}
                            <div>
                                <p class="font-extrabold text-slate-800 tracking-wide text-base">${user.strNombreUsuario || 'Sin nombre'}</p>
                            </div>
                        </div>
                    </td>
                    <td class="p-6">
                        <div class="space-y-1">
                            <p class="text-sm text-slate-600 flex items-center gap-2"><i class="fas fa-envelope text-blue-400 text-xs"></i> ${user.strCorreo || 'Sin correo'}</p>
                            <p class="text-sm text-slate-600 flex items-center gap-2"><i class="fas fa-phone text-blue-400 text-xs"></i> ${user.strNumeroCelular || 'Sin teléfono'}</p>
                        </div>
                    </td>
                    <td class="p-6 font-bold text-slate-600 uppercase text-xs tracking-wider">${user.strNombrePerfil || 'Sin perfil'}</td>
                    <td class="p-6 text-center">${badgeEstado}</td>
                    <td class="p-6">${htmlAcciones}</td>
                </tr>
            `;
        });
        
        tbody.innerHTML = htmlRows;
        renderizarPaginacion();
    }

    function renderizarPaginacion() {
        const totalPaginas = Math.ceil(usuariosFiltrados.length / itemsPorPagina);
        const nav = document.getElementById('paginacion-usuario');
        let html = '';

        if (totalPaginas <= 1) { nav.innerHTML = ''; return; }

        const baseClass = "w-9 h-9 flex items-center justify-center rounded-lg font-extrabold transition-all text-sm ";
        
        // << y <
        const disPrev = paginaActual === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-white hover:shadow-sm hover:text-blue-600';
        html += `<button onclick="window.cambiarPaginaUsuario(1)" class="${baseClass} ${disPrev}" ${paginaActual === 1 ? 'disabled' : ''}><i class="fas fa-angle-double-left"></i></button>`;
        html += `<button onclick="window.cambiarPaginaUsuario(${paginaActual - 1})" class="${baseClass} ${disPrev}" ${paginaActual === 1 ? 'disabled' : ''}><i class="fas fa-angle-left"></i></button>`;

        // Números
        for (let i = 1; i <= totalPaginas; i++) {
            const activo = i === paginaActual ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-white hover:shadow-sm hover:text-blue-600';
            html += `<button onclick="window.cambiarPaginaUsuario(${i})" class="${baseClass} ${activo}">${i}</button>`;
        }

        // > y >>
        const disNext = paginaActual === totalPaginas ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-white hover:shadow-sm hover:text-blue-600';
        html += `<button onclick="window.cambiarPaginaUsuario(${paginaActual + 1})" class="${baseClass} ${disNext}" ${paginaActual === totalPaginas ? 'disabled' : ''}><i class="fas fa-angle-right"></i></button>`;
        html += `<button onclick="window.cambiarPaginaUsuario(${totalPaginas})" class="${baseClass} ${disNext}" ${paginaActual === totalPaginas ? 'disabled' : ''}><i class="fas fa-angle-double-right"></i></button>`;

        nav.innerHTML = html;
    }

    window.cambiarPaginaUsuario = function(nuevaPagina) {
        const totalPaginas = Math.ceil(usuariosFiltrados.length / itemsPorPagina);
        if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
            paginaActual = nuevaPagina;
            renderizarTabla();
        }
    };

    window.abrirFormularioUsuario = function() {
        const template = document.getElementById('form-usuario-template').innerHTML;
        if (window.abrirModal) {
            window.abrirModal('Crear Nuevo Usuario', template);
        }
        
        setTimeout(() => {
            llenarSelectPerfiles();
            document.getElementById('usuario_pwd').required = true;
            document.getElementById('usuario_foto').value = '';
            limpiarFoto();
        }, 50);
    };

    window.editarUsuario = function(id) {
        const user = todosLosUsuarios.find(u => u.id == id);
        if (!user) return;

        const template = document.getElementById('form-usuario-template').innerHTML;
        if (window.abrirModal) {
            window.abrirModal('Editar Usuario', template);
        }

        setTimeout(() => {
            llenarSelectPerfiles(user.idPerfil);
            document.getElementById('usuario_id').value = user.id;
            document.getElementById('usuario_nombre').value = user.strNombreUsuario || '';
            document.getElementById('usuario_correo').value = user.strCorreo || '';
            document.getElementById('usuario_celular').value = user.strNumeroCelular || '';
            document.getElementById('usuario_pwd').required = false;
            document.getElementById('usuario_pwd').value = '';
            document.getElementById('usuario_estado').checked = user.idEstadoUsuario == 1 || user.idEstadoUsuario === '1';
            document.getElementById('usuario_foto').value = '';
            limpiarFoto();
            
            if (user.strImagenRuta) {
                const preview = document.getElementById('foto-preview');
                const icon = document.getElementById('foto-preview-icon');
                const btnLimpiar = document.getElementById('btn-limpiar-foto');
                
                preview.src = `${BASE_URL}uploads/usuarios/${user.strImagenRuta}`;
                preview.classList.remove('hidden');
                icon.classList.add('hidden');
                btnLimpiar.classList.remove('hidden');
                btnLimpiar.classList.add('flex');
            }
        }, 50);
    };

    window.guardarUsuario = async function(e) {
        e.preventDefault();
        
        const btn = document.getElementById('btn-guardar-usuario');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-circle-notch fa-spin mr-2"></i> GUARDANDO...';
        btn.disabled = true;

        const idUsuario = document.getElementById('usuario_id').value;
        const pwd = document.getElementById('usuario_pwd').value;

        if (!idUsuario && !pwd) {
            mostrarNotificacion('⚠️ Validación', 'La contraseña es obligatoria para nuevos usuarios', 'warning');
            btn.innerHTML = originalText;
            btn.disabled = false;
            return;
        }

        const formData = new FormData();
        formData.append('id', idUsuario);
        formData.append('strNombreUsuario', document.getElementById('usuario_nombre').value);
        formData.append('strPwd', pwd);
        formData.append('strCorreo', document.getElementById('usuario_correo').value);
        formData.append('strNumeroCelular', document.getElementById('usuario_celular').value);
        formData.append('idPerfil', document.getElementById('usuario_perfil').value);
        formData.append('idEstadoUsuario', document.getElementById('usuario_estado').checked ? 1 : 0);

        const inputFoto = document.getElementById('usuario_foto');
        if (inputFoto.files.length > 0) {
            formData.append('foto', inputFoto.files[0]);
        }

        try {
            const token = localStorage.getItem('token_corporativo');
            const response = await fetch(`${BASE_URL}usuario/guardar`, {
                method: 'POST', 
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: formData 
            });

            const result = await response.json();

            if (result.status === 'success') {
                if (window.cerrarModal) window.cerrarModal();
                await listarUsuarios();
                mostrarNotificacion('✅ Éxito', result.message, 'success');
            } else {
                mostrarNotificacion('❌ Error', result.message, 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            mostrarNotificacion('❌ Error', 'Error de conexión al guardar', 'error');
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    };

    window.confirmarEliminarUsuario = function(id, nombre) {
        const modalHtml = `
            <div class="text-center">
                <div class="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <i class="fas fa-exclamation-triangle text-4xl text-red-600"></i>
                </div>
                <h3 class="text-2xl font-extrabold text-slate-800 mb-3">¿Eliminar Usuario?</h3>
                <p class="text-base text-slate-600 mb-6">Eliminarás a <span class="font-extrabold text-red-600">${nombre}</span></p>
                <p class="text-sm text-slate-500 mb-8">Esta acción no se puede deshacer</p>
                <div class="flex gap-3 justify-center">
                    <button onclick="window.cerrarModal()" class="px-6 py-3.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200">CANCELAR</button>
                    <button onclick="window.eliminarUsuario(${id})" class="px-6 py-3.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl hover:scale-105">ELIMINAR</button>
                </div>
            </div>
        `;
        if (window.abrirModal) {
            window.abrirModal('Confirmar Eliminación', modalHtml);
        }
    };

    window.eliminarUsuario = async function(id) {
        if (window.cerrarModal) window.cerrarModal();

        try {
            const token = localStorage.getItem('token_corporativo');
            const response = await fetch(`${BASE_URL}usuario/eliminar/${id}`, { 
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            const result = await response.json();
            
            if (result.status === 'success') {
                await listarUsuarios();
                mostrarNotificacion('🗑️ Eliminado', result.message, 'success');
            } else {
                mostrarNotificacion('❌ Error', result.message, 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            mostrarNotificacion('❌ Error', 'Error de conexión', 'error');
        }
    };

    // Mantenemos tu función original de Toasts que ya tenías en usuario.js
    function mostrarNotificacion(titulo, mensaje, tipo) {
        const colores = {
            success: 'from-green-500 to-green-600',
            error: 'from-red-500 to-red-600',
            warning: 'from-yellow-500 to-yellow-600'
        };
        
        const iconos = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle'
        };

        const notificacion = document.createElement('div');
        notificacion.className = 'fixed top-5 right-5 z-50 animate-slideIn';
        notificacion.innerHTML = `
            <div class="bg-gradient-to-r ${colores[tipo]} text-white rounded-2xl shadow-2xl p-5 pr-8 flex items-center gap-4 max-w-md">
                <div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <i class="fas ${iconos[tipo]} text-2xl"></i>
                </div>
                <div>
                    <h4 class="font-extrabold text-lg">${titulo}</h4>
                    <p class="text-sm text-white/90">${mensaje}</p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="absolute top-2 right-2 text-white/60 hover:text-white">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        document.body.appendChild(notificacion);
        setTimeout(() => notificacion.remove(), 4000);
    }

    if (!document.getElementById('usuario-estilos')) {
        const style = document.createElement('style');
        style.id = 'usuario-estilos';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            .animate-slideIn {
                animation: slideIn 0.3s ease-out forwards;
            }
        `;
        document.head.appendChild(style);
    }
})();