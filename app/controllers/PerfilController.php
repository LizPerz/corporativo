<?php
use Phalcon\Mvc\Controller;

class PerfilController extends Controller {

    public function indexAction() {
        $this->view->setRenderLevel(\Phalcon\Mvc\View::LEVEL_ACTION_VIEW);
    }

    public function listarAction() {
        $this->view->disable();
        
        try {
            $perfiles = $this->modelsManager->createBuilder()
                ->from('Perfil')
                ->columns([
                    'id',
                    'strNombrePerfil',
                    'bitAdministrador'
                ])
                ->orderBy('id DESC')
                ->getQuery()
                ->execute();

            $data = $perfiles->toArray();

            foreach ($data as &$p) {
                $p['bitAdministrador'] = ($p['bitAdministrador'] == 1 || $p['bitAdministrador'] === true || $p['bitAdministrador'] === 't' || $p['bitAdministrador'] === 'true');
            }

            if (ob_get_length()) { ob_clean(); }

            return $this->response->setJsonContent([
                'status' => 'success', 
                'data' => $data
            ]);
            
        } catch (\Throwable $e) {
            if (ob_get_length()) { ob_clean(); }
            return $this->response->setJsonContent([
                'status' => 'error', 
                'message' => 'Error PHP: ' . $e->getMessage()
            ]);
        }
    }

    public function guardarAction() {
        $this->view->disable();
        
        try {
            if ($this->request->isPost() || $this->request->isPut()) {
                $data = $this->request->getJsonRawBody();
                
                if (empty($data->strNombrePerfil)) {
                    if (ob_get_length()) { ob_clean(); }
                    return $this->response->setJsonContent([
                        'status' => 'error', 
                        'message' => 'El nombre del perfil es obligatorio.'
                    ]);
                }

                $nombre = strtoupper(trim($data->strNombrePerfil));
                $admin = ($data->bitAdministrador == 1 || $data->bitAdministrador === true) ? 'true' : 'false';

                if (!empty($data->id)) {
                    $sql = "UPDATE perfil SET strnombreperfil = ?, bitadministrador = ? WHERE id = ?";
                    $this->db->execute($sql, [$nombre, $admin, $data->id]);
                    $mensaje = "Perfil actualizado correctamente.";
                } else {
                    $sql = "INSERT INTO perfil (strnombreperfil, bitadministrador) VALUES (?, ?)";
                    $this->db->execute($sql, [$nombre, $admin]);
                    $mensaje = "Perfil creado correctamente.";
                }

                if (ob_get_length()) { ob_clean(); }
                return $this->response->setJsonContent([
                    'status' => 'success', 
                    'message' => $mensaje
                ]);
            }
        } catch (\Throwable $e) {
            if (ob_get_length()) { ob_clean(); }
            return $this->response->setJsonContent([
                'status' => 'error', 
                'message' => 'Error PHP: ' . $e->getMessage()
            ]);
        }
    }

    public function eliminarAction($id) {
        $this->view->disable();
        
        try {
            if ($this->request->isDelete()) {
                $sql = "DELETE FROM perfil WHERE id = ?";
                $this->db->execute($sql, [$id]);
                
                if (ob_get_length()) { ob_clean(); }
                return $this->response->setJsonContent([
                    'status' => 'success', 
                    'message' => 'Perfil eliminado.'
                ]);
            }
        } catch (\Throwable $e) {
            if (ob_get_length()) { ob_clean(); }
            return $this->response->setJsonContent([
                'status' => 'error', 
                'message' => 'Error PHP: ' . $e->getMessage()
            ]);
        }
    }
}