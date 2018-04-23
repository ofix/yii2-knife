<?php
/*
 * This file is part of panda-log.
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the MIT-LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @author    code lighter
 * @copyright code lighter
 * @qq        981326632
 * @wechat    981326632
 * @license   http://www.opensource.org/licenses/mit-license.php MIT License
 * @Date: 2018/3/1
 * @Time: 8:21
 */

namespace frontend\controllers;


use frontend\service\SqlService;
use yii\web\Controller;
use Yii;
use yii\web\Response;

class KnifeController extends Controller
{
    public $enableCsrfValidation = false;
    public function success($msg="请求成功",$data)
    {
        Yii::$app->response->format = Response::FORMAT_JSON;
        return ['message'=>$msg,'data'=>$data];
    }
    public function actionIndex(){
        if(!Yii::$app->request->isAjax){
            return $this->renderAjax('index',[]);
        }
        $all_tables = SqlService::getAllTable();
        return $this->success('',$all_tables);
    }
    public function actionTableColumns(){
        $table_name = Yii::$app->request->post('table_name');
        $columns = SqlService::getTableColumns($table_name);
        return $this->success('',$columns);
    }
}