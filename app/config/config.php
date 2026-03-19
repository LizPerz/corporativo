<?php
defined('BASE_PATH') || define('BASE_PATH', realpath(dirname(__FILE__) . '/../..'));
defined('APP_PATH') || define('APP_PATH', BASE_PATH . '/app');

return new \Phalcon\Config([
    'database' => [
        'adapter'     => 'Postgresql', 
        'host'        => 'dpg-d6jgj57tskes738n02e0-a.virginia-postgres.render.com',
        'username'    => 'lizeth',
        'password'    => 'CksajkvkJsNcCKWuLnh4YB4HZgk61Qbn',
        'dbname'      => 'corporativo_wuph',
        'port'        => 5432,
    ],
    'application' => [
        'appDir'         => APP_PATH . '/',
        'controllersDir' => APP_PATH . '/controllers/',
        'modelsDir'      => APP_PATH . '/models/',
        'viewsDir'       => APP_PATH . '/views/',
        'cacheDir'       => BASE_PATH . '/cache/',
        'baseUri'        => $_SERVER['HTTP_HOST'] === 'localhost' ? '/corporativo/' : '/',
    ]
]);


