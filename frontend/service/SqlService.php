<?php
namespace frontend\service;


use yii\base\Model;
use yii\db\Expression;
use yii\db\Query;

class SqlService extends Model
{
    public static function getAllTable()
    {
        $db = (new Query())->select(new Expression('database()'))->all();
        $query = (new Query())->select('table_name,engine,table_comment,create_time')
            ->from('information_schema.tables')
            ->where(['table_schema'=> $db[0]])
            ->all();
        return $query;
    }
    public static function getTableColumns($table_name){
        $db = (new Query())->select(new Expression('database()'))->all();
        $query = (new Query())->select('column_name,data_type,column_comment,
        column_key,extra')->from('information_schema.columns')
            ->where(['table_name'=>$table_name])
            ->andWhere(['table_schema'=>$db[0]])
            ->orderBy('ordinal_position')
            ->all();
        return $query;
    }
}