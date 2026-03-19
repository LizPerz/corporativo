<?php
use Phalcon\Events\Event;
use Phalcon\Mvc\Dispatcher;
use Phalcon\Di\Injectable; // <-- Cambiamos Plugin por Injectable
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class SecurityPlugin extends Injectable {

    public function beforeExecuteRoute(Event $event, Dispatcher $dispatcher) {
        $controller = $dispatcher->getControllerName();
        $action = $dispatcher->getActionName();

        // 1. PASO LIBRE PARA CORS (Peticiones OPTIONS del navegador)
        $request = $this->getDI()->getShared('request');
        if ($request->getMethod() == 'OPTIONS') {
            return true;
        }

        // 2. LISTA BLANCA
        $rutasPublicas = [
            'index' => ['index'], // <--- ¡AÑADE ESTA LÍNEA!
            'login' => ['index', 'auth'],
            'principal' => ['index'] 
        ];

        if (isset($rutasPublicas[$controller]) && in_array($action, $rutasPublicas[$controller])) {
            return true;
        }

        // 3. CAZAR EL TOKEN POR TODOS LOS MEDIOS POSIBLES
        $authHeader = $request->getHeader('Authorization');
        
        // Si Apache lo sigue escondiendo, usamos la función nativa de Apache
        if (empty($authHeader) && function_exists('apache_request_headers')) {
            $headers = apache_request_headers();
            $authHeader = $headers['Authorization'] ?? null;
        }
        
        // El último recurso
        if (empty($authHeader)) {
            $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? null;
        }

        if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $this->rechazarPeticion('Acceso denegado: Token de seguridad no proporcionado o inválido.');
            return false;
        }

        $token = $matches[1];

        // 4. VALIDAR FIRMA
        try {
            $key = "CLAVE_MAESTRA_CORPORATIVO_2026"; 
            $decoded = JWT::decode($token, new Key($key, 'HS256'));
            return true; 

        } catch (\Throwable $e) {
            $this->rechazarPeticion('Token expirado o alterado: ' . $e->getMessage());
            return false;
        }
    }

    private function rechazarPeticion($mensaje) {
        // Llamamos explícitamente al DI para que VS Code (Intelephense) no marque error rojo
        $response = $this->getDI()->getShared('response');
        $view = $this->getDI()->getShared('view');

        $view->disable();
        if (ob_get_length()) { ob_clean(); }

        $response->setStatusCode(401, 'Unauthorized');
        $response->setContentType('application/json', 'UTF-8');
        $response->setJsonContent([
            'status' => 'error',
            'message' => $mensaje
        ]);
        
        $response->send();
        exit; 
    }
}