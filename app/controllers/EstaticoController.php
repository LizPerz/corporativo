<?php
use Phalcon\Mvc\Controller;

class EstaticoController extends Controller {
    
    public function indexAction() {
        $this->view->setRenderLevel(\Phalcon\Mvc\View::LEVEL_ACTION_VIEW);
    }

    public function listarAction() {
        $this->view->disable();
        $productos = [
            ['id' => 1, 'nombre' => 'Laptop HP ProBook', 'categoria' => 'Electrónica', 'precio' => 15000, 'stock' => 15],
            ['id' => 2, 'nombre' => 'Mouse Inalámbrico Logitech', 'categoria' => 'Accesorios', 'precio' => 450, 'stock' => 50],
            ['id' => 3, 'nombre' => 'Teclado Mecánico Razer', 'categoria' => 'Accesorios', 'precio' => 2100, 'stock' => 22],
            ['id' => 4, 'nombre' => 'Monitor Dell 27"', 'categoria' => 'Electrónica', 'precio' => 6500, 'stock' => 8],
            ['id' => 5, 'nombre' => 'Silla Ergonómica Herman', 'categoria' => 'Mobiliario', 'precio' => 25000, 'stock' => 3],
            ['id' => 6, 'nombre' => 'Cable HDMI 2.0 (2m)', 'categoria' => 'Accesorios', 'precio' => 150, 'stock' => 100],
            ['id' => 7, 'nombre' => 'Disco Duro Externo 2TB', 'categoria' => 'Almacenamiento', 'precio' => 1800, 'stock' => 30],
            ['id' => 8, 'nombre' => 'Memoria RAM 16GB Corsair', 'categoria' => 'Componentes', 'precio' => 1200, 'stock' => 40],
            ['id' => 9, 'nombre' => 'Webcam Full HD 1080p', 'categoria' => 'Accesorios', 'precio' => 890, 'stock' => 18],
            ['id' => 10, 'nombre' => 'Impresora Epson', 'categoria' => 'Electrónica', 'precio' => 4200, 'stock' => 12],
            ['id' => 11, 'nombre' => 'Escritorio Ajustable', 'categoria' => 'Mobiliario', 'precio' => 8500, 'stock' => 5],
            ['id' => 12, 'nombre' => 'Audífonos Sony', 'categoria' => 'Electrónica', 'precio' => 5400, 'stock' => 25],
            ['id' => 13, 'nombre' => 'Hub USB-C 7 en 1', 'categoria' => 'Accesorios', 'precio' => 650, 'stock' => 45],
            ['id' => 14, 'nombre' => 'Tarjeta Gráfica RTX 4060', 'categoria' => 'Componentes', 'precio' => 8500, 'stock' => 7],
            ['id' => 15, 'nombre' => 'Gabinete ATX Cristal', 'categoria' => 'Componentes', 'precio' => 1600, 'stock' => 14]
        ];
        return $this->response->setJsonContent(['status' => 'success', 'data' => $productos]);
    }

    public function guardarAction() {
        $this->view->disable();
        if ($this->request->isPost() || $this->request->isPut()) {
            return $this->response->setJsonContent([
                'status' => 'success', 
                'nuevo_id' => rand(100, 999) 
            ]);
        }
    }

    public function eliminarAction($id) {
        $this->view->disable();
        if ($this->request->isDelete()) {
            return $this->response->setJsonContent(['status' => 'success']);
        }
    }
}