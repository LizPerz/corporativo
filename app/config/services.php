<?php

use Phalcon\Mvc\View;
use Phalcon\Mvc\View\Engine\Php as PhpEngine;
use Phalcon\Mvc\Url as UrlResolver;
use Phalcon\Mvc\View\Engine\Volt as VoltEngine;
use Phalcon\Mvc\Model\Metadata\Memory as MetaDataAdapter;
use Phalcon\Session\Adapter\Files as SessionAdapter;
use Phalcon\Flash\Direct as Flash;
use Phalcon\Mvc\Dispatcher;
use Phalcon\Events\Manager as EventsManager;
use Phalcon\Security;

/**
 * Servicio de configuración compartido
 */
$di->setShared('config', function () {
    return include APP_PATH . "/config/config.php";
});

/**
 * El componente URL se utiliza para generar todo tipo de URLs en la aplicación
 */
$di->setShared('url', function () {
    $config = $this->getConfig();

    $url = new UrlResolver();
    $url->setBaseUri($config->application->baseUri);

    return $url;
});

/**
 * Configuración del componente de vista y el motor Volt
 */
$di->setShared('view', function () {
    $config = $this->getConfig();

    $view = new View();
    $view->setDI($this);
    $view->setViewsDir($config->application->viewsDir);

    $view->registerEngines([
        '.volt' => function ($view) {
            $config = $this->getConfig();

            $volt = new VoltEngine($view, $this);

            $volt->setOptions([
                'compiledPath' => $config->application->cacheDir,
                'compiledSeparator' => '_'
            ]);

            return $volt;
        },
        '.phtml' => PhpEngine::class
    ]);

    return $view;
});

/**
 * Conexión a la base de datos PostgreSQL
 */
$di->setShared('db', function () {
    $config = $this->getConfig();
    $class = 'Phalcon\Db\Adapter\Pdo\\' . $config->database->adapter;
    
    return new $class([
        'host'     => $config->database->host,
        'port'     => $config->database->port,
        'username' => $config->database->username,
        'password' => $config->database->password,
        'dbname'   => $config->database->dbname,
    ]);
});

/**
 * IMPORTAR EL PLUGIN Y CONFIGURAR EL DISPATCHER DEFINITIVO (CADENERO DE SEGURIDAD)
 */
require_once APP_PATH . '/plugins/SecurityPlugin.php';

$di->setShared('dispatcher', function () {
    $eventsManager = new EventsManager();

    // Le decimos al EventManager que escuche ANTES de ejecutar cualquier ruta
    $eventsManager->attach(
        'dispatch:beforeExecuteRoute',
        new SecurityPlugin()
    );

    $dispatcher = new Dispatcher();
    $dispatcher->setEventsManager($eventsManager);

    return $dispatcher;
});

/**
 * Servicio de Seguridad para manejo de contraseñas hash
 */
$di->setShared('security', function () {
    $security = new Security();
    $security->setWorkFactor(12);
    return $security;
});

/**
 * Adaptador de metadatos de modelos en memoria
 */
$di->setShared('modelsMetadata', function () {
    return new MetaDataAdapter();
});

/**
 * Servicio Flash para mensajes de éxito/error
 */
$di->set('flash', function () {
    $flash = new Flash();
    $flash->setCssClasses([
        'error'   => 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative',
        'success' => 'bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative',
        'notice'  => 'bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative',
        'warning' => 'bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative'
    ]);

    return $flash;
});

/**
 * Inicio de sesión de usuario
 */
$di->setShared('session', function () {
    $session = new \Phalcon\Session\Adapter\Files();
    $session->start();

    return $session;
});