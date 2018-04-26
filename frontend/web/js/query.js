
String.prototype.firstLetterToUpperCase = function(){
    return this.substring(0,1).toUpperCase()+this.substring(1);
};
function isArray(o){
    return Object.prototype.toString.call(o)==='[object Array]';
}
let Rule = Class.extend({
    init:function(){
        this.rules = {};
    },
    add:function(field,validator,extra=null){
        if(this.rules[validator]=== undefined){
            this.rules[validator] = [{field:field,validator:validator,extra:extra}];
        }else{
            if(!this.exist(field,validator,extra)) {
                this.rules[validator].push({field: field, validator: validator, extra: extra});
            }
        }
    },
    exist:function(field,validator,extra=null){
        let arrValidator = this.rules[validator];
        if(arrValidator!== undefined){
            for(i=0,len=arrValidator.length; i<len; i++){
                if(arrValidator[i].field === field
                    &&arrValidator[i].validator === validator
                    && arrValidator[i].extra === extra){
                    arrValidator.splice(i,1);
                    return true;
                }
            }
        }
        return false;
    },
    generate:function(){
        let s = 'public function rules()\n{\nreturn [\n';
        $.each(this.rules,function(key,value){
            let fields = [];
            let extra = null;
            $.each(value,function(k,v){
                fields.push(v.field);
                extra = v.extra;
            });
            s+=eval("let validator = new "+key.firstLetterToUpperCase()+"Validator(fields,extra); validator.run();");
            s+="\n";
        });
        s+= '\n];\n}\n';
        return s;
    }
});
let RuleValidator = Class.extend({
    init:function(field,extra){
        if(!isArray(field)){
            field = [field];
        }
        this.field = field;
        this.extra = extra;
    },
    run:function(){
    }
});
let TrimValidator = RuleValidator.extend({
    init:function(field,extra){
        this._super(field,extra);
    },
    run:function() {
        let s = "[[";
        $.each(this.field,function(index,value){
            s+="'"+value+"',";
        });
        s =s.substr(0,s.length-1);
        s+="],'trim'],";
        return s;
    }
});
let DateValidator = RuleValidator.extend({
    init:function(field,extra){
        this._super(field,extra);
    },
    run:function() {
        let s = "";
        $.each(this.field,function(index,value){
            s+= "[[";
            s+="'"+value+"'],";
            s+="DateValidator::TYPE_DATETIME,'format'=>'yyyy-MM-dd HH:mm:ss','timestampAttribute'=>'"+value+"'],\n";
        });
        return s;
    }
});
let RequiredValidator = RuleValidator.extend({
    init:function(field,extra){
        this._super(field,extra);
    },
    run:function(){
        let s = "[[";
        $.each(this.field,function(index,value){
            s+="'"+value+"',";
        });
        s =s.substr(0,s.length-1);
        s+="],'required'],";
        return s;
    }
});
let StringValidator = RuleValidator.extend({
    init:function(field,extra){
        this._super(field,extra);
    },
    run:function(){
        let s = "[[";
        $.each(this.field,function(index,value){
            s+= "'"+value+"',";
        });
        s = s.substr(0,s.length-1);

        if(this.extra === null){
            return s+"],'string'],";
        }else if(this.extra.min && this.extra.max === null){
            return s+"],'string',"+"'min'=>"+this.extra.min+"],";
        }else if(this.extra.min === null && this.extra.max){
            return s+"],'string',"+"'max'=>"+this.extra.min+"],";
        }else {
            return s+"],'string',"+"'min'=>"+this.extra.min+",'max'=>" + this.extra.max + "],";
        }
    }
});
let SafeValidator = RuleValidator.extend({
    init:function(field,extra){
        this._super(field,extra);
    },
    run:function(){
        let s = "[[";
        $.each(this.field,function(index,value){
            s+= "'"+value+"',";
        });
        s = s.substr(0,s.length-1);
        return s+"],'safe'],";
    }
});
let UrlValidator = RuleValidator.extend({
    init:function(field,extra){
        this._super(field,extra);
    },
    run:function(){
        let s = "[[";
        $.each(this.field,function(index,value){
            s+= "'"+value+"',";
        });
        s = s.substr(0,s.length-1);
        s += "],'url',";

        if(this.extra === null){
            return s+"],'url','defaultScheme'=>'http'],";
        }
        //
        let extra = '';
        if(this.extra.defaultScheme){
            extra += "'defaultScheme'=>'"+this.extra.defaultScheme+"',";
        }
        if(this.extra.validSchemes) {
            extra += "'validSchemes'=>[";
            $.each(this.extra.validSchemes,function(index,value){
                extra += "'"+value+"',";
            });
        }
        if(this.extra.enableIDN){
            extra += "'enableIDN'=>true,";
        }
        extra = extra.substr(0,s.length-1);
        extra += "],";
        return s += extra;

    }
});
let NumberValidator = RuleValidator.extend({
    init:function(field,extra){
        this._super(field,extra);
    },
    run:function(){
        let s = "[[";
        $.each(this.field,function(index,value){
            s+= "'"+value+"',";
        });
        s = s.substr(0,s.length-1);

        if(this.extra === null){
            return s+"],'number'],";
        }else if(this.extra.min && this.extra.max === null){
            return s+"],'number',"+"'min'=>"+this.extra.min+"],";
        }else if(this.extra.min === null && this.extra.max){
            return s+"],'number',"+"'max'=>"+this.extra.min+"],";
        }else {
            return s+"],'number',"+"'min'=>"+this.extra.min+",'max'=>" + this.extra.max + "],";
        }
    }
});
let EmailValidator = RuleValidator.extend({
    init:function(field,extra){
        this._super(field,extra);
    },
    run:function(){
        let s = "[[";
        $.each(this.field,function(index,value){
            s+= "'"+value+"',";
        });
        s = s.substr(0,s.length-1);

        if(this.extra === null){
            return s+"],'email'],";
        }
        if(this.extra.allowName){
            return s+"],'email','allowName'=>true],"
        }
    }
});
let UniqueValidator =  RuleValidator.extend({
    init:function(field,extra){
        this._super(field,extra);
    },
    run:function(){
        let s = "[[";
        $.each(this.field,function(index,value){
            s+= "'"+value+"',";
        });
        return '';
    }
});
let BooleanValidator =  RuleValidator.extend({
    init:function(field,extra){
        this._super(field,extra);
    },
    run:function(){
        let s = "[[";
        $.each(this.field,function(index,value){
            s+= "'"+value+"',";
        });
        s = s.substr(0,s.length-1);

        if(this.extra === null){
            return s+"],'boolean'],";
        }
        if(this.extra.trueValue) {
            return s+"],'boolean','trueValue'=>"+this.extra.trueValue+",'falseValue'=>"+this.extra.falseValue+"],";
        }
    }
});
let CaptchaValidator = RuleValidator.extend({
    init:function(field,extra){
        this._super(field,extra);
    },
    run:function(){
        let s = "[[";
        $.each(this.field,function(index,value){
            s+= "'"+value+"',";
        });
        s = s.substr(0,s.length-1);

        if(this.extra === null){
            return s+"],'captcha'],";
        }
        if(this.extra.caseSensitive) {
            return s+"],'captcha','caseSensitive'=>true],";
        }
    }
});
let DefaultValidator = RuleValidator.extend({
    init:function(field,extra){
        this._super(field,extra);
    },
    run:function(){
        let s = "[[";
        $.each(this.field,function(index,value){
            s+= "'"+value+"',";
        });
        s = s.substr(0,s.length-1);

        if(this.extra === null){
            return s+"],'default','value'=>null],";
        }
        if(this.extra.value) {
            return s+"],'default'," + "'value'=>'" + this.extra.value + "'],";
        }
    }
});
let DoubleValidator = RuleValidator.extend({
    init:function(field,extra){
        this._super(field,extra);
    },
    run:function(){
        let s = "[[";
        $.each(this.field,function(index,value){
            s+= "'"+value+"',";
        });
        s = s.substr(0,s.length-1);

        if(this.extra === null){
            return s+"],'double'],";
        }else if(this.extra.min && this.extra.max === null){
            return s+"],'double',"+"'min'=>"+this.extra.min+"],";
        }else if(this.extra.min === null && this.extra.max){
            return s+"],'double',"+"'max'=>"+this.extra.min+"],";
        }else {
            return s+"],'double',"+"'min'=>"+this.extra.min+",'max'=>" + this.extra.max + "],";
        }
    }
});
let IntegerValidator = RuleValidator.extend({
    init:function(field,extra){
        this._super(field,extra);
    },
    run:function(){
        let s = "[[";
        $.each(this.field,function(index,value){
            s+= "'"+value+"',";
        });
        s = s.substr(0,s.length-1);

        if(this.extra === null){
            return s+"],'integer'],";
        }else if(this.extra.min && this.extra.max === null){
            return s+"],'integer',"+"'min'=>"+this.extra.min+"],";
        }else if(this.extra.min === null && this.extra.max){
            return s+"],'integer',"+"'max'=>"+this.extra.min+"],";
        }else {
            return s+"],'integer',"+"'min'=>"+this.extra.min+",'max'=>" + this.extra.max + "],";
        }
    }
});
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
        $.each(this.data,function(index,btn){
            that.html += '<div class="o-float-btn" draggable="true">'+btn[that.field]+'</div>';
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
let Menu = Class.extend({
    init:function(data,options,container){
        this.data = data;
        this.options = options;
        this.containter= container;
        this.html = '';
    },
    show:function(){
        this.beginMenu();
        let key = this.options.key_title;
        let that = this;
        $.each(this.data,function(index,menu){
            let activeMenu = index===0? "o-active-menu-item":"";
            that.html+= '<div class="o-menu-item ' +activeMenu+'">'+menu[key]+"</div>";
        });
        this.endMenu();
        $(this.containter).html(this.html);
        this.options.onClick();
        $(".o-menu-item:first").trigger('click');
    },
    beginMenu:function(){
        this.html += '<div class="o-menu">';
    },
    endMenu:function(){
        this.html += '</div>';
    }
});
let rules = new Rule();
function padZero(num, length) {
    return ((new Array(length)).join('0') + num).slice(-length);
}
function makeTableMenu(data){
    let menu = '<ul class="sidebar-menu">';
    $.each(data,function(i,v){
        active = (i===0)?' active':'';
        menu += '<li><a><span>'+v["table_name"]+'</span></a></li>';
    });
    menu+='</ul>';
    $('#left-panel').html(menu);
}
$(function(){
    $.post('/knife/index',function(response){
        // let menu = new Menu(response.data,{key_title:"table_name",onClick:apiTableColumns},"#left-panel");
        // menu.show();
        makeTableMenu(response.data);
        let sqlTab = new TabCtrl({container:'#sql',title:["SELECT","FROM","JOIN","WHERE","ORDER"],width:"50%"});
        sqlTab.show();
        apiTableColumns();
    });

    let phpEditor = CodeMirror.fromTextArea(document.getElementById("rule-code"),{
        lineNumbers:true,
        matchBrackets:true,
        theme:"monokai",
        mode:"text/x-php",
        readOnly:"nocursor"
    });

    $(document).on('click','.rule-btn',function(event){
        $(this).siblings('.rule-active-btn').removeClass('rule-active-btn');
        $(this).addClass('rule-active-btn');
    });

    $(document).on('click','.o-float-btn',function(event){
        let validator = $('.rule-active-btn').attr('data-rule');
        let field = $(this).html();
        rules.add(field,validator);
        let code = rules.generate();
        phpEditor.setValue(code);
        let totalLines = phpEditor.lineCount();
        phpEditor.autoFormatRange({line:0, ch:0}, {line:totalLines});
    });

    let apiTableColumns = function() {
        $('.sidebar-menu li').bind('click', '', function (v, i) {
            console.log("adfasdf");
            let item = $(this).find('span');
            console.log($(this)[0]);
            $.post('/knife/table-columns', {table_name: $(this).find('span').html()}, function (response) {
                let panel = new ButtonPanel(response.data,{btn_name:"column_name"},"#columns");
                panel.show();
            });
        });
    };

});