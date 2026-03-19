<div class="animate-slideUp">
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        <div class="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex items-center gap-3">
                <i class="fas fa-box-open text-blue-500 text-3xl"></i>
                <div>
                    <h2 id="titulo-dinamico-estatico" class="text-2xl font-extrabold text-slate-800">Cargando...</h2>
                    <p class="text-sm text-slate-500 font-medium">Gestión de Inventario (Módulo Interactivo)</p>
                </div>
            </div>
            
            <div class="flex flex-wrap gap-2">
                <button id="btn-agregar-estatico" onclick="window.abrirFormularioEstatico()" class="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl transition-all shadow-md hover:scale-105 flex items-center gap-2">
                    <i class="fas fa-plus"></i> NUEVO
                </button>
            </div>
        </div>

        <div class="p-6 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <div class="relative w-full md:w-96 group">
                <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"></i>
                <input type="text" id="buscador-estatico" placeholder="Buscar por nombre o categoría..." autocomplete="off" class="w-full h-12 pl-12 pr-4 bg-white border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium">
            </div>
            <div class="text-sm font-bold text-slate-500" id="info-resultados">
                Cargando productos...
            </div>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-slate-50/80 text-slate-500 text-xs uppercase tracking-wider border-y border-slate-200">
                        <th class="p-5 font-extrabold">Producto</th>
                        <th class="p-5 font-extrabold">Categoría</th>
                        <th class="p-5 font-extrabold text-right">Precio</th>
                        <th class="p-5 font-extrabold text-center">Stock</th>
                        <th class="p-5 font-extrabold text-center w-32">Acciones</th>
                    </tr>
                </thead>
                <tbody id="tabla-estatica" class="text-sm text-slate-700 divide-y divide-slate-100">
                </tbody>
            </table>
        </div>

        <div class="p-6 bg-white border-t border-slate-100 flex justify-center md:justify-end">
            <nav class="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 shadow-sm" id="paginacion-estatica">
            </nav>
        </div>
    </div>
</div>

<template id="form-estatico-template">
    <form id="formEstatico" onsubmit="window.guardarProductoEstatico(event)" class="space-y-5">
        <input type="hidden" id="estatico_id">
        
        <div class="space-y-2">
            <label class="block text-sm font-bold text-slate-700 pl-1">Nombre del Producto</label>
            <input type="text" id="estatico_nombre" required class="w-full h-12 px-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:border-blue-500 font-bold" placeholder="Ej. Teclado Mecánico">
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="space-y-2">
                <label class="block text-sm font-bold text-slate-700 pl-1">Categoría</label>
                <select id="estatico_categoria" required class="w-full h-12 px-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:border-blue-500 font-bold">
                    <option value="Electrónica">Electrónica</option>
                    <option value="Accesorios">Accesorios</option>
                    <option value="Componentes">Componentes</option>
                    <option value="Mobiliario">Mobiliario</option>
                </select>
            </div>
            <div class="space-y-2">
                <label class="block text-sm font-bold text-slate-700 pl-1">Precio ($)</label>
                <input type="number" id="estatico_precio" required min="1" step="0.01" class="w-full h-12 px-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:border-blue-500 font-bold" placeholder="0.00">
            </div>
        </div>

        <div class="space-y-2">
            <label class="block text-sm font-bold text-slate-700 pl-1">Stock Disponible</label>
            <input type="number" id="estatico_stock" required min="0" class="w-full h-12 px-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:border-blue-500 font-bold" placeholder="0">
        </div>

        <div class="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <button type="button" onclick="cerrarModal()" class="px-6 py-3.5 bg-slate-100 text-slate-600 font-extrabold rounded-xl hover:bg-slate-200 transition-all">CANCELAR</button>
            <button type="submit" id="btn-guardar-estatico" class="px-6 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-extrabold rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-2"><i class="fas fa-save"></i> GUARDAR</button>
        </div>
    </form>
</template>