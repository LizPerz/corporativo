<div class="animate-slideUp relative pb-24">
    <div class="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-white/95 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100">
        <div>
            <h2 class="text-3xl font-extrabold text-slate-800 tracking-tight">Matriz de Seguridad</h2>
            <p class="text-slate-500 text-base mt-1 font-medium">Asigna qué módulos puede ver y modificar cada perfil</p>
        </div>
        <div class="w-full sm:w-80">
            <label class="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 pl-1">Seleccionar Perfil</label>
            <div class="relative">
                <i class="fas fa-id-badge absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <select id="selector-perfil" onchange="window.cargarMatriz()" class="w-full h-14 pl-12 pr-10 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold appearance-none cursor-pointer text-base">
                    <option value="">Selecciona un perfil...</option>
                </select>
                <i class="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
            </div>
        </div>
    </div>

    <div id="panel-buscador" class="hidden mb-6 bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
        <div class="relative w-full flex items-center justify-between gap-4">
            <div class="relative w-full md:w-96 group">
                <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input type="text" id="buscador-permisos" placeholder="Buscar módulo..." autocomplete="off" class="w-full h-12 pl-12 pr-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 transition-all font-medium">
            </div>
            <div class="text-sm font-bold text-slate-500" id="info-resultados-matriz"></div>
        </div>
    </div>

    <div class="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden relative min-h-[400px]">
        <div id="loader-matriz" class="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 hidden flex-col items-center justify-center">
            <i class="fas fa-circle-notch fa-spin text-5xl text-blue-500 mb-4"></i>
            <p class="font-bold text-slate-600 text-lg">Cargando matriz de permisos...</p>
        </div>
        
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-slate-50/50 text-blue-600 text-sm uppercase tracking-[0.1em] border-b border-slate-100">
                        <th class="p-6 font-extrabold sticky left-0 bg-slate-50/90 backdrop-blur-sm shadow-[1px_0_0_0_#f1f5f9] z-10">Módulo</th>
                        <th class="p-6 font-extrabold text-center"><i class="fas fa-eye mr-1"></i> Consulta</th>
                        <th class="p-6 font-extrabold text-center"><i class="fas fa-plus-circle mr-1"></i> Agregar</th>
                        <th class="p-6 font-extrabold text-center"><i class="fas fa-edit mr-1"></i> Editar</th>
                        <th class="p-6 font-extrabold text-center"><i class="fas fa-trash-alt mr-1"></i> Eliminar</th>
                        <th class="p-6 font-extrabold text-center"><i class="fas fa-info-circle mr-1"></i> Detalle</th>
                    </tr>
                </thead>
                <tbody id="tabla-permisos" class="text-base font-medium text-slate-700 divide-y divide-slate-100/80">
                    <tr>
                        <td colspan="6" class="text-center p-12 text-slate-400 font-bold text-base">
                            <i class="fas fa-arrow-up text-3xl text-blue-300 block mb-3"></i>
                            Selecciona un perfil en la parte superior
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="p-6 bg-white border-t border-slate-100 flex justify-center md:justify-end">
            <nav class="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 shadow-sm" id="paginacion-matriz">
            </nav>
        </div>
    </div>

    <div id="panel-guardado" class="fixed bottom-0 left-0 right-0 lg:left-64 z-[100] transform translate-y-full transition-transform duration-300">
        <div class="bg-slate-800/95 backdrop-blur-xl border-t border-slate-700 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.2)]">
            <div class="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
                <div class="flex items-center gap-4 text-white">
                    <div class="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <i class="fas fa-save text-blue-400 text-xl"></i>
                    </div>
                    <div>
                        <p class="font-extrabold text-lg">Cambios Pendientes</p>
                        <p class="text-sm text-slate-400">Guarda para aplicar los nuevos permisos.</p>
                    </div>
                </div>
                <div class="flex gap-3 w-full sm:w-auto">
                    <button onclick="window.descartarCambios()" class="flex-1 sm:flex-none px-6 py-3 bg-slate-700 text-slate-300 font-bold rounded-xl hover:bg-slate-600 hover:text-white transition-colors">
                        DESCARTAR
                    </button>
                    <button onclick="window.guardarMatrizEnLote()" id="btn-guardar-lote" class="flex-1 sm:flex-none px-8 py-3 bg-blue-600 text-white font-extrabold rounded-xl hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all">
                        GUARDAR PERMISOS
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>






<!-- <div class="animate-slideUp">
    <div class="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-white/95 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100">
        <div>
            <h2 class="text-3xl font-extrabold text-slate-800 tracking-tight">Matriz de Seguridad</h2>
            <p class="text-slate-500 text-base mt-1 font-medium">Asigna qué módulos puede ver y modificar cada perfil</p>
        </div>
        <div class="w-full sm:w-80">
            <label class="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 pl-1">Seleccionar Perfil</label>
            <div class="relative">
                <i class="fas fa-id-badge absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <select id="selector-perfil" onchange="cargarMatriz()" class="w-full h-14 pl-12 pr-10 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold appearance-none cursor-pointer text-base">
                    <option value="">Selecciona un perfil</option>
                </select>
                <i class="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
            </div>
        </div>
    </div>

    <div class="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden relative min-h-[400px]">
        <div id="loader-matriz" class="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 hidden flex-col items-center justify-center">
            <i class="fas fa-circle-notch fa-spin text-5xl text-blue-500 mb-4"></i>
            <p class="font-bold text-slate-600 text-lg">Cargando matriz de permisos...</p>
        </div>
        
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-slate-50/50 text-slate-500 text-lg uppercase tracking-[0.1em] border-b border-slate-100">
                        <th class="p-6 font-extrabold">Módulo</th>
                        <th class="p-6 font-extrabold text-center">Consulta</th>
                        <th class="p-6 font-extrabold text-center">Agregar</th>
                        <th class="p-6 font-extrabold text-center">Editar</th>
                        <th class="p-6 font-extrabold text-center">Eliminar</th>
                        <th class="p-6 font-extrabold text-center">Detalle</th>
                    </tr>
                </thead>
                <tbody id="tabla-permisos" class="text-base font-medium text-slate-700 divide-y divide-slate-100/80">
                    <tr>
                        <td colspan="6" class="text-center p-12 text-slate-400 font-bold text-base">
                            <i class="fas fa-arrow-up text-3xl text-blue-300 block mb-3"></i>
                            Selecciona un perfil arriba para ver su matriz de seguridad
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

<style>
    .switch {
        position: relative;
        display: inline-block;
        width: 44px;
        height: 24px;
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
        transition: .3s;
        border-radius: 34px;
        box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
    }
    
    .slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: .3s;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    
    input:checked + .slider {
        background-color: #2563eb;
    }
    
    input:checked + .slider:before {
        transform: translateX(20px);
    }
    
    input:focus + .slider {
        box-shadow: 0 0 1px #2563eb;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .animate-slideIn {
        animation: slideIn 0.3s ease-out forwards;
    }
</style> -->