<?php
use Phalcon\Di\FactoryDefault;
use Phalcon\Mvc\Application;

// ACTIVAR ERRORES PARA DEBUGGING
error_reporting(E_ALL);
ini_set('display_errors', 1);

define('BASE_PATH', dirname(__DIR__));
define('APP_PATH', BASE_PATH . '/app');
// AGREGA ESTA LÍNEA PARA CARGAR JWT Y OTRAS LIBRERÍAS
include_once BASE_PATH . '/vendor/autoload.php';

try {
    $di = new FactoryDefault();

    $loader = new \Phalcon\Loader();
    $loader->registerDirs([
        APP_PATH . '/controllers/',
        APP_PATH . '/models/'
    ])->register();

    include APP_PATH . '/config/services.php';

    $application = new Application($di);
    
    // Capturamos la URL correctamente
    $url = $_GET['_url'] ?? '/';
    echo $application->handle($url)->getContent();

} catch (\Exception $e) {
   echo "<h1>Error Detectado</h1>";
    echo "<b>Mensaje:</b> " . $e->getMessage() . "<br>";
    echo "<b>Archivo:</b> " . $e->getFile() . " en línea " . $e->getLine();
    exit; // Detenemos todo para leer el error
}