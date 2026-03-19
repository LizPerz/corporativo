document.addEventListener('DOMContentLoaded', () => {
    validarSesion();
    pintarMenu();
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024) {
            document.getElementById('mobile-overlay').classList.add('hidden');
        }
    });
});

let dropdownState = {};

function validarSesion() {
    const token = localStorage.getItem('token_corporativo');
    const user = localStorage.getItem('usuario_nombre');
    
    if (!token) {
        window.location.href = `${BASE_URL}login`;
        return;
    }
    
    const userNameEl = document.getElementById('user-name');
    if (userNameEl) {
        userNameEl.innerText = user || 'Usuario';
    }
}

function volverDashboard() {
    document.getElementById('breadcrumb-text').innerText = 'Dashboard';
    const container = document.getElementById('main-container');
    
    container.innerHTML = `
        <div class="h-full flex items-center justify-center">
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-10 text-center max-w-md w-full animate-fadeIn">
                <div class="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <i class="fas fa-chart-pie text-2xl text-white"></i>
                </div>
                <h2 class="text-xl font-bold text-slate-800 mb-2">Bienvenido</h2>
                <p class="text-slate-500 text-sm">Selecciona un módulo del menú para comenzar</p>
            </div>
        </div>
    `;
}

function pintarMenu() {
    try {
        const modulos = JSON.parse(localStorage.getItem('modulos_permitidos')) || [];
        const contenedor = document.getElementById('menu-dinamico');
        if (!contenedor) return;

        if (!modulos || modulos.length === 0) {
            contenedor.innerHTML = `<div class="text-center py-8 px-4"><p class="text-sm text-slate-400">Sin módulos asignados</p></div>`;
            return;
        }

        // Definir los grupos con sus categorías
        const grupos = {
            'SEGURIDAD': {
                icon: 'fa-shield-halved',
                color: 'from-blue-500 to-blue-600',
                modulos: []
            },
            'PRINCIPAL 1': {
                icon: 'fa-star',
                color: 'from-amber-500 to-amber-600',
                modulos: []
            },
            'PRINCIPAL 2': {
                icon: 'fa-gem',
                color: 'from-purple-500 to-purple-600',
                modulos: []
            }
        };

        // Clasificar módulos
        modulos.forEach(mod => {
            const nombre = mod.strNombreModulo.toUpperCase();
            
            if (['PERFIL', 'USUARIO', 'MODULO', 'PERMISOS-PERFIL'].includes(nombre)) {
                grupos['SEGURIDAD'].modulos.push(mod);
            } else if (nombre.includes('PRINCIPAL 1')) {
                grupos['PRINCIPAL 1'].modulos.push(mod);
            } else if (nombre.includes('PRINCIPAL 2')) {
                grupos['PRINCIPAL 2'].modulos.push(mod);
            } else {
                // Si no está en ningún grupo, lo metemos en "OTROS" (que no se muestra)
                if (!grupos['OTROS']) {
                    grupos['OTROS'] = { modulos: [] };
                }
                grupos['OTROS'].modulos.push(mod);
            }
        });

        let html = '';
        
        // Generar HTML para cada grupo que tenga módulos
        for (const [nombreGrupo, info] of Object.entries(grupos)) {
            if (info.modulos && info.modulos.length > 0) {
                const grupoId = `grupo-${nombreGrupo.replace(/\s+/g, '-').toLowerCase()}`;
                const isOpen = dropdownState[grupoId] || false;
                
                html += `
                    <div class="mb-2">
                        <!-- Cabecera del dropdown (clickeable) -->
                        <button onclick="toggleDropdown('${grupoId}')" 
                                class="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 rounded-lg bg-gradient-to-br ${info.color || 'from-blue-500 to-indigo-600'} bg-opacity-10 flex items-center justify-center">
                                    <i class="fas ${info.icon || 'fa-folder'} text-sm text-${info.color ? info.color.split(' ')[0].replace('from-', '') : 'blue-600'}"></i>
                                </div>
                                <span class="text-sm font-bold text-slate-700">${nombreGrupo}</span>
                            </div>
                            <i class="fas fa-chevron-down text-xs text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}"></i>
                        </button>
                        
                        <!-- Contenedor de submenús (se oculta/muestra) -->
                        <div id="${grupoId}" class="pl-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}">
                `;
                
                // Agregar los módulos de este grupo
                info.modulos.forEach(mod => {
                    const nombre = mod.strNombreModulo;
                    const urlSlug = nombre.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '');
                    
                    html += `
                        <button onclick="cargarModulo('${urlSlug}', '${nombre}')"
                                class="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-600 hover:text-white hover:bg-gradient-to-r ${info.color || 'from-blue-500 to-indigo-600'} transition-all group">
                            <i class="fas fa-circle text-[6px] text-slate-400 group-hover:text-white/70"></i>
                            <span class="text-sm font-medium flex-1 text-left">${nombre}</span>
                        </button>
                    `;
                });
                
                html += `</div></div>`;
            }
        }
        
        contenedor.innerHTML = html;
        
    } catch (e) {
        console.error('Error al cargar menú:', e);
    }
}

