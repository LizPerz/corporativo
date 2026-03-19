<div class="animate-slideUp">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
            <h2 class="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">Perfiles de Usuario</h2>
            <p class="text-base md:text-lg text-slate-500 mt-1">Administra los niveles de acceso del sistema</p>
        </div>
        <button id="btn-nuevo-perfil" style="display: none;" onclick="abrirFormularioPerfil()" class="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-blue-500/30 transform transition-all hover:scale-105 flex items-center justify-center gap-2 text-base md:text-lg whitespace-nowrap">
            <i class="fas fa-plus"></i> NUEVO
        </button>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        <div class="p-6 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-100">
            <div class="relative w-full md:w-96 group">
                <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"></i>
                <input type="text" id="buscador-perfil" placeholder="Buscar perfil..." autocomplete="off" class="w-full h-12 pl-12 pr-4 bg-white border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium">
            </div>
            <div class="text-sm font-bold text-slate-500" id="info-resultados-perfil">
                Cargando perfiles...
            </div>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                        <th class="p-5 font-extrabold text-blue-600">Nombre del Perfil</th>
                        <th class="p-5 font-extrabold text-blue-600 text-center">Permisos Admin</th>
                        <th class="p-5 font-extrabold text-blue-600 text-center w-40">Acciones</th>
                    </tr>
                </thead>
                <tbody id="tabla-perfiles" class="text-base text-slate-700 divide-y divide-slate-100">
                </tbody>
            </table>
        </div>

        <div class="p-6 bg-white border-t border-slate-100 flex justify-center md:justify-end">
            <nav class="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 shadow-sm" id="paginacion-perfil">
            </nav>
        </div>
    </div>
</div>

<template id="form-perfil-template">
    <form id="formPerfil" onsubmit="guardarPerfil(event)" class="space-y-6">
        <input type="hidden" id="perfil_id">
        
        <div>
            <label class="block text-base font-bold text-slate-700 mb-2 pl-1">Nombre del Perfil</label>
            <div class="relative group">
                <i class="fas fa-id-card absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors text-lg"></i>
                <input type="text" id="perfil_nombre" required maxlength="50" autocomplete="off"
                    class="w-full h-14 pl-12 pr-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-base"
                    placeholder="EJ: ADMINISTRADOR">
            </div>
            <p class="text-sm text-slate-500 mt-2 ml-1"><i class="fas fa-info-circle text-blue-500"></i> El nombre se guardará en mayúsculas.</p>
        </div>

        <div class="flex items-center gap-3 p-5 bg-slate-50 border border-slate-200 rounded-xl">
            <input type="checkbox" id="perfil_admin" class="w-6 h-6 text-blue-600 rounded focus:ring-blue-500 focus:ring-2">
            <div>
                <label for="perfil_admin" class="font-extrabold text-slate-700 block cursor-pointer text-base">Es Administrador Global</label>
                <p class="text-sm text-slate-500">Otorga control total sobre el sistema</p>
            </div>
        </div>

        <div class="flex justify-end gap-3 pt-4">
            <button type="button" onclick="cerrarModal()" class="px-6 py-3.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors text-base">
                CANCELAR
            </button>
            <button type="submit" id="btn-guardar-perfil" class="px-6 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-2 text-base">
                <i class="fas fa-save"></i> GUARDAR
            </button>
        </div>
    </form>
</template>