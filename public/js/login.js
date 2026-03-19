let captchaResuelto = false;

document.addEventListener('DOMContentLoaded', () => {
    const usuario = document.getElementById('usuario');
    const password = document.getElementById('password');
    
    usuario.addEventListener('input', validarUsuario);
    usuario.addEventListener('keydown', prevenirEspacios);
    usuario.addEventListener('blur', () => {
        if (usuario.value.length > 0 && usuario.value.length < 3) {
            document.getElementById('usuario-error').classList.remove('hidden');
        }
    });
    
    password.addEventListener('input', validarPassword);
    password.addEventListener('keydown', prevenirEspacios);
    password.addEventListener('blur', () => {
        if (password.value.length > 0 && password.value.length < 8) {
            document.getElementById('password-error').classList.remove('hidden');
        }
    });
    
    validarFormularioCompleto();
});

function prevenirEspacios(e) {
    if (e.key === ' ') {
        e.preventDefault();
        const input = e.target;
        input.classList.add('border-red-500', 'ring-4', 'ring-red-500/10');
        setTimeout(() => {
            input.classList.remove('border-red-500', 'ring-4', 'ring-red-500/10');
            if (input.value.length >= (input.id === 'usuario' ? 3 : 6)) {
                input.classList.add('border-green-500');
            }
        }, 300);
    }
}

function validarUsuario() {
    const input = document.getElementById('usuario');
    const error = document.getElementById('usuario-error');
    const success = document.getElementById('usuario-success');
    const hint = document.getElementById('usuario-hint');
    const valor = input.value;
    
    const sinEspacios = valor.replace(/\s/g, '');
    if (valor !== sinEspacios) {
        input.value = sinEspacios;
    }
    
    if (valor.length === 0) {
        error.classList.add('hidden');
        success.classList.add('hidden');
        hint.classList.remove('hidden');
        input.classList.remove('border-green-500', 'border-red-500');
        input.classList.add('border-slate-200');
    } else if (valor.length >= 3 && /^[a-zA-Z0-9_]+$/.test(valor)) {
        error.classList.add('hidden');
        success.classList.remove('hidden');
        hint.classList.add('hidden');
        input.classList.remove('border-slate-200', 'border-red-500');
        input.classList.add('border-green-500');
    } else {
        error.classList.remove('hidden');
        success.classList.add('hidden');
        hint.classList.add('hidden');
        input.classList.remove('border-slate-200', 'border-green-500');
        input.classList.add('border-red-500');
    }
    
    validarFormularioCompleto();
}

function validarPassword() {
    const input = document.getElementById('password');
    const error = document.getElementById('password-error');
    const success = document.getElementById('password-success');
    const hint = document.getElementById('password-hint');
    const valor = input.value;
    
    const sinEspacios = valor.replace(/\s/g, '');
    if (valor !== sinEspacios) {
        input.value = sinEspacios;
    }
    
    if (valor.length === 0) {
        error.classList.add('hidden');
        success.classList.add('hidden');
        hint.classList.remove('hidden');
        input.classList.remove('border-green-500', 'border-red-500');
        input.classList.add('border-slate-200');
    } else if (valor.length >= 8) {
        error.classList.add('hidden');
        success.classList.remove('hidden');
        hint.classList.add('hidden');
        input.classList.remove('border-slate-200', 'border-red-500');
        input.classList.add('border-green-500');
    } else {
        error.classList.remove('hidden');
        success.classList.add('hidden');
        hint.classList.add('hidden');
        input.classList.remove('border-slate-200', 'border-green-500');
        input.classList.add('border-red-500');
    }
    
    validarFormularioCompleto();
}

function onCaptchaSuccess() {
    captchaResuelto = true;
    document.getElementById('captcha-error').classList.add('hidden');
    validarFormularioCompleto();
}

window.onCaptchaSuccess = onCaptchaSuccess;

function validarFormularioCompleto() {
    const usuario = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;
    
    const usuarioValido = usuario.length >= 3 && /^[a-zA-Z0-9_]+$/.test(usuario);
    const passwordValido = password.length >= 6;
    const submitBtn = document.getElementById('submitBtn');
    
    if (usuarioValido && passwordValido && captchaResuelto) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        submitBtn.classList.add('hover:from-blue-600', 'hover:to-indigo-700', 'hover:scale-[1.01]', 'active:scale-[0.99]');
    } else {
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
        submitBtn.classList.remove('hover:from-blue-600', 'hover:to-indigo-700', 'hover:scale-[1.01]', 'active:scale-[0.99]');
    }
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!captchaResuelto) {
        document.getElementById('captcha-error').classList.remove('hidden');
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin mr-2 text-base"></i> VERIFICANDO...';
    submitBtn.disabled = true;

    const datos = {
        usuario: document.getElementById('usuario').value,
        password: document.getElementById('password').value,
        captcha: grecaptcha.getResponse()
    };

    try {
        const response = await fetch(`${BASE_URL}login/auth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        const resultado = await response.json();

        if (resultado.status === 'success') {
            localStorage.setItem('token_corporativo', resultado.token);
            localStorage.setItem('usuario_nombre', resultado.usuario);
            localStorage.setItem('modulos_permitidos', JSON.stringify(resultado.modulos));
            
            submitBtn.innerHTML = '<i class="fas fa-check-circle mr-2 text-base"></i> ¡ACCESO CONCEDIDO!';
            submitBtn.classList.remove('from-blue-500', 'to-indigo-600');
            submitBtn.classList.add('from-green-500', 'to-green-600');
            
            setTimeout(() => {
                window.location.href = `${BASE_URL}principal/index`;
            }, 800);
        } else {
            mostrarError('Error de autenticación', resultado.message || 'Credenciales incorrectas');
            grecaptcha.reset();
            captchaResuelto = false;
            submitBtn.innerHTML = originalText;
            validarFormularioCompleto();
        }
    } catch (error) {
        console.error(error);
        mostrarError('Error de conexión', 'No se pudo conectar con el servidor. Verifica tu conexión.');
        submitBtn.innerHTML = originalText;
        validarFormularioCompleto();
    }
});

function mostrarError(titulo, mensaje) {
    const modalHtml = `
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onclick="if(event.target===this)cerrarModal()">
            <div class="bg-white rounded-2xl max-w-md w-full p-8 transform animate-slideUp">
                <div class="text-center">
                    <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i class="fas fa-exclamation text-4xl text-red-600"></i>
                    </div>
                    <h3 class="text-2xl font-extrabold text-slate-800 mb-3">${titulo}</h3>
                    <p class="text-slate-600 text-base mb-8">${mensaje}</p>
                    <button onclick="cerrarModal()" class="w-full py-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl font-bold text-base hover:from-slate-900 hover:to-black transition-all">
                        ENTENDIDO
                    </button>
                </div>
            </div>
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp {
            animation: slideUp 0.3s ease-out;
        }
    `;
    document.head.appendChild(style);
    
    const modal = document.createElement('div');
    modal.id = 'modal-error';
    modal.innerHTML = modalHtml;
    document.body.appendChild(modal);
}

window.cerrarModal = function() {
    const modal = document.getElementById('modal-error');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => modal.remove(), 300);
    }
}