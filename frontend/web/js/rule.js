$(function(){
    $.post('/knife/index',function(response){
        let menu = new Menu(response.data,{key_title:"table_name",onClick:apiTableColumns},"#left-panel");
        menu.show();
        let sqlTab = new TabCtrl({container:'#sql',title:["SELECT","FROM","JOIN","WHERE","ORDER"],width:"50%"});
        sqlTab.show();
    });

    $(document).on('click','.rule-btn',function(event){
        $(this).siblings('.rule-active-btn').removeClass('rule-active-btn');
        $(this).addClass('rule-active-btn');
    });

    String.prototype.firstLetterToUpperCase = function(){
        return this.substring(0,1).toUpperCase()+this.substring(1);
    };

    let apiTableColumns = function() {
        $('.o-menu-item').bind('click', '', function (v, i) {
            $.post('/knife/table-columns', {table_name: $(this).html()}, function (response) {
                let panel = new ButtonPanel(response.data,{btn_name:"column_name"},"#columns");
                panel.show();
            });
        });
    };

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
            let s = '';
            $.each(this.rules,function(key,value){
                let fields = [];
                let extra = null;
                $.each(value,function(k,v){
                    fields.push(v.field);
                    extra = v.extra;
                });
                s+=eval("let validator = new "+key.firstLetterToUpperCase()+"Validator(fields,extra); validator.run();");
                s = "<p>"+s+"</p>";
            });
            return s;
        }
    });

    let rules = new Rule();

    function isArray(o){
        return Object.prototype.toString.call(o)==='[object Array]';
    }

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
            let s = "[['";
            $.each(this.field,function(index,value){
                s+=value+"',";
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
            let s = "[['";
            $.each(this.field,function(index,value){
                s+= "[['";
                s+=value+"'],";
                s+="DateValidator::TYPE_DATETIME,'format'=>'yyyy-MM-dd HH:mm:ss','timestampAttribute'=>'"+value+"'],<br/>";
            });
            return s;
        }
    });
    let RequiredValidator = RuleValidator.extend({
        init:function(field,extra){
            this._super(field,extra);
        },
        run:function(){
            let s = "[['";
            $.each(this.field,function(index,value){
                s+=value+"',";
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

    $(document).on('click','.o-float-btn',function(event){
        let validator = $('.rule-active-btn').attr('data-rule');
        let field = $(this).html();
        rules.add(field,validator);
        let code = rules.generate();
        $('#rule-code').html(code);
    });

    $(document).on('dragstart','.o-float-btn',function(event){
        let e = event.originalEvent;
        e.dataTransfer.setData("column",$(this).html());
    });

    $(document).on('dragover','#sql .body-i',function(event){
        event.preventDefault();
    });

    $(document).on('drop','#sql .body-i',function(event){
        let  e= event.originalEvent;
        let column = e.dataTransfer.getData('column');
        $(this).append('<div class="o-float-btn">'+column+'</div>');
    });

    let ButtonPanel = Class.extend({
        init:function(data,options,container){
            this.data = data;
            this.options = options;
            this.containter = container;
            this.html = '';
        },
        show:function(){
            this.beginPanel();
            let that = this;
            $.each(this.data,function(index,btn){
               that.html += '<div class="o-float-btn" draggable="true">'+btn[that.options.btn_name]+'</div>';
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


});