<div class="animate-slideUp">
    <div class="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div>
            <h2 class="text-3xl font-extrabold text-slate-800 tracking-tight">Cuentas de Acceso</h2>
            <p class="text-slate-500 text-sm mt-1 font-medium">Administra quién puede entrar al corporativo</p>
        </div>
        <button id="btn-nuevo-usuario" style="display: none;" onclick="abrirFormularioUsuario()" class="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-extrabold py-3.5 px-6 rounded-xl shadow-lg shadow-blue-500/30 transform transition-all hover:scale-105 items-center gap-3">
            <i class="fas fa-user-plus"></i> NUEVO 
        </button>
    </div>

    <div class="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
        
        <div class="p-6 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-100">
            <div class="relative w-full md:w-[28rem] group">
                <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"></i>
                <input type="text" id="buscador-usuario" placeholder="Buscar por nombre, correo, teléfono o perfil..." autocomplete="off" class="w-full h-12 pl-12 pr-4 bg-white border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium">
            </div>
            <div class="text-sm font-bold text-slate-500" id="info-resultados-usuario">
                Cargando usuarios...
            </div>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-[0.1em] border-b border-slate-100">
                        <th class="p-6 font-extrabold">Usuario</th>
                        <th class="p-6 font-extrabold">Contacto</th>
                        <th class="p-6 font-extrabold">Perfil Asignado</th>
                        <th class="p-6 font-extrabold text-center">Estado</th>
                        <th class="p-6 font-extrabold text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody id="tabla-usuarios" class="text-sm font-medium text-slate-700 divide-y divide-slate-100/80">
                </tbody>
            </table>
        </div>

        <div class="p-6 bg-white border-t border-slate-100 flex justify-center md:justify-end">
            <nav class="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 shadow-sm" id="paginacion-usuario">
            </nav>
        </div>
    </div>
</div>

<template id="form-usuario-template">
    <form id="formUsuario" onsubmit="guardarUsuario(event)" class="space-y-5">
        <input type="hidden" id="usuario_id">
        
        <div class="flex justify-center mb-4">
            <div class="relative">
                <div id="foto-preview-container" class="w-24 h-24 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 border-2 border-blue-200 overflow-hidden flex items-center justify-center">
                    <img id="foto-preview" src="#" alt="Vista previa" class="w-full h-full object-cover hidden">
                    <i id="foto-preview-icon" class="fas fa-user text-4xl text-blue-300"></i>
                </div>
                <button type="button" onclick="limpiarFoto()" id="btn-limpiar-foto" class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hidden items-center justify-center hover:bg-red-600 transition-colors shadow-md">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="space-y-2">
                <label class="block text-sm font-bold text-slate-700 pl-1 tracking-wide">Nombre de Usuario</label>
                <div class="relative group">
                    <i class="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"></i>
                    <input type="text" id="usuario_nombre" required maxlength="50" autocomplete="off"
                        class="w-full h-12 pl-11 pr-4 bg-slate-50/50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold"
                        placeholder="ej. liz_admin" oninput="this.value = this.value.replace(/[^a-zA-Z0-9_]/g, '');">
                </div>
            </div>

            <div class="space-y-2">
                <label class="block text-sm font-bold text-slate-700 pl-1 tracking-wide">Contraseña</label>
                <div class="relative group">
                    <i class="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"></i>
                    <input type="password" id="usuario_pwd" maxlength="30" autocomplete="off"
                        class="w-full h-12 pl-11 pr-4 bg-slate-50/50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold"
                        placeholder="••••••••" oninput="this.value = this.value.replace(/\s/g, '');">
                </div>
                <p class="text-[10px] text-slate-400 pl-1 font-medium">Déjalo en blanco si no deseas cambiarla al editar.</p>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="space-y-2">
                <label class="block text-sm font-bold text-slate-700 pl-1 tracking-wide">Correo Electrónico</label>
                <div class="relative group">
                    <i class="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"></i>
                    <input type="email" id="usuario_correo" maxlength="100" autocomplete="off"
                        class="w-full h-12 pl-11 pr-4 bg-slate-50/50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold"
                        placeholder="correo@ejemplo.com">
                </div>
            </div>

            <div class="space-y-2">
                <label class="block text-sm font-bold text-slate-700 pl-1 tracking-wide">Número Celular</label>
                <div class="relative group">
                    <i class="fas fa-phone absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"></i>
                    <input type="tel" id="usuario_celular" maxlength="15" autocomplete="off"
                        class="w-full h-12 pl-11 pr-4 bg-slate-50/50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold"
                        placeholder="55 1234 5678">
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="space-y-2">
                <label class="block text-sm font-bold text-slate-700 pl-1 tracking-wide">Asignar Perfil</label>
                <div class="relative group">
                    <i class="fas fa-id-badge absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors z-10"></i>
                    <select id="usuario_perfil" required class="w-full h-12 pl-11 pr-10 bg-slate-50/50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold appearance-none cursor-pointer relative z-0">
                        <option value="">Cargando perfiles...</option>
                    </select>
                    <i class="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10"></i>
                </div>
            </div>

            <div class="space-y-2">
                <label class="block text-sm font-bold text-slate-700 pl-1 tracking-wide">Foto del Trabajador</label>
                <div class="relative group">
                    <i class="fas fa-camera absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"></i>
                    <input type="file" id="usuario_foto" accept="image/*" onchange="previsualizarFoto(this)"
                        class="w-full h-12 pl-11 pr-4 bg-slate-50/50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-blue-50 file:text-blue-700 file:font-bold hover:file:bg-blue-100">
                </div>
                <p class="text-[10px] text-slate-400 pl-1 font-medium">Opcional. Formatos: JPG, PNG, GIF</p>
            </div>
        </div>

        <div class="flex items-center gap-4 p-4 bg-slate-50/80 border-2 border-slate-200 rounded-xl mt-4">
            <input type="checkbox" id="usuario_estado" class="w-6 h-6 text-blue-600 rounded-md focus:ring-blue-500 focus:ring-2 cursor-pointer border-slate-300" checked>
            <div>
                <label for="usuario_estado" class="font-extrabold text-slate-700 block cursor-pointer">Usuario Activo en el Sistema</label>
                <p class="text-xs text-slate-500 font-medium mt-0.5">Si se desmarca, el usuario perderá su acceso inmediatamente.</p>
            </div>
        </div>

        <div class="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <button type="button" onclick="cerrarModal()" class="px-6 py-3.5 bg-slate-100 text-slate-600 font-extrabold rounded-xl hover:bg-slate-200 transition-all tracking-wide">
                CANCELAR
            </button>
            <button type="submit" id="btn-guardar-usuario" class="px-6 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-extrabold rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-2 tracking-wide">
                <i class="fas fa-save"></i> GUARDAR
            </button>
        </div>
    </form>
</template>