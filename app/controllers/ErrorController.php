<?php
use Phalcon\Mvc\Controller;

class ErrorController extends Controller {
    public function error404Action() {
        $this->view->setRenderLevel(\Phalcon\Mvc\View::LEVEL_ACTION_VIEW);
    }

    public function error500Action() {
        $this->view->setRenderLevel(\Phalcon\Mvc\View::LEVEL_ACTION_VIEW);
    }
}