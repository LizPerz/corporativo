<?php
use Phalcon\Mvc\Model;

class Perfil extends Model {
    public $id;
    public $strNombrePerfil;
    public $bitAdministrador;

    public function initialize() {
        $this->setSchema("public");
        $this->setSource("perfil");
    }

    public function columnMap() {
        // Los nombres en la BD deben coincidir EXACTAMENTE
        return [
            'id'                 => 'id',
            'strnombreperfil'    => 'strNombrePerfil',  // Así está en la BD
            'bitadministrador'   => 'bitAdministrador'   // Así está en la BD
        ];
    }
}