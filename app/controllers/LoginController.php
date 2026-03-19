<?php
use Phalcon\Mvc\Controller;
use Firebase\JWT\JWT;

class LoginController extends Controller {

    public function indexAction() {
    }

    public function authAction() {
        $this->view->disable(); 
        
        if ($this->request->isPost()) {
            $data = $this->request->getJsonRawBody();
            
            // 1. VALIDAR RECAPTCHA (Se mantiene igual)
            $secretKey = "6Ld9SIEsAAAAAMuvktkKO51sBu4smq2B99JDx6AS";
            $response = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=" . $secretKey . "&response=" . $data->captcha);
            $responseKeys = json_decode($response, true);
            if (!$responseKeys["success"]) {
                return $this->response->setJsonContent(['status' => 'error', 'message' => 'Captcha inválido.']);
            }

            // 2. BUSCAR USUARIO ACTIVO
            $usuario = Usuario::findFirst([
                'conditions' => 'strNombreUsuario = :user: AND idEstadoUsuario = 1',
                'bind'       => ['user' => $data->usuario]
            ]);

            // 3. MAGIA SENIOR: Validar Hash Bcrypt O Texto Plano (Transición)
            if ($usuario && (password_verify($data->password, $usuario->strPwd) || $data->password === $usuario->strPwd)) {
                
                // 4. OBTENER PERMISOS COMPLETOS (Agregar, Editar, Eliminar)
                $modulos = $this->modelsManager->createBuilder()
                    ->from(['pp' => 'PermisosPerfil'])
                    ->join('Modulo', 'm.id = pp.idModulo', 'm')
                    ->where('pp.idPerfil = :perfil: AND pp.bitConsulta = TRUE', ['perfil' => $usuario->idPerfil])
                    ->columns(['m.strNombreModulo', 'pp.bitAgregar', 'pp.bitEditar', 'pp.bitEliminar', 'pp.bitConsulta', 'pp.bitDetalle'])
                    ->getQuery()
                    ->execute()->toArray();

                foreach($modulos as &$mod) {
                    $mod['bitAgregar'] = ($mod['bitAgregar'] == 1 || $mod['bitAgregar'] === true || $mod['bitAgregar'] === 't');
                    $mod['bitEditar']  = ($mod['bitEditar'] == 1  || $mod['bitEditar'] === true  || $mod['bitEditar'] === 't');
                    $mod['bitEliminar']= ($mod['bitEliminar'] == 1|| $mod['bitEliminar'] === true|| $mod['bitEliminar'] === 't');
                    $mod['bitConsulta']= ($mod['bitConsulta'] == 1|| $mod['bitConsulta'] === true|| $mod['bitConsulta'] === 't');
                    $mod['bitDetalle'] = ($mod['bitDetalle'] == 1 || $mod['bitDetalle'] === true || $mod['bitDetalle'] === 't');
                }

                // 5. GENERAR TOKEN JWT (Se mantiene igual)
                $key = "CLAVE_MAESTRA_CORPORATIVO_2026";
                $payload = [
                    'iat' => time(),
                    'exp' => time() + (60 * 60 * 8),
                    'sub' => $usuario->id,
                    'perfil' => $usuario->idPerfil
                ];
                $token = \Firebase\JWT\JWT::encode($payload, $key, 'HS256');

                return $this->response->setJsonContent([
                    'status'   => 'success',
                    'token'    => $token,
                    'usuario'  => $usuario->strNombreUsuario,
                    'modulos'  => $modulos, 
                    'redirect' => $this->url->get('principal/index')
                ]);

            } else {
                return $this->response->setJsonContent(['status' => 'error', 'message' => 'Credenciales incorrectas o usuario inactivo.']);
            }
        }
    }
}