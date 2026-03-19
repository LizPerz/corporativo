<?php
use Phalcon\Mvc\Model;

class Modulo extends Model {
    public $id;
    public $strNombreModulo;

    public function initialize() {
        $this->setSchema("public");
        $this->setSource("modulo");
    }

    public function columnMap() {
        return [
            'id'              => 'id',
            'strnombremodulo' => 'strNombreModulo'
        ];
    }
}