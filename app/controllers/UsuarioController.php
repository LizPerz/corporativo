 <?php
use Phalcon\Mvc\Controller;

class UsuarioController extends Controller {

    public function indexAction() {
        $this->view->setRenderLevel(\Phalcon\Mvc\View::LEVEL_ACTION_VIEW);
    }

    public function listarAction() {
        $this->view->disable();
        
        try {
            $usuarios = $this->modelsManager->createBuilder()
                ->from(['u' => 'Usuario'])
                ->join('Perfil', 'p.id = u.idPerfil', 'p')
                ->columns([
                    'u.id', 'u.strNombreUsuario', 'u.strCorreo', 
                    'u.strNumeroCelular', 'u.strImagenRuta', 
                    'u.idEstadoUsuario', 'u.idPerfil', 'p.strNombrePerfil'
                ])
                ->orderBy('u.id DESC')
                ->getQuery()
                ->execute();

            $data = $usuarios->toArray();
            if (ob_get_length()) { ob_clean(); }
            return $this->response->setJsonContent(['status' => 'success', 'data' => $data]);
            
        } catch (\Throwable $e) {
            if (ob_get_length()) { ob_clean(); }
            return $this->response->setJsonContent(['status' => 'error', 'message' => 'Error PHP: ' . $e->getMessage()]);
        }
    }

    public function guardarAction() {
        $this->view->disable();
        
        try {
            if ($this->request->isPost()) {
                
                $id = $this->request->getPost('id');
                $strNombreUsuario = $this->request->getPost('strNombreUsuario');
                $strPwd = $this->request->getPost('strPwd');
                $strCorreo = $this->request->getPost('strCorreo');
                $strNumeroCelular = $this->request->getPost('strNumeroCelular');
                $idPerfil = $this->request->getPost('idPerfil');
                $idEstadoUsuario = $this->request->getPost('idEstadoUsuario');

                if (empty($strNombreUsuario) || empty($idPerfil)) {
                    if (ob_get_length()) { ob_clean(); }
                    return $this->response->setJsonContent(['status' => 'error', 'message' => 'El nombre y el perfil son obligatorios.']);
                }

                if (!empty($id)) {
                    $usuario = Usuario::findFirst($id);
                    if (!$usuario) {
                        if (ob_get_length()) { ob_clean(); }
                        return $this->response->setJsonContent(['status' => 'error', 'message' => 'Usuario no encontrado.']);
                    }
                    $mensaje = "Usuario actualizado exitosamente.";

                    if (!empty($strPwd)) {   $usuario->strPwd = password_hash($strPwd, PASSWORD_BCRYPT);  }
                } else {
                    $usuario = new Usuario();
                    $mensaje = "Usuario creado exitosamente.";
                    if (empty($strPwd)) {
                        if (ob_get_length()) { ob_clean(); }
                        return $this->response->setJsonContent(['status' => 'error', 'message' => 'La contraseña es obligatoria.']);
                    }
                    $usuario->strPwd = password_hash($strPwd, PASSWORD_BCRYPT);
                }

                $usuario->strNombreUsuario = trim($strNombreUsuario);
                $usuario->strCorreo = trim($strCorreo);
                $usuario->strNumeroCelular = trim($strNumeroCelular);
                $usuario->idPerfil = $idPerfil;
                $usuario->idEstadoUsuario = $idEstadoUsuario ? 1 : 0;

                if ($this->request->hasFiles() == true) {
                    $uploads = $this->request->getUploadedFiles();
                    foreach ($uploads as $upload) {
                        if ($upload->getSize() > 0 && $upload->getKey() == 'foto') {
                            $path = 'uploads/usuarios/';
                            
                            if (!is_dir($path)) {
                                mkdir($path, 0777, true);
                            }
                            
                            $fileName = time() . '-' . strtolower(str_replace(' ', '-', $upload->getName()));
                            
                            if ($upload->moveTo($path . $fileName)) {
                                $usuario->strImagenRuta = $fileName;
                            }
                        }
                    }
                }

                if ($usuario->save()) {
                    if (ob_get_length()) { ob_clean(); }
                    return $this->response->setJsonContent(['status' => 'success', 'message' => $mensaje]);
                } else {
                    $errores = [];
                    foreach ($usuario->getMessages() as $message) { $errores[] = $message->getMessage(); }
                    if (ob_get_length()) { ob_clean(); }
                    return $this->response->setJsonContent(['status' => 'error', 'message' => implode(", ", $errores)]);
                }
            }
        } catch (\Throwable $e) {
            if (ob_get_length()) { ob_clean(); }
            return $this->response->setJsonContent(['status' => 'error', 'message' => 'Error PHP: ' . $e->getMessage()]);
        }
    }

    public function eliminarAction($id) {
        $this->view->disable();
        try {
            if ($this->request->isDelete()) {
                $usuario = Usuario::findFirst($id);
                if ($usuario && $usuario->delete()) {
                    if (ob_get_length()) { ob_clean(); }
                    return $this->response->setJsonContent(['status' => 'success', 'message' => 'Usuario eliminado correctamente.']);
                }
                if (ob_get_length()) { ob_clean(); }
                return $this->response->setJsonContent(['status' => 'error', 'message' => 'No se pudo eliminar el usuario.']);
            }
        } catch (\Throwable $e) {
            if (ob_get_length()) { ob_clean(); }
            return $this->response->setJsonContent(['status' => 'error', 'message' => 'Error PHP: ' . $e->getMessage()]);
        }
    }
}
