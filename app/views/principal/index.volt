<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard | Corporativo Liz</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap');
        body { font-family: 'Inter', sans-serif; }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        /* Estilo para el dropdown */
        .dropdown-enter {
            max-height: 0;
            opacity: 0;
            overflow: hidden;
            transition: max-height 0.3s ease-out, opacity 0.2s ease-out;
        }
        .dropdown-enter-active {
            max-height: 300px;
            opacity: 1;
        }
        .dropdown-exit {
            max-height: 300px;
            opacity: 1;
        }
        .dropdown-exit-active {
            max-height: 0;
            opacity: 0;
            overflow: hidden;
            transition: max-height 0.3s ease-in, opacity 0.2s ease-in;
        }
    </style>
</head>
<body class="bg-slate-50 m-0 p-0 h-screen w-screen overflow-hidden text-slate-800 selection:bg-blue-500 selection:text-white">

    <div id="mobile-overlay" onclick="toggleMenu()" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 hidden lg:hidden transition-opacity"></div>

    <!-- SIDEBAR - Fondo blanco, pegada a la esquina -->
    <aside id="sidebar" class="fixed inset-y-0 left-0 w-[320px] bg-white shadow-[2px_0_20px_rgba(0,0,0,0.02)] flex flex-col z-50 transform -translate-x-full lg:translate-x-0 transition-transform duration-300 ease-out border-r border-slate-100">
        
        <!-- Logo -->
        <div class="h-28 flex items-center justify-between px-6 border-b border-slate-100">
            <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                    <i class="fas fa-crown text-white text-2xl"></i>
                </div>
                <div>
                    <h1 class="text-3xl font-bold tracking-tight text-slate-800">CORP<span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">LIZ</span></h1>
                    <p class="text-sm font-medium text-slate-400 tracking-wider">PORTAL CORPORATIVO</p>
                </div>
            </div>
            <button onclick="toggleMenu()" class="lg:hidden w-10 h-10 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center">
                <i class="fas fa-times text-lg"></i>
            </button>
        </div>

        <!-- Menú de navegación -->
        <nav class="flex-1 overflow-y-auto no-scrollbar py-6 px-4">
            <!-- INICIO - Siempre visible -->
            <div class="mb-6">
                <button onclick="volverDashboard()" 
                        class="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-slate-700 hover:text-white hover:bg-gradient-to-r from-blue-500 to-indigo-600 transition-all group">
                    <div class="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-white/20 group-hover:text-white transition-colors">
                        <i class="fas fa-home text-lg"></i>
                    </div>
                    <span class="text-sm font-extrabold flex-1 text-left">INICIO</span>
                    <i class="fas fa-chevron-right text-xs text-slate-400 group-hover:text-white/70 transition-all opacity-0 group-hover:opacity-100"></i>
                </button>
            </div>

            

            <div id="menu-dinamico" class="space-y-3"></div>
        </nav>

        <div class="p-5 border-t border-slate-100">
            <button onclick="logout()" class="w-full py-4 px-4 bg-slate-50 hover:bg-red-50 rounded-xl text-slate-700 hover:text-red-600 text-sm font-bold flex items-center justify-center gap-3 transition-all border border-slate-200 hover:border-red-200 group">
                <i class="fas fa-sign-out-alt text-base group-hover:rotate-12 transition-transform"></i>
                <span>CERRAR SESIÓN</span>
            </button>
        </div>
    </aside>

    <main class="lg:ml-[320px] h-screen flex flex-col bg-slate-50">
        
        <header class="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-6 shadow-sm">
            <div class="flex items-center gap-4">
                <button onclick="toggleMenu()" class="lg:hidden w-10 h-10 rounded-xl bg-slate-100 text-slate-600 hover:text-blue-600 hover:bg-blue-50 flex items-center justify-center transition-colors">
                    <i class="fas fa-bars text-lg"></i>
                </button>
                
                <nav class="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
                    <i class="fas fa-home text-blue-500 text-xs"></i>
                    <ol class="flex items-center gap-2">
                        <li>
                            <button onclick="volverDashboard()" class="text-slate-500 hover:text-blue-600 font-medium transition-colors">Inicio</button>
                        </li>
                        <li class="flex items-center">
                            <i class="fas fa-chevron-right text-[10px] text-slate-400"></i>
                        </li>
                        <li>
                            <span id="breadcrumb-text" class="text-slate-800 font-bold text-sm">Dashboard</span>
                        </li>
                    </ol>
                </nav>
            </div>

            <div class="flex items-center gap-3">
                <div class="flex items-center gap-3 pr-4 py-2 rounded-xl bg-slate-50/80">
                    <div class="text-right hidden sm:block">
                        <p id="user-name" class="text-sm font-bold text-slate-800">Cargando...</p>
                        <p class="text-xs text-green-600 font-medium flex items-center justify-end gap-1">
                            <span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                            En línea
                        </p>
                    </div>
                    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                        <i class="fas fa-user-astronaut text-white text-sm"></i>
                    </div>
                </div>
            </div>
        </header>

        <section class="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8" id="main-container">
            <div class="h-full flex items-center justify-center">
                <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-10 text-center max-w-md w-full animate-fadeIn">
                    <div class="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <i class="fas fa-chart-pie text-2xl text-white"></i>
                    </div>
                    <h2 class="text-xl font-bold text-slate-800 mb-2">Bienvenido</h2>
                    <p class="text-slate-500 text-sm">Selecciona un módulo del menú para comenzar</p>
                </div>
            </div>
        </section>
    </main>

    <div id="modal-generico" class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <div id="modal-content" class="bg-gradient-to-br from-blue-600 to-indigo-700 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] transform transition-all duration-300 scale-95 opacity-0">
            <div class="px-5 py-4 border-b border-white/20 flex items-center justify-between">
                <h3 id="modal-titulo" class="text-lg font-bold text-white flex items-center gap-2">
                    <div class="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                        <i class="fas fa-edit text-white text-xs"></i>
                    </div>
                    <span>Título</span>
                </h3>
                <button onclick="cerrarModal()" class="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors backdrop-blur-sm">
                    <i class="fas fa-times text-xs"></i>
                </button>
            </div>
            <div id="modal-body" class="p-5 overflow-y-auto no-scrollbar bg-white/95 rounded-b-2xl text-slate-700"></div>
        </div>
    </div>

    <script>const BASE_URL = "{{ url('') }}";</script>
    <script src="{{ url('js/principal.js') }}"></script>
</body>
</html>