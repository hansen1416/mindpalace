define([
           "../ajax/ajax",
           "../anim/conceal",
       ], function (ajax, conceal) {
    /**
     * 内容详情浮动层的点击事件
     */
    return function (target) {

        var id       = target.id,
            pop_item = document.getElementById('pop_item'),
            content  = pop_item.querySelector('.content');

        switch (target.id) {

            case 'pop_close':

                conceal(pop_item);

                break;

            case 'pop_save':

                var url     = document.getElementById('edit_item_detail_url').value,
                    data    = new FormData(),
                    success = function (res) {

                        console.log(res);
                    };

                data.append('item_id', target.dataset.item_id);
                data.append('ctg_id', target.dataset.ctg_id);
                data.append('content', content.innerHTML);


                ajax(url, success, data);

                break;
        }

    }

});