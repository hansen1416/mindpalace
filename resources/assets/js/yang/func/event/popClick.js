define([
           "../ajax/ajax",
           "../anim/conceal",
       ], function (ajax, conceal) {
    /**
     * 内容详情浮动层的点击事件
     */
    return function (target) {

        if (target.classList.contains('close')) {

            conceal(document.getElementById('pop_item'));

        }

    }

});