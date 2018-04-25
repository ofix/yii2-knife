let FIELD_TYPE_STRING = 'string';
let FIELD_TYPE_INT = 'int';
let FIELD_TYPE_DATE = 'date';
let FIELD_TYPE_TIME = 'time';

//删除左边的空格
function ltrim(str) {
    return str.replace(/(^\s*,)/g, "");
}
//删除右边的空格
function rtrim(str) {
    return str.replace(/(\s*,$)/g, "");
}

let Generator = Class.extend({
   init:function(language,framework){
       this.language = language;
       this.framework = framework;
   },
   getLanguage:function(){
       return this.language;
   },
   getFramework:function(){
        return this.framework;
   }
});

//全局数据暂存区
let Knife = Class.extend({
    init:function(){
        this.currentTable = null;
        this.currentField = null;
        this.select = [];
        this.from = [];
        this.where = [];
        this.orderBy = [];
        this.advanceQuery= [];
    },
    pushFromField:function(fromField){
        this.from.push(fromField);
    },
    removeFromField:function(fromField){
      let that =this;
      $.each(this.from,function(index,value){
            if(value.table === fromField.table
                && value.field === fromField.field){
                // that.from.re
            }
      });
    },
    setCurrentTable:function(table){
        this.currentTable = table;
    },
    getCurrentTable:function(){
        return this.currentTable;
    },
    setCurrentField:function(field){
        this.currentField = field;
    },
    getCurrentField:function(){
        return this.currentField;
    },
});

let QueryGenerator = Generator.extend({
    init:function(select,from,where,orderBy){
        this._super('PHP','Yii2');
        this.select = select;
        this.from = from;
        this.where = where;
        this.orderBy = orderBy;
        this.sqlQuery = '';
    },
    exec:function(){
        this.sqlSelect();
        this.sqlFrom();
        this.sqlWhere();
        this.sqlOrderBy();
        return this.sqlQuery;
    },
    sqlWhere:function(){
        let that = this;
        $.each(this.from,function(i,v){
            that.sqlQuery += '->innerJoin("'+v.joinB+'",'+'"'+v.condA+'='+v.condB+'")';
        });
    },
    sqlOrderBy:function(){
        let that = this;
        this.sqlQuery += '->orderBy("';
        $.each(this.select,function(i,v) {
            that.sqlQuery += v.sequence + ',';
        });
        rtrim(thst.sqlQuery,',');
        this.sqlQuery += '")';
    },
    sqlSelect:function(){
        this.sqlQuery += '(new Query())->select(';
        let needExpr = this.needExpression();
        let exprLeft = needExpr? 'new Expression("':'';
        let exprRight = needExpr? ')':'';
        this.sqlQuery += exprLeft;
        let that =this;
        $.each(this.select,function(i,v){
            if(v.type === FIELD_TYPE_TIME){
                that.sqlQuery += 'FROM_UNIXTIME("%Y-%m-%d",'+v.column_name+') AS '+v.column_name+',';
            }else{
                that.sqlQuery += v.column_name+',';
            }
        });
        rtrim(that.sqlQuery,',');
        this.sqlQuery += exprRight;
        this.sqlQuery += ')';
    },
    sqlFrom:function(){
        let that = this;
        $.each(this.from,function(i,v){
            if(i===0){
                that.sqlQuery += '->from("' + v.joinB + '",' + '"' + v.condA + '=' + v.condB + '")';
            }else {
                that.sqlQuery += '->innerJoin("' + v.joinB + '",' + '"' + v.condA + '=' + v.condB + '")';
            }
        });
        this.sqlQuery += ')';
    },
    needExpression:function(){
        $.each(this.select,function(i,v){
            if(v.type === FIELD_TYPE_STRING || v.type === FIELD_TYPE_INT){
                return false;
            }
           if(v.type === FIELD_TYPE_DATE || v.type === v.type === FIELD_TYPE_TIME){
                return true;
           }
        });
    }
});
