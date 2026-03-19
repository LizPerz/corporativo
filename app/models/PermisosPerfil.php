<?php
use Phalcon\Mvc\Model;

class PermisosPerfil extends Model {
    public $id;
    public $idModulo;
    public $idPerfil;
    public $bitAgregar;
    public $bitEditar;
    public $bitConsulta;
    public $bitEliminar;
    public $bitDetalle;

    public function initialize() {
        $this->setSchema("public");
        $this->setSource("permisos_perfil");
    }

    public function columnMap() {
        return [
            'id'          => 'id',
            'idmodulo'    => 'idModulo',
            'idperfil'    => 'idPerfil',
            'bitagregar'  => 'bitAgregar',
            'biteditar'   => 'bitEditar',
            'bitconsulta' => 'bitConsulta',
            'biteliminar' => 'bitEliminar',
            'bitdetalle'  => 'bitDetalle'
        ];
    }
}