<?php
/**
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 */

namespace frontend\assets;

use yii\web\AssetBundle;


/**
 * Frontend application asset
 */
class RuleAsset extends AssetBundle
{
    /**
     * @var string
     */
    public $basePath = '@webroot';
    /**
     * @var string
     */
    public $baseUrl = '@web';

    /**
     * @var array
     */
    public $css = [
        'css/components.css',
        'css/knife.css',
        'js/codemirror-5.37.0/lib/codemirror.css',
        'js/codemirror-5.37.0/theme/monokai.css',
    ];

    /**
     * @var array
     */
    public $js = [
        'js/jquery.class.js',
        'js/components.js',
        'js/codemirror-5.37.0/lib/codemirror.js',
        'js/codemirror-5.37.0/addon/autoformatrange/autoFormatRange.js',
        'js/codemirror-5.37.0/addon/edit/matchbrackets.js',
        'js/codemirror-5.37.0/mode/htmlmixed/htmlmixed.js',
        'js/codemirror-5.37.0/mode/xml/xml.js',
        'js/codemirror-5.37.0/mode/javascript/javascript.js',
        'js/codemirror-5.37.0/mode/css/css.js',
        'js/codemirror-5.37.0/mode/clike/clike.js',
        'js/codemirror-5.37.0/mode/php/php.js',
        'js/rule.js',
    ];

    /**
     * @var array
     */
    public $depends = [
        'yii\web\JqueryAsset',
    ];
}