// Función para abrir/cerrar dropdowns
window.toggleDropdown = function(grupoId) {
    dropdownState[grupoId] = !dropdownState[grupoId];
    
    const elemento = document.getElementById(grupoId);
    const boton = elemento?.previousElementSibling;
    const icono = boton?.querySelector('.fa-chevron-down');
    
    if (elemento) {
        if (dropdownState[grupoId]) {
            elemento.classList.remove('max-h-0', 'opacity-0');
            elemento.classList.add('max-h-96', 'opacity-100');
            if (icono) icono.classList.add('rotate-180');
        } else {
            elemento.classList.remove('max-h-96', 'opacity-100');
            elemento.classList.add('max-h-0', 'opacity-0');
            if (icono) icono.classList.remove('rotate-180');
        }
    }
};

function logout() {
    localStorage.clear();
    window.location.href = `${BASE_URL}login`;
}

function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobile-overlay');
    
    if (sidebar && overlay) {
        sidebar.classList.toggle('-translate-x-full');
        overlay.classList.toggle('hidden');
    }
}

function abrirModal(titulo, contenido) {
    const modal = document.getElementById('modal-generico');
    const modalContent = document.getElementById('modal-content');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalBody = document.getElementById('modal-body');
    
    if (!modal || !modalContent) return;
    
    modalTitulo.innerHTML = `
        <div class="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <i class="fas fa-edit text-white text-xs"></i>
        </div>
        <span>${titulo}</span>
    `;
    
    modalBody.innerHTML = contenido;
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    setTimeout(() => {
        modalContent.classList.remove('scale-95', 'opacity-0');
        modalContent.classList.add('scale-100', 'opacity-100');
    }, 10);
}

function cerrarModal() {
    const modal = document.getElementById('modal-generico');
    const modalContent = document.getElementById('modal-content');
    
    if (!modal || !modalContent) return;
    
    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-95', 'opacity-0');
    
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.getElementById('modal-body').innerHTML = '';
    }, 300);
}

async function cargarModulo(controlador, titulo) {
    if (window.innerWidth < 1024) toggleMenu();
    
    document.getElementById('breadcrumb-text').innerText = titulo;
    const container = document.getElementById('main-container');
    
    container.innerHTML = `
        <div class="h-full flex items-center justify-center">
            <div class="bg-white/95 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/30 text-center flex flex-col items-center max-w-sm w-full">
                <i class="fas fa-circle-notch fa-spin text-4xl text-blue-500 mb-4"></i>
                <p class="font-bold text-slate-800 text-lg">Cargando ${titulo}...</p>
            </div>
        </div>
    `;

    // Módulo Comodín para principal-*
    let urlFetch = `${BASE_URL}${controlador}/index`;
    let jsFile = controlador;

    if (controlador.startsWith('principal-')) {
        urlFetch = `${BASE_URL}estatico/index`; 
        jsFile = 'estatico'; 
        window.moduloEstaticoActivo = titulo; 
    }

    try {
        const response = await fetch(urlFetch, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token_corporativo')}`,
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        
        if (!response.ok) throw new Error('Error en red');
        
        const html = await response.text();
        container.innerHTML = html;

        const scriptsAnteriores = document.querySelectorAll(`script[id^="script-${controlador}"]`);
        scriptsAnteriores.forEach(script => script.remove());

        const script = document.createElement('script');
        script.id = `script-${controlador}-${Date.now()}`; 
        script.src = `${BASE_URL}js/${jsFile}.js?v=${Date.now()}`; 
        document.body.appendChild(script);

    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = `
            <div class="h-full flex items-center justify-center">
                <div class="bg-white/95 p-6 rounded-2xl text-center border border-red-200 shadow-2xl">
                    <i class="fas fa-exclamation-triangle text-3xl text-red-500 mb-3"></i>
                    <p class="text-slate-800 font-bold">Error al cargar el módulo</p>
                </div>
            </div>
        `;
    }
}

window.obtenerPermisosModulo = function(nombreModuloABuscar) {
    const modulosPermitidos = JSON.parse(localStorage.getItem('modulos_permitidos')) || [];
    const modulo = modulosPermitidos.find(m => m.strNombreModulo.toUpperCase() === nombreModuloABuscar.toUpperCase());
    
    if (modulo) {
        return modulo;
    } else {
        return { bitAgregar: false, bitEditar: false, bitEliminar: false, bitConsulta: false, bitDetalle: false };
    }
};