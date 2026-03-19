<?php
use Phalcon\Mvc\Controller;

class PermisosPerfilController extends Controller {

    public function indexAction() {
        $this->view->setRenderLevel(\Phalcon\Mvc\View::LEVEL_ACTION_VIEW);
    }

    public function cargarDataAction($idPerfil) {
        $this->view->disable();
        
        try {
            $modulos = Modulo::find(['order' => 'strNombreModulo ASC']);
            $permisos = PermisosPerfil::find([
                'conditions' => 'idPerfil = :perfil:',
                'bind'       => ['perfil' => $idPerfil]
            ]);

            $matriz = [];
            $permisosIndexados = [];
            foreach ($permisos as $perm) {
                $permisosIndexados[$perm->idModulo] = $perm;
            }

            foreach ($modulos as $mod) {
                $perm = $permisosIndexados[$mod->id] ?? null;
                $matriz[] = [
                    'idModulo' => (int)$mod->id,
                    'nombreModulo' => $mod->strNombreModulo,
                    'bitConsulta' => $perm && $perm->bitConsulta ? true : false,
                    'bitAgregar' => $perm && $perm->bitAgregar ? true : false,
                    'bitEditar' => $perm && $perm->bitEditar ? true : false,
                    'bitEliminar' => $perm && $perm->bitEliminar ? true : false,
                    'bitDetalle' => $perm && $perm->bitDetalle ? true : false
                ];
            }

            return $this->response->setJsonContent([
                'status' => 'success', 
                'data' => $matriz
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
            $data = $this->request->getJsonRawBody();
            $idPerfil = $data->idPerfil ?? null;
            $matriz = $data->matriz ?? null;

            if (empty($idPerfil) || empty($matriz)) {
                return $this->response->setJsonContent(['status' => 'error', 'message' => 'Faltan datos']);
            }

            $this->db->begin();

            foreach ($matriz as $fila) {
                $permiso = PermisosPerfil::findFirst([
                    'conditions' => 'idPerfil = :perfil: AND idModulo = :modulo:',
                    'bind'       => ['perfil' => $idPerfil, 'modulo' => $fila->idModulo]
                ]);

                if (!$permiso) {
                    $permiso = new PermisosPerfil();
                    $permiso->idPerfil = $idPerfil;
                    $permiso->idModulo = $fila->idModulo;
                }

                $permiso->bitConsulta = $fila->bitConsulta ? 'TRUE' : 'FALSE';
                $permiso->bitAgregar  = $fila->bitAgregar ? 'TRUE' : 'FALSE';
                $permiso->bitEditar   = $fila->bitEditar ? 'TRUE' : 'FALSE';
                $permiso->bitEliminar = $fila->bitEliminar ? 'TRUE' : 'FALSE';
                $permiso->bitDetalle  = $fila->bitDetalle ? 'TRUE' : 'FALSE';
                
                if (!$permiso->save()) {
                    $this->db->rollback();
                    return $this->response->setJsonContent(['status' => 'error', 'message' => 'Error al guardar']);
                }
            }

            $this->db->commit();
            return $this->response->setJsonContent(['status' => 'success']);
            
        } catch (\Exception $e) {
            if ($this->db->isUnderTransaction()) { $this->db->rollback(); }
            return $this->response->setJsonContent([
                'status' => 'error', 
                'message' => $e->getMessage()
            ]);
        }
    }
}



/*use Phalcon\Mvc\Controller;

class PermisosPerfilController extends Controller {

    public function indexAction() {
        $this->view->setRenderLevel(\Phalcon\Mvc\View::LEVEL_ACTION_VIEW);
    }

    public function cargarDataAction($idPerfil) {
        $this->view->disable();
        
        try {
            $modulos = Modulo::find(['order' => 'strNombreModulo ASC']);
            $permisos = PermisosPerfil::find([
                'conditions' => 'idPerfil = :perfil:',
                'bind'       => ['perfil' => $idPerfil]
            ]);

            $matriz = [];
            $permisosIndexados = [];
            foreach ($permisos as $perm) {
                $permisosIndexados[$perm->idModulo] = $perm;
            }

            foreach ($modulos as $mod) {
                $perm = $permisosIndexados[$mod->id] ?? null;
                $matriz[] = [
                    'idModulo' => (int)$mod->id,
                    'nombreModulo' => $mod->strNombreModulo,
                    'bitConsulta' => $perm && $perm->bitConsulta ? true : false,
                    'bitAgregar' => $perm && $perm->bitAgregar ? true : false,
                    'bitEditar' => $perm && $perm->bitEditar ? true : false,
                    'bitEliminar' => $perm && $perm->bitEliminar ? true : false,
                    'bitDetalle' => $perm && $perm->bitDetalle ? true : false
                ];
            }

            return $this->response->setJsonContent([
                'status' => 'success', 
                'data' => $matriz
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
            $data = $this->request->getJsonRawBody();
            
            $permiso = PermisosPerfil::findFirst([
                'conditions' => 'idPerfil = :perfil: AND idModulo = :modulo:',
                'bind'       => ['perfil' => $data->idPerfil, 'modulo' => $data->idModulo]
            ]);

            if (!$permiso) {
                $permiso = new PermisosPerfil();
                $permiso->idPerfil = $data->idPerfil;
                $permiso->idModulo = $data->idModulo;
            }

            $campo = $data->campo;
            $permiso->$campo = $data->valor ? 'TRUE' : 'FALSE';
            $permiso->save();

            return $this->response->setJsonContent(['status' => 'success']);
            
        } catch (\Exception $e) {
            return $this->response->setJsonContent([
                'status' => 'error', 
                'message' => $e->getMessage()
            ]);
        }
    }
}*/