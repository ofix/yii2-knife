/**
 * Created by Administrator on 2018/5/4 0004.
 */
const TOKEN_TYPE = {
    KEYWORD:0,
    STRING:1,

};
let Token = Class.extend({
    init:function(src){
        this.src = src;
        this.pos = 0;
        this.size = 0;
        this.token_list = [];
    },
    next:function(){

    },
    parse:function(){

    }
});