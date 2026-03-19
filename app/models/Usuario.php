<?php
use Phalcon\Mvc\Model;

class Usuario extends Model {
    public $id;
    public $strNombreUsuario;
    public $idPerfil;
    public $strPwd;
    public $idEstadoUsuario;
    public $strCorreo;
    public $strNumeroCelular;
    public $strImagenRuta;

    public function initialize() {
        $this->setSchema("public");
        $this->setSource("usuario");
        $this->belongsTo('idPerfil', 'Perfil', 'id', ['alias' => 'Perfil']);
    }

    public function columnMap() {
        return [
            'id'               => 'id',
            'strnombreusuario' => 'strNombreUsuario',
            'idperfil'         => 'idPerfil',
            'strpwd'           => 'strPwd',
            'idestadousuario'  => 'idEstadoUsuario',
            'strcorreo'        => 'strCorreo',
            'strnumerocelular' => 'strNumeroCelular',
            'strimagenruta'    => 'strImagenRuta'
        ];
    }
}
