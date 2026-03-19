<?php
use Phalcon\Mvc\Controller;

class ModuloController extends Controller {

    public function indexAction() {
        $this->view->setRenderLevel(\Phalcon\Mvc\View::LEVEL_ACTION_VIEW);
    }

    public function listarAction() {
        $this->view->disable();
        
        try {
            $modulos = Modulo::find([
                'order' => 'id DESC'
            ]);
            
            $data = [];
            foreach ($modulos as $modulo) {
                $data[] = [
                    'id' => $modulo->id,
                    'strNombreModulo' => $modulo->strNombreModulo
                ];
            }
            
            return $this->response->setJsonContent([
                'status' => 'success', 
                'data' => $data
            ]);
            
        } catch (\Exception $e) {
            return $this->response->setJsonContent([
                'status' => 'error', 
                'message' => $e->getMessage()
            ]);
        }
    }

    public function guardarAction() {
        $this->view->disable();
        
        try {
            if ($this->request->isPost() || $this->request->isPut()) {
                $data = $this->request->getJsonRawBody();
                
                if (empty($data->strNombreModulo)) {
                    return $this->response->setJsonContent([
                        'status' => 'error', 
                        'message' => 'El nombre del módulo es obligatorio.'
                    ]);
                }

                if (!empty($data->id)) {
                    $modulo = Modulo::findFirst($data->id);
                    if (!$modulo) {
                        return $this->response->setJsonContent([
                            'status' => 'error', 
                            'message' => 'Módulo no encontrado.'
                        ]);
                    }
                    $mensaje = "Módulo actualizado correctamente.";
                } else {
                    $modulo = new Modulo();
                    $mensaje = "Módulo creado correctamente.";
                }

                $modulo->strNombreModulo = strtoupper(trim($data->strNombreModulo));

                if ($modulo->save()) {
                    return $this->response->setJsonContent([
                        'status' => 'success', 
                        'message' => $mensaje
                    ]);
                } else {
                    $errores = [];
                    foreach ($modulo->getMessages() as $message) {
                        $errores[] = $message->getMessage();
                    }
                    return $this->response->setJsonContent([
                        'status' => 'error', 
                        'message' => implode(", ", $errores)
                    ]);
                }
            }
        } catch (\Exception $e) {
            return $this->response->setJsonContent([
                'status' => 'error', 
                'message' => $e->getMessage()
            ]);
        }
    }

    public function eliminarAction($id) {
        $this->view->disable();
        
        try {
            if ($this->request->isDelete()) {
                $modulo = Modulo::findFirst($id);
                if ($modulo && $modulo->delete()) {
                    return $this->response->setJsonContent([
                        'status' => 'success', 
                        'message' => 'Módulo eliminado.'
                    ]);
                }
                return $this->response->setJsonContent([
                    'status' => 'error', 
                    'message' => 'No se pudo eliminar el módulo.'
                ]);
            }
        } catch (\Exception $e) {
            return $this->response->setJsonContent([
                'status' => 'error', 
                'message' => $e->getMessage()
            ]);
        }
    }
}