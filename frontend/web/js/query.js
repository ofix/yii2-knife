
String.prototype.firstLetterToUpperCase = function(){
    return this.substring(0,1).toUpperCase()+this.substring(1);
};
function isArray(o){
    return Object.prototype.toString.call(o)==='[object Array]';
}
let phpEditor = null;
let SqlGenerator = Class.extend({
   init:function(){
       this.select = {};
       this.from = {};
       this.join = {};
       this.where = {};
       this.orderBy = {};
   },
    addSelect:function(table,field,type,type_extra,len,zh_name){
       let key = table+field;
        if(this.select[key]=== undefined){
            this.select[key] = [{table:table,field:field,type:type,type_extra:type_extra,len:len,zh_name:zh_name}];
        }else{
            delete this.select[key];
        }
    },
    addFrom:function(table,field){
        this.from[0] = {table:table,field:field};
    },
    addJoin:function(table,field,join_method){
        let key = join_method+table;
        if(this.join[key]=== undefined){
            this.join[key] = [{join_method:join_method,table:table,condition:condition}];
        }else{
            delete this.join[key];
        }
    },
    addWhere:function(table,field,type,type_extra,len,zh_name){
        let key = table+field;
        if(this.where[key]=== undefined){
            this.where[key] = [{table:table,field:field,type:type,type_extra:type_extra,len:len,zh_name:zh_name}];
        }else{
            delete this.where[key];
        }
    },
    addOrderBy:function(table,field,type,type_extra,len,zh_name,asc){
        let key = table+field+asc;
        if(this.orderBy[key]=== undefined){
            this.orderBy[key] = [{table:table,field:field,asc:asc}];
        }else{
            delete this.orderBy[key];
        }
    },
    needExpression:function(){
        let need = false;
        $.each(this.select,function(i,v){
            $.each(v,function(key,value){
                if(v.type_extra === 'image'
                    || v.type_extra ==='time'
                ||v.type_extra === 'date'){
                    need = true;
                    return false;
                }
            });
            if(need){
                return false;
            }
        });
        return need;
    },
    getWhereCondition:function(){

    },
    format:function(str){

    },
    generate:function(){
        let s = 'public function Search($params){\n';
        let exprLeft = this.needExpression()?'new Expression(':'';
        let exprRight = this.needExpression()?')':'';
        s+= '$query = (new Query())->select('+exprLeft+'"';
        let len = 0;
        for(let ele in this.select){
            len ++;
        }
        let i=0;
        $.each(this.select,function(key,value){
            let comma = (i === len-1)?"":",";
            i++;
           $.each(value,function(k,v){
               if(v.type_extra === 'time'
                    || v.type_extra === 'date'
                    || v.field === 'created_at'
                    || v.field === 'updated_at'){
                   s += 'FROM_UNIXTIME('+v.table + '.' + v.field
                       + ',"%Y-%m-%d %H:%i:%S") AS '+v.field+comma+' /* '+v.zh_name+" */";
               }else {
                   s += v.table + '.' + v.field+comma+' /* '+v.zh_name+" */";
               }
           });
        });
        // s =s.substr(0,s.length-1);
        s+= '"'+exprRight+')';
        if(this.from.length) {
            s += '->from("';
            s += this.from[0].table + "." + this.from[0].field + '")';
        }
        $.each(this.join,function(key,value){
            $.each(value,function(i,v){
                s+="->"+v.join_method+'("'+v.table+',"'+v.condition+'")';
            });
        });
        $.each(this.where,function(key,value){
            $.each(value,function(i,v){
                if(v.type ==='char' || v.type === 'varchar'
                || v.type==='text'){
                    s += '->andFilterWhere(["like","' + v.table + '.' + v.field + '",$params["'+v.field+'"]])';
                }else if(v.field === 'created_at'
                    || v.field ==='updated_at'){
                    s += '->andFilterWhere([">=","' + v.table + '.' + v.field + '",$params["'+v.field+'"]])';
                }else{
                    s += '->andFilterWhere(["' + v.table + '.' + v.field + '"=>$params["'+v.field+'"]])';
                }
            });
        });
        if(this.orderBy) {
            s += '->orderBy("';
            $.each(this.orderBy, function (key, value) {
                $.each(value, function (i, v) {
                    s += v.table + '.' + v.field + " ASC,";
                });
            });
            s = s.substr(0, s.length - 1);
            s += '");';
        }
        phpEditor.setValue(s);
        let totalLines = phpEditor.lineCount();
        phpEditor.autoFormatRange({line:0, ch:0}, {line:totalLines});
    }
});

let current_table = null;
let current_field = null;

let ButtonPanel = Class.extend({
    init:function(data,options,container){
        this.data = data;
        this.options = options;
        this.containter = container;
        this.html = '';
        this.field = options.btn_name.toUpperCase();
    },
    show:function(){
        this.beginPanel();
        let that = this;
        $.each(this.data,function(index,fields){
            let comment = fields["COLUMN_COMMENT"];
            let column_type = fields["COLUMN_TYPE"];
            let pattern = /(\w+)\(*(\d+)*\)*/;
            let result = column_type.match(pattern);
            let field_type = null;
            let field_len =-1;
            if(result !== null){
                field_type = result[1];
                field_len = result[2]===undefined?-1:result[2];
            }
            let cmt = comment.split(",");
            let zh_name = cmt[0]===""?fields[that.field]:cmt[0];
            let type_x = cmt[1]===undefined?"":cmt[1];
            that.html += '<div class="o-float-btn" data-zh="'+zh_name+'" data-field="'
                +fields[that.field]+'" data-type="'
                +field_type+'" data-len="'
                +field_len+'" data-x="'+type_x+'">'
                +fields[that.field]+'</div>';
        });
        this.endPanel();
        $(this.containter).html(this.html);
    },
    beginPanel:function(){
        this.html += '<div class="o-btn-panel">';
    },
    endPanel:function(){
        this.html += '</div>';
    }
});
function padZero(num, length) {
    return ((new Array(length)).join('0') + num).slice(-length);
}
function makeTableMenu(data){
    let menu = '<ul class="sidebar-menu">';
    $.each(data,function(i,v){
        active = (i===0)?' active':'';
        menu += '<li><a><span>'+v["TABLE_NAME"]+'</span></a></li>';
    });
    menu+='</ul>';
    $('#left-panel').html(menu);
}

let sqlGenerator = new SqlGenerator();

$(function(){
        phpEditor = CodeMirror.fromTextArea(document.getElementById("rule-code"),{
        lineNumbers:true,
        matchBrackets:true,
        theme:"monokai",
        mode:"text/x-php",
        // readOnly:"nocursor"
    });

    let apiTableColumns = function() {
        $('.sidebar-menu li').bind('click', '', function (v, i) {
            $(this).siblings('.active').removeClass('active');
            $(this).addClass('active');
            current_table = $(this).find('span').html();
            $.post('/knife/table-columns', {table_name:current_table}, function (response) {
                let panel = new ButtonPanel(response.data,{btn_name:"column_name"},"#columns");
                panel.show();
            });
        }).first().trigger('click');
    };

    $.post('/knife/index',function(response){
        makeTableMenu(response.data);
        let sqlTab = new TabCtrl({container:'#sql',title:["SELECT","FROM","JOIN","WHERE","ORDER"],width:"50%"});
        sqlTab.show();
        apiTableColumns();
    });

    $(document).on('click','.rule-btn',function(event){
        $(this).siblings('.rule-active-btn').removeClass('rule-active-btn');
        $(this).addClass('rule-active-btn');
    });

    $(document).on('click','.o-float-btn',function(event){
        let sql = $('.tab-ctrl-head>div.active').attr('data-rule');
        sql = sql.split(' ');
        current_field = $(this).attr('data-field');
        zh = $(this).attr('data-zh');
        type = $(this).attr('data-type');
        len = $(this).attr('data-len');
        typex = $(this).attr('data-x');
        $('.tab-ctrl-body>div.active').append('<div class="sql-select-btn" data-zh="'+zh+'" data-field="'
            +current_field+'">'+current_table+"."+current_field+'</div>');
        let extra = sql[1]?sql[1]:'';
        eval("sqlGenerator.add"+sql[0]+'("'+current_table+'","'+current_field
            +'","'+type+'","'+typex+'",'+len+',"'+zh+'")');
        sqlGenerator.generate();
    });

    let in_zh = false;

    $(document).on('click','#btn-change-name',function(event){
       $btns = $('.o-float-btn');
       in_zh = !in_zh;
       $btns.each(function(i,v){
          $(this).html($(this).attr(in_zh?'data-zh':'data-field'));
       });
    });

    $(document).on('click','.tab-ctrl-head>div',function(event){
        $(this).siblings('.active').removeClass('active');
        let i = $(this).index();
        $(this).addClass('active');
        $('.tab-ctrl-body>div.active').removeClass('active');
        $('.tab-ctrl-body>div').eq(i).addClass('active');
    });


    // let wxPayGenerator = Class.extend({
    //     init:function () {
    //         this.para = ["app_id","mch_id","device_info","nonce_str","sign","sign_type","body",
    //             "detail","attach","out_trade_no", "fee_type","total_fee","spbill_create_ip",
    //             "time_start","time_expire","goods_tag","notify_url","trade_type","product_id","limit_pay",
    //             "openid"];
    //     },
    //     run:function(){
    //         //生成GEI/SET/EXIST
    //         s='';
    //         let that = this;
    //         $.each(this.para,function(index,value){
    //             s+='public function set'+that.firstUpper(that.toPara(value))+'($'+that.toPara(value)+'){\n';
    //             s+='$this->para["'+value+'"]=$'+that.toPara(value)+";\n";
    //             s+='}\n';
    //             s+='public function get'+that.firstUpper(that.toPara(value))+'(){\n';
    //             s+='return $this->para["'+value+'"];\n';
    //             s+='}\n';
    //             s+='public function '+that.toPara(value)+'Exist(){\n';
    //             s+='return array_key_exists("'+value+'",$this->para);\n';
    //             s+='}\n';
    //         });
    //         phpEditor.setValue(s);
    //         let totalLines = phpEditor.lineCount();
    //         phpEditor.autoFormatRange({line:0, ch:0}, {line:totalLines});
    //     },
    //     toPara:function(value){
    //         return value.replace(/\_(\w)/g, function(all, letter){
    //             return letter.toUpperCase();
    //         });
    //     },
    //     firstUpper:function(str){
    //         return  str.substring(0,1).toUpperCase()+str.substring(1);
    //     }
    // });
});