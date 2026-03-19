(function() {
    console.log('✅ permisos-perfil.js cargado (Borrador, Paginación y Guardado en Lote)');
    
    let perfilesData = [];
    let matrizOriginal = []; 
    let matrizBorrador = []; 
    let matrizFiltrada = [];
    let hayCambiosPendientes = false;

    // Variables de Paginación
    let paginaActual = 1;
    const itemsPorPagina = 8;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        console.log('📡 Inicializando matriz de seguridad');
        llenarSelectorPerfiles();

        const buscador = document.getElementById('buscador-permisos');
        if(buscador) {
            buscador.addEventListener('input', (e) => filtrarMatriz(e.target.value));
        }
    }

    async function llenarSelectorPerfiles() {
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
            
            if (!response.ok) throw new Error('Error al cargar perfiles');
            
            const result = await response.json();

            if (result.status === 'success') {
                perfilesData = result.data || [];
                const select = document.getElementById('selector-perfil');
                
                if (!select) return;
                
                select.innerHTML = '<option value="">Selecciona un perfil...</option>';
                
                if (perfilesData.length === 0) {
                    select.innerHTML += '<option value="" disabled>No hay perfiles registrados</option>';
                    return;
                }

                perfilesData.forEach(perfil => {
                    const option = document.createElement('option');
                    option.value = perfil.id;
                    option.textContent = perfil.strNombrePerfil;
                    select.appendChild(option);
                });
            }
        } catch (error) {
            console.error("❌ Error cargando perfiles:", error);
        }
    }

    window.cargarMatriz = async function() {
        const select = document.getElementById('selector-perfil');
        const idPerfil = select?.value;
        const tbody = document.getElementById('tabla-permisos');
        const loader = document.getElementById('loader-matriz');
        const panelBuscador = document.getElementById('panel-buscador');
        const navPaginacion = document.getElementById('paginacion-matriz');

        ocultarPanelGuardado();
        document.getElementById('buscador-permisos').value = '';
        paginaActual = 1;

        if (!idPerfil) {
            panelBuscador.classList.add('hidden');
            navPaginacion.innerHTML = '';
            if (tbody) {
                tbody.innerHTML = `<tr><td colspan="6" class="text-center p-12 text-slate-400 font-bold text-base"><i class="fas fa-arrow-up text-3xl text-blue-300 block mb-3"></i>Selecciona un perfil arriba</td></tr>`;
            }
            return;
        }

        panelBuscador.classList.remove('hidden');
        if (loader) {
            loader.classList.remove('hidden');
            loader.classList.add('flex');
        }

        try {
            const token = localStorage.getItem('token_corporativo');
            if (!token) return;

            const response = await fetch(`${BASE_URL}permisos-perfil/cargarData/${idPerfil}`, {
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
                matrizOriginal = JSON.parse(JSON.stringify(result.data));
                matrizBorrador = JSON.parse(JSON.stringify(result.data));
                matrizFiltrada = [...matrizBorrador];
                renderizarMatriz();
            }
        } catch (error) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center p-12 text-red-500 font-bold"><i class="fas fa-exclamation-triangle text-3xl mb-3 block"></i>Error de conexión</td></tr>`;
        } finally {
            if (loader) {
                loader.classList.add('hidden');
                loader.classList.remove('flex');
            }
        }
    };

    function filtrarMatriz(termino) {
        termino = termino.toLowerCase().trim();
        if (termino === '') {
            matrizFiltrada = [...matrizBorrador];
        } else {
            matrizFiltrada = matrizBorrador.filter(f => 
                f.nombreModulo.toLowerCase().includes(termino)
            );
        }
        paginaActual = 1; 
        renderizarMatriz();
    }

    function renderizarMatriz() {
        const tbody = document.getElementById('tabla-permisos');
        const info = document.getElementById('info-resultados-matriz');
        tbody.innerHTML = '';
        
        if (matrizFiltrada.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center p-12 text-slate-400 font-bold"><i class="fas fa-search text-3xl mb-3 block"></i>No se encontraron módulos</td></tr>`;
            info.innerText = '0 resultados';
            document.getElementById('paginacion-matriz').innerHTML = '';
            return;
        }

        info.innerText = `Mostrando ${matrizFiltrada.length} módulos`;

        const indexInicio = (paginaActual - 1) * itemsPorPagina;
        const indexFin = indexInicio + itemsPorPagina;
        const matrizPagina = matrizFiltrada.slice(indexInicio, indexFin);

        let htmlRows = '';
        matrizPagina.forEach(fila => {
            htmlRows += `
                <tr class="hover:bg-blue-50/40 transition-colors group">
                    <td class="p-6 font-extrabold text-slate-800 tracking-wide text-base sticky left-0 bg-white group-hover:bg-slate-50/50 shadow-[1px_0_0_0_#f1f5f9] z-10">${fila.nombreModulo}</td>
                    <td class="p-6 text-center">${crearToggle(fila.idModulo, 'bitConsulta', fila.bitConsulta)}</td>
                    <td class="p-6 text-center">${crearToggle(fila.idModulo, 'bitAgregar', fila.bitAgregar)}</td>
                    <td class="p-6 text-center">${crearToggle(fila.idModulo, 'bitEditar', fila.bitEditar)}</td>
                    <td class="p-6 text-center">${crearToggle(fila.idModulo, 'bitEliminar', fila.bitEliminar)}</td>
                    <td class="p-6 text-center">${crearToggle(fila.idModulo, 'bitDetalle', fila.bitDetalle)}</td>
                </tr>
            `;
        });
        
        tbody.innerHTML = htmlRows;
        renderizarPaginacion();
    }

    function crearToggle(idModulo, campo, estado) {
        const checked = estado ? 'checked' : '';
        return `
            <label class="switch">
                <input type="checkbox" 
                    data-modulo="${idModulo}"
                    data-campo="${campo}"
                    onclick="window.registrarCambioLocal(this)" 
                    ${checked}>
                <span class="slider"></span>
            </label>
        `;
    }

    function renderizarPaginacion() {
        const totalPaginas = Math.ceil(matrizFiltrada.length / itemsPorPagina);
        const nav = document.getElementById('paginacion-matriz');
        let html = '';

        if (totalPaginas <= 1) { nav.innerHTML = ''; return; }

        const baseClass = "w-9 h-9 flex items-center justify-center rounded-lg font-extrabold transition-all text-sm ";
        
        const disPrev = paginaActual === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-white hover:shadow-sm hover:text-blue-600';
        html += `<button onclick="window.cambiarPaginaMatriz(1)" class="${baseClass} ${disPrev}" ${paginaActual === 1 ? 'disabled' : ''}><i class="fas fa-angle-double-left"></i></button>`;
        html += `<button onclick="window.cambiarPaginaMatriz(${paginaActual - 1})" class="${baseClass} ${disPrev}" ${paginaActual === 1 ? 'disabled' : ''}><i class="fas fa-angle-left"></i></button>`;

        for (let i = 1; i <= totalPaginas; i++) {
            const activo = i === paginaActual ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-white hover:shadow-sm hover:text-blue-600';
            html += `<button onclick="window.cambiarPaginaMatriz(${i})" class="${baseClass} ${activo}">${i}</button>`;
        }

        const disNext = paginaActual === totalPaginas ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-white hover:shadow-sm hover:text-blue-600';
        html += `<button onclick="window.cambiarPaginaMatriz(${paginaActual + 1})" class="${baseClass} ${disNext}" ${paginaActual === totalPaginas ? 'disabled' : ''}><i class="fas fa-angle-right"></i></button>`;
        html += `<button onclick="window.cambiarPaginaMatriz(${totalPaginas})" class="${baseClass} ${disNext}" ${paginaActual === totalPaginas ? 'disabled' : ''}><i class="fas fa-angle-double-right"></i></button>`;

        nav.innerHTML = html;
    }

    window.cambiarPaginaMatriz = function(nuevaPagina) {
        const totalPaginas = Math.ceil(matrizFiltrada.length / itemsPorPagina);
        if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
            paginaActual = nuevaPagina;
            renderizarMatriz();
        }
    };

    // 🚀 LÓGICA DEL BORRADOR
    window.registrarCambioLocal = function(inputElement) {
        const idModulo = parseInt(inputElement.dataset.modulo);
        const campo = inputElement.dataset.campo;
        const valorNuevo = inputElement.checked;

        const filaBorrador = matrizBorrador.find(f => f.idModulo === idModulo);
        if (filaBorrador) filaBorrador[campo] = valorNuevo;

        const filaFiltrada = matrizFiltrada.find(f => f.idModulo === idModulo);
        if (filaFiltrada) filaFiltrada[campo] = valorNuevo;

        mostrarPanelGuardado();
    };

    function mostrarPanelGuardado() {
        hayCambiosPendientes = true;
        const panel = document.getElementById('panel-guardado');
        panel.classList.remove('translate-y-full');
        panel.classList.add('translate-y-0');
    }

    function ocultarPanelGuardado() {
        hayCambiosPendientes = false;
        const panel = document.getElementById('panel-guardado');
        panel.classList.remove('translate-y-0');
        panel.classList.add('translate-y-full');
    }

    // 🔴 BOTÓN DESCARTAR
    window.descartarCambios = function() {
        matrizBorrador = JSON.parse(JSON.stringify(matrizOriginal));
        matrizFiltrada = [...matrizBorrador];
        
        document.getElementById('buscador-permisos').value = '';
        paginaActual = 1;
        renderizarMatriz();
        
        ocultarPanelGuardado();
        mostrarNotificacionToast('Restaurado', 'Se descartaron los cambios.', 'warning');
    };

    // 🟢 BOTÓN GUARDAR EN LOTE
    window.guardarMatrizEnLote = async function() {
        const idPerfil = document.getElementById('selector-perfil').value;
        if (!idPerfil || !hayCambiosPendientes) return;

        const btn = document.getElementById('btn-guardar-lote');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-circle-notch fa-spin mr-2"></i> GUARDANDO...';
        btn.disabled = true;

        try {
            const token = localStorage.getItem('token_corporativo');
            const response = await fetch(`${BASE_URL}permisos-perfil/guardar`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    idPerfil: parseInt(idPerfil),
                    matriz: matrizBorrador
                })
            });

            const result = await response.json();

            if (result.status === 'success') {
                matrizOriginal = JSON.parse(JSON.stringify(matrizBorrador));
                ocultarPanelGuardado();
                mostrarNotificacionToast('¡Éxito!', 'Permisos guardados correctamente.', 'success');
            } else {
                mostrarNotificacionToast('Error', result.message, 'error');
            }
        } catch (error) {
            mostrarNotificacionToast('Error', 'Error de conexión.', 'error');
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    };

    function mostrarNotificacionToast(titulo, mensaje, tipo) {
        const colorClass = tipo === 'success' ? 'from-emerald-500 to-teal-600' : (tipo === 'error' ? 'from-red-500 to-rose-600' : 'from-amber-500 to-orange-600');
        const icono = tipo === 'success' ? 'fa-check-circle' : (tipo === 'error' ? 'fa-exclamation-circle' : 'fa-undo');
        
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-24 lg:bottom-5 right-5 z-[9999] animate-slideInUp';
        toast.innerHTML = `
            <div class="bg-gradient-to-r ${colorClass} text-white rounded-2xl shadow-2xl p-4 pr-8 flex items-center gap-4 min-w-[300px]">
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

    if (!document.getElementById('matriz-styles')) {
        const style = document.createElement('style');
        style.id = 'matriz-styles';
        style.innerHTML = `
            .switch { position: relative; display: inline-block; width: 40px; height: 22px; }
            .switch input { opacity: 0; width: 0; height: 0; }
            .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #cbd5e1; transition: .2s; border-radius: 34px; }
            .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 2px; bottom: 2px; background-color: white; transition: .2s; border-radius: 50%; box-shadow: 0 1px 2px rgba(0,0,0,0.2); }
            input:checked + .slider { background-color: #2563eb; }
            input:checked + .slider:before { transform: translateX(18px); }
            
            @keyframes slideInUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            @keyframes fadeOutDown { from { transform: translateY(0); opacity: 1; } to { transform: translateY(100%); opacity: 0; } }
            .animate-slideInUp { animation: slideInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            .animate-fadeOutDown { animation: fadeOutDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        `;
        document.head.appendChild(style);
    }
})();












/*(function() {
    console.log('✅ permisos-perfil.js cargado correctamente');
    
    let perfilesData = [];
    let matrizActual = [];
    let peticionesActivas = 0;
    let notificacionTimeout;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        console.log('📡 Inicializando matriz de seguridad');
        llenarSelectorPerfiles();
    }

    async function llenarSelectorPerfiles() {
        try {
            const token = localStorage.getItem('token_corporativo');
            if (!token) {
                window.location.href = `${BASE_URL}login`;
                return;
            }

            const response = await fetch(`${BASE_URL}perfil/listar`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) throw new Error('Error al cargar perfiles');
            
            const result = await response.json();

            if (result.status === 'success') {
                perfilesData = result.data || [];
                const select = document.getElementById('selector-perfil');
                
                if (!select) return;
                
                select.innerHTML = '<option value="">Selecciona un perfil</option>';
                
                if (perfilesData.length === 0) {
                    select.innerHTML += '<option value="" disabled>No hay perfiles registrados</option>';
                    return;
                }

                perfilesData.forEach(perfil => {
                    const option = document.createElement('option');
                    option.value = perfil.id;
                    option.textContent = perfil.strNombrePerfil;
                    select.appendChild(option);
                });
            }
        } catch (error) {
            console.error("❌ Error cargando perfiles:", error);
        }
    }

    async function cargarMatriz() {
        const select = document.getElementById('selector-perfil');
        const idPerfil = select?.value;
        const tbody = document.getElementById('tabla-permisos');
        const loader = document.getElementById('loader-matriz');

        if (!idPerfil) {
            if (tbody) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="6" class="text-center p-12 text-slate-400 font-bold text-base">
                            <i class="fas fa-arrow-up text-3xl text-blue-300 block mb-3"></i>
                            Selecciona un perfil arriba
                        </td>
                    </tr>
                `;
            }
            return;
        }

        if (loader) {
            loader.classList.remove('hidden');
            loader.classList.add('flex');
        }

        try {
            const token = localStorage.getItem('token_corporativo');
            if (!token) {
                window.location.href = `${BASE_URL}login`;
                return;
            }

            const response = await fetch(`${BASE_URL}permisos-perfil/cargarData/${idPerfil}`, {
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
                matrizActual = result.data || [];
                tbody.innerHTML = '';
                
                if (!matrizActual || matrizActual.length === 0) {
                    tbody.innerHTML = `
                        <tr>
                            <td colspan="6" class="text-center p-12 text-slate-500 font-bold text-base">
                                <i class="fas fa-database text-4xl text-slate-300 block mb-3"></i>
                                No hay módulos registrados
                            </td>
                        </tr>
                    `;
                    return;
                }

                let htmlRows = '';
                matrizActual.forEach(fila => {
                    htmlRows += `
                        <tr class="hover:bg-blue-50/40 transition-colors group">
                            <td class="p-6 font-extrabold text-slate-800 tracking-wide text-base">${fila.nombreModulo}</td>
                            <td class="p-6 text-center">${crearToggle(fila.idModulo, 'bitConsulta', fila.bitConsulta)}</td>
                            <td class="p-6 text-center">${crearToggle(fila.idModulo, 'bitAgregar', fila.bitAgregar)}</td>
                            <td class="p-6 text-center">${crearToggle(fila.idModulo, 'bitEditar', fila.bitEditar)}</td>
                            <td class="p-6 text-center">${crearToggle(fila.idModulo, 'bitEliminar', fila.bitEliminar)}</td>
                            <td class="p-6 text-center">${crearToggle(fila.idModulo, 'bitDetalle', fila.bitDetalle)}</td>
                        </tr>
                    `;
                });
                
                tbody.innerHTML = htmlRows;
            }
        } catch (error) {
            console.error('❌ Error:', error);
        } finally {
            if (loader) {
                loader.classList.add('hidden');
                loader.classList.remove('flex');
            }
        }
    }

    function crearToggle(idModulo, campo, estado) {
        const checked = estado ? 'checked' : '';
        return `
            <label class="switch">
                <input type="checkbox" 
                    data-modulo="${idModulo}"
                    data-campo="${campo}"
                    onclick="window.cambioPermiso(this)" 
                    ${checked}>
                <span class="slider"></span>
            </label>
        `;
    }

    window.cambioPermiso = function(inputElement) {
        const idPerfil = document.getElementById('selector-perfil')?.value;
        
        if (!idPerfil) {
            inputElement.checked = !inputElement.checked;
            return;
        }

        const idModulo = parseInt(inputElement.dataset.modulo);
        const campo = inputElement.dataset.campo;
        const valor = inputElement.checked;

        const fila = matrizActual.find(f => f.idModulo === idModulo);
        if (fila) {
            fila[campo] = valor;
        }

        const token = localStorage.getItem('token_corporativo');
        if (!token) return;

        peticionesActivas++;
        
        fetch(`${BASE_URL}permisos-perfil/guardar`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({ 
                idPerfil: parseInt(idPerfil), 
                idModulo: idModulo, 
                campo: campo, 
                valor: valor 
            })
        })
        .catch(error => {
            console.error('Error:', error);
          
            if (inputElement) {
                inputElement.checked = !valor;
                if (fila) fila[campo] = !valor;
            }
        })
        .finally(() => {
            peticionesActivas--;
        });
    };

    window.cargarMatriz = cargarMatriz;
})();


const style = document.createElement('style');
style.textContent = `
    .switch {
        position: relative;
        display: inline-block;
        width: 40px;
        height: 22px;
    }
    
    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }
    
    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #cbd5e1;
        transition: .1s;
        border-radius: 34px;
    }
    
    .slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 2px;
        bottom: 2px;
        background-color: white;
        transition: .1s;
        border-radius: 50%;
    }
    
    input:checked + .slider {
        background-color: #2563eb;
    }
    
    input:checked + .slider:before {
        transform: translateX(18px);
    }
`;
document.head.appendChild(style);*/