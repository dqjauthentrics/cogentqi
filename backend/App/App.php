<?php

namespace App;

use App\Components\ConfigSettings;

class App {
    public static $config = null;

    public static function config() {
        if (empty(App::$config)) {
            $rec = new ConfigSettings();
            App::$config = $rec->config;
        }
        return App::$config;
    }

    public static function configSetting($settingName) {
        $config = self::config();
        return @$config[$settingName];
    }

    public static function serverName() {
        return @$_SERVER['SERVER_NAME'];
    }

    public static function appPath() {
        $path = dirname(dirname(__DIR__));
        return $path;
    }

    public static function isProduction() {
        $server = @$_SERVER['SERVER_NAME'];
        $isProduction = !empty($server) && strstr($server, '.com');
        return $isProduction;
    }
}
