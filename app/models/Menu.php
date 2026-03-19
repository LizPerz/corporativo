<?php
use Phalcon\Mvc\Model;

class Menu extends Model {
    public $id;
    public $idMenuPadre;
    public $idModulo;

    public function initialize() {
        $this->setSchema("public");
        $this->setSource("menu");
    }

    public function columnMap() {
        return [
            'id'          => 'id',
            'idmenupadre' => 'idMenuPadre',
            'idmodulo'    => 'idModulo'
        ];
    }
}