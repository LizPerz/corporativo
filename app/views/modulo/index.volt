<div class="animate-slideUp">
    <div class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div>
            <h2 class="text-3xl font-extrabold text-slate-800 tracking-tight">Módulos del Sistema</h2>
            <p class="text-slate-500 text-sm mt-1 font-medium">Registra y administra las secciones del corporativo</p>
        </div>
        <button id="btn-nuevo-modulo" style="display: none;" onclick="abrirFormularioModulo()" class="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-extrabold py-3.5 px-6 rounded-xl shadow-lg shadow-blue-500/30 transform transition-all hover:scale-105 flex items-center gap-3">
            <i class="fas fa-plus"></i> NUEVO
        </button>
    </div>

    <div class="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
        
        <div class="p-6 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-100">
            <div class="relative w-full md:w-96 group">
                <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"></i>
                <input type="text" id="buscador-modulo" placeholder="Buscar módulo..." autocomplete="off" class="w-full h-12 pl-12 pr-4 bg-white border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium">
            </div>
            <div class="text-sm font-bold text-slate-500" id="info-resultados-modulo">
                Cargando módulos...
            </div>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-[0.1em] border-b border-slate-200">
                        <th class="p-6 font-extrabold text-blue-600">Nombre del Módulo</th>
                        <th class="p-6 font-extrabold text-blue-600 text-center w-40">Acciones</th>
                    </tr>
                </thead>
                <tbody id="tabla-modulos" class="text-sm font-medium text-slate-700 divide-y divide-slate-100/80">
                </tbody>
            </table>
        </div>

        <div class="p-6 bg-white border-t border-slate-100 flex justify-center md:justify-end">
            <nav class="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 shadow-sm" id="paginacion-modulo">
            </nav>
        </div>
    </div>
</div>

<template id="form-modulo-template">
    <form id="formModulo" onsubmit="guardarModulo(event)" class="space-y-6">
        <input type="hidden" id="modulo_id">
        
        <div class="space-y-2">
            <label class="block text-sm font-bold text-slate-700 pl-1 tracking-wide">Nombre del Módulo</label>
            <div class="relative group">
                <i class="fas fa-cubes absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors text-lg"></i>
                <input type="text" id="modulo_nombre" required maxlength="50" autocomplete="off"
                    class="w-full h-14 pl-12 pr-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-extrabold uppercase tracking-wide"
                    placeholder="EJ: REPORTES">
            </div>
            <p class="text-xs text-slate-500 pl-1 font-medium"><i class="fas fa-info-circle text-blue-500"></i> Se guardará automáticamente en mayúsculas.</p>
        </div>

        <div class="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <button type="button" onclick="cerrarModal()" class="px-6 py-3.5 bg-slate-100 text-slate-600 font-extrabold rounded-xl hover:bg-slate-200 transition-all tracking-wide">
                CANCELAR
            </button>
            <button type="submit" id="btn-guardar-modulo" class="px-6 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-extrabold rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-2 tracking-wide">
                <i class="fas fa-save"></i> GUARDAR
            </button>
        </div>
    </form>
</template>