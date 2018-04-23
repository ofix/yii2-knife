let toString = Object.prototype.toString;
function isFunc(obj){
    return toString.call(obj) === '[object Function]';
}
function isEqual(a,b,aStack,bStack){
    // === 结果为true 的区别出 +0 和 -0
    if(a === b)
        return a !== 0 || 1/a === 1/b;
    // typeof null 的结果为 object，这里做判断，是为了让有null的情况尽早退出函数
    if(a === null || b=== null)
        return flase;
    // 判断 NaN
    if(a !== a)
        return b !== b;
    // 判断参数a类型，如果是基本类型，在这里可以直接返回false
    let type = typeof a;
    if(type !== 'function' && type !== 'object' && typeof b !== 'object')
        return false;
    // 更复杂的对象使用 deepEq 函数进行深度比较
    return deepEq(a,b,aStack,bStack);
}

function deepEq(a,b,aStack,bStack){
    // a 和 b 的内部属性 [[class]] 相同时 返回true
    let className = toString.call(a);
    if(className !== toString.call(b))
        return false;
    switch(className){
        case '[object RegExp]':
        case '[object String]':
            return ''+a === ''+b;
        case '[object Number]':
            if(+a !== +a)
                return +b !== +b;
            return +a ===0 ? 1/+a === 1/b: +a === +b;
        case '[object Date]':
        case '[object Boolean]':
            return +a === +b;
    }
    let isArray = className === '[object Array]';
    //不是数组
    if(!isArray){
        //过滤掉两个函数的情况
        if(typeof a !== 'object' || typeof b !== 'object')
            return false;
        let aCtor = a.constructor,
            bCtor = b.constructor;
        // aCtor 和 bCtor 必须都存在并且都不是 Object 构造函数的情况下，aCtor 不等于 bCtor,
        // 那这两个对象就真的不相等啦
        if(aCtor !== bCtor && !(isFunc(aCtor)&& aCtor instanceof aCtor
            && isFunc(bCtor) && bCtor instanceof bCtor )
            && ('constructor' in a && 'constructor' in b)){
            return false;
        }

        aStack = aStack || [];
        bStack = bStack || [];
        let length = aStack.length;
        //检查是否有循环引用的部分
        while(length--){
            if(aStack[length] === a){
                return bStack[length] === b;
            }
        }

        aStack.push(a);
        bStack.push(b);

        //数组判断
        if(isArray){
            length = a.length;
            if(length !== b.length){
                return false;
            }
            while(length--){
                if(!eq(a[length],b[length],aStack,bStack))
                    return false;
            }
        }else{ //对象判断
            let keys = Object.keys(a),
                key;
            length = keys.length;
            if(Object.keys(b).length !== length)
                return false;
            while(length--){
                key = keys[length];
                if(!(b.hasOwnProperty(key) && eq(a[key],b[key],aStack,bStack)))
                    return false;
            }
        }

        aStack.pop();
        bStack.pop();
        return true;
    }
}

let compiler = Class.extend({
   init:function(){
       this.select = [];
       this.selectGroup = [];
       this.groupColor = ['#'];
       this.from = '';
       this.join = [];
       this.where = [];
       this.orderBy = [];
   },
   addSelect(table,field){
       let exist = false;
       let o = {table:table,field:field};
       $.each(this.select,function(i,v){
            if(isEqual(v,o)){
                exist = true;
            }
       });
       if(!exist){
           this.select.push(o);
       }
   },
   addSelectGroup(table){

   },
   addFrom(table){
       this.from = table;
   },
   addJoin(joinMethod,tableA,fieldA,tableB,fieldB){
       let exist = false;
       let o = {method:joinMethod,tableA:tableA,fieldA:fieldA,tableB:tableB,fieldB:fieldB};
       $.each(this.join,function(i,v){
          if(isEqual(v,o)){
              exist = true;
          }
       });
       if(!exist){
           this.join.push(o);
       }
    },
   addWhere(type,table,field,extra){
        let exist = false;
        let o = {type:type,table:table,field:field,extra:extra};
        $.each(this.where,function(i,v){
            if(isEqual(v,o)){
                exist = true;
            }
        });
        if(!exist){
            this.where.push(o);
        }
    },
   addOrderBy(){

   }
});

let TabCtrl = Class.extend({
    init:function(options){
        this.options = options;
        this.title = options.title;
        this.container = options.container;
        this.activeTab = options.activeTab || 0;
        this.html = '';
        this.bindEvent();
    },
    setActiveTab:function(i){
        this.activeTab = i;
    },
    getActiveTab:function(){
        return this.activeTab;
    },
    show:function(){
        let id = $(this.container).attr("id");
        this.html += '<div id="'+id+'" class="o-tab-ctrl">';
        let that = this;
        this.html += '<div class="tab-head">';
        $.each(this.title,function(i,v){
            let active = (i === that.activeTab)?'active-head-i':'';
            that.html += '<div class="head-i '+active+'">'+v+'</div>';
        });
        this.html += '</div>';
        this.html += '<div class="tab-body">';
        $.each(this.title,function(i,v){
            let active = (i === that.activeTab)?'active-body-i':'';
            that.html += '<div class="body-i '+active+'"></div>';
        });
        this.html += '</div>';
        this.html += '</div>';
        $(this.container).replaceWith(this.html);
        let n = this.title.length;
        $(this.container+' .head-i').css('width',(100/n)+'%');
    },
    bindEvent:function(){
      $(document).on('click','.o-tab-ctrl .head-i',function(event){
          let index = $(this).index()+1;
          $(this).siblings().removeClass('active-head-i');
          $(this).addClass('active-head-i');
          $(this).parent().next('.tab-body')
              .find('.active-body-i').removeClass('active-body-i');
          $(this).parent().next('.tab-body')
              .find('.body-i:nth-child('+index+')').addClass('active-body-i');
      });
    },

});
