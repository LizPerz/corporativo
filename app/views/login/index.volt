<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Acceso | Corporativo Liz</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <script src="https://www.google.com/recaptcha/api.js" async defer></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
    </style>
</head>
<body class="bg-gradient-to-br from-[#0B1120] via-[#1A2A4A] to-[#0A1A2F] m-0 p-0 min-h-screen flex items-center justify-center">

    <div class="absolute inset-0 overflow-hidden">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500 rounded-full mix-blend-overlay filter blur-[120px] opacity-15"></div>
        <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-overlay filter blur-[120px] opacity-15"></div>
        <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-500 rounded-full mix-blend-overlay filter blur-[120px] opacity-15"></div>
    </div>

    <div class="relative z-10 w-full flex items-center justify-center px-4">
        <div class="bg-white/95 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] w-full max-w-[420px] border border-white/30">
            
            <div class="w-full text-center mb-6">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/30 mb-4">
                    <i class="fas fa-crown text-3xl text-white"></i>
                </div>
                <h1 class="text-4xl font-extrabold text-slate-800 tracking-tight mb-1">
                    CORP<span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">LIZ</span>
                </h1>
                <p class="text-slate-500 font-medium text-xs uppercase tracking-[0.25em]">Portal Corporativo</p>
            </div>

            <form id="loginForm" class="w-full space-y-5" novalidate>
                <div class="space-y-1">
                    <label class="block text-xl font-bold text-slate-700 pl-1">Usuario</label>
                    <div class="relative group">
                        <div class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                            <i class="fas fa-user-circle text-lg"></i>
                        </div>
                        <input type="text" id="usuario" name="usuario" required maxlength="20"
                            class="w-full h-12 pl-9 pr-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-xl font-medium"
                            placeholder="Ingresa tu usuario">
                    </div>
                    <div class="flex flex-wrap items-center gap-2 min-h-[28px] px-1">
                        <i class="fas fa-circle-info text-sm text-blue-500"></i>
                        <p class="text-xl text-slate-600 font-medium" id="usuario-hint">Letras, números y _</p>
                        <p class="text-xl text-red-600 font-medium hidden ml-auto" id="usuario-error">❌ Formato inválido</p>
                        <p class="text-xl text-green-600 font-medium hidden ml-auto" id="usuario-success">✅ Válido</p>
                    </div>
                </div>

                <div class="space-y-1">
                    <label class="block text-xl font-bold text-slate-700 pl-1">Contraseña</label>
                    <div class="relative group">
                        <div class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                            <i class="fas fa-lock text-lg"></i>
                        </div>
                        <input type="password" id="password" name="password" required maxlength="30"
                            class="w-full h-12 pl-9 pr-9 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-xl font-medium"
                            placeholder="Ingresa tu contraseña">
                        <button type="button" onclick="togglePassword()" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 focus:outline-none transition-colors">
                            <i class="fas fa-eye text-lg" id="icono-ojo"></i>
                        </button>
                    </div>
                    <div class="flex flex-wrap items-center gap-2 min-h-[28px] px-1">
                        <i class="fas fa-circle-info text-sm text-blue-500"></i>
                        <p class="text-xl text-slate-600 font-medium" id="password-hint">Mínimo 8 caracteres</p>
                        <p class="text-xl text-red-600 font-medium hidden ml-auto" id="password-error">❌ Muy corta</p>
                        <p class="text-xl text-green-600 font-medium hidden ml-auto" id="password-success">✅ Segura</p>
                    </div>
                </div>

                <div class="py-2 flex justify-center">
                    <div class="g-recaptcha scale-[0.85] transform-gpu" data-sitekey="6Ld9SIEsAAAAAI8w0DE4M_rZGlMsjB5caiJH5wnU" data-callback="onCaptchaSuccess"></div>
                </div>
                <p class="text-sm text-red-600 text-center font-medium hidden" id="captcha-error">⚠️ Por favor verifica que no eres un robot</p>

               
                <button type="submit" id="submitBtn" disabled
                    class="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-extrabold rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all duration-200 opacity-50 cursor-not-allowed text-base tracking-wide hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:hover:scale-100 disabled:hover:shadow-lg">
                    <span>ACCEDER AL SISTEMA</span>
                    <i class="fas fa-arrow-right text-sm"></i>
                </button>

                
                <div class="text-center pt-4">
                    <p class="text-xs text-slate-500 font-medium">© 2024 Corporativo Liz - Todos los derechos reservados</p>
                </div>
            </form>
        </div>
    </div>

    <script>const BASE_URL = "{{ url('') }}";</script>
    <script src="{{ url('js/login.js') }}"></script>
    <script>
        function togglePassword() {
            const input = document.getElementById('password');
            const icono = document.getElementById('icono-ojo');
            if (input.type === 'password') {
                input.type = 'text';
                icono.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                input.type = 'password';
                icono.classList.replace('fa-eye-slash', 'fa-eye');
            }
        }
    </script>
</body>
</html>