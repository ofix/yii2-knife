$(function(){
    $.post('/knife/index',function(response){
        let menu = new Menu(response.data,{key_title:"table_name",onClick:apiTableColumns},"#left-panel");
        menu.show();
        let sqlTab = new TabCtrl({container:'#sql',title:["SELECT","FROM","JOIN","WHERE","ORDER"],width:"50%"});
        sqlTab.show();
    });

    let apiTableColumns = function() {
        $('.o-menu-item').bind('click', '', function (v, i) {
            $.post('/knife/table-columns', {table_name: $(this).html()}, function (response) {
                let panel = new ButtonPanel(response.data,{btn_name:"column_name"},"#columns");
                panel.show();
            });
        });
    };

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