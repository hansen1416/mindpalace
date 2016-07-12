define([
           "../var/document",
           "../func/style/trsfm",
           "../func/style/getStyle",
           "../func/event/bindEvent",
           "../func/ajax/ajax",
           "../func/anim/roll",
           "../func/anim/reveal",
           "../func/anim/conceal",
           "../func/math/matrixToArr",
           "../func/style/annulus",
           "../func/event/popClick",
           "./build_space"

       ], function (document, trsfm, getStyle, bindEvent, ajax, roll, reveal, conceal, matrixToArr, annulus,
                    popClick, build_space) {

    /**
     * 引入 class BuildSpace
     * @type {null}
     */
    build_space = null;


    class YangSpace extends BuildSpace {

        constructor(param) {
            super(param);

            this.aimedStar = null;
        }


        /**
         * 操作界面部分布局
         */
        static setOperation(annu) {
            annulus(annu);
        }

        //setOperation ends


        /**
         * 同心球面的缩放
         */
        zoom() {

            bindEvent(this.stage, 'wheel', callback);

            var upper      = this,
                style_zoom = document.getElementById('style_zoom'),
                sheet      = style_zoom['sheet'] || style_zoom['styleSheet'];

            /**
             * 滚轮向下转动一次隐藏一层，直到隐藏倒数第二层，同时所有显示的元素向球心移动一个 gap 的距离
             * 滚轮向上转动一次显示一层，直到显示出最内层，同时所有显示的元素背向球心移动一个 gap 的距离
             * 通过向页面中的 style[id='style_zoom'] 添加和删除规则来显示和隐藏元素
             * styleSheet 中的规则条数应该和隐藏的层数相同
             * @param e
             */
            function callback(e) {
                e.preventDefault();

                var sign = e.deltaY / Math.abs(e.deltaY),           //sign > 0收缩，sign < 0 扩展
                    lens = sheet.cssRules.length,
                    tier = sign > 0 ? lens : lens - 1;

                //如果当前需要隐藏的层大于等于最外层，则不可以再扩展
                //如果当前需要隐藏的层小于等于最外层，则不可以再收缩
                if ((tier >= upper.tiers && sign > 0) || (tier < 0 && sign < 0)) {
                    return false;
                }

                /**
                 * sign > 0 滚轮向下滚动，同心球收缩
                 * sign < 0 滚轮向上滚动，同新求扩展
                 */
                if (sign > 0) {
                    sheet.insertRule('.tier-' + tier + '{display:none;}', tier);
                } else {
                    sheet.deleteRule(tier);
                }

                var not = '';

                //获取已经隐藏掉的层，在其后不选择
                do {
                    not += ':not(.tier-' + tier + ')';
                    tier--;
                } while (tier > -1);

                var stars = upper.stage.querySelectorAll('.star' + not),
                    str   = upper.gap * sign + 'px',
                    i     = 0;
                //缩放所有显示的元素
                do {
                    stars[i].style[trsfm] = getStyle(stars[i], 'transform') + 'translateZ(' + str + ')';
                    i++;
                } while (i < stars.length);

            }

        }

        //zoom ends

        /**
         * 页面的所有点击事件
         */
        click() {

            bindEvent(document, 'click', callback);

            var upper = this;

            function callback(e) {

                var target = e.target;
                //如果是submit 或 a 标签，则只执行默认行为
                if (target.nodeName === 'A') {
                    return false;
                }

                e.preventDefault();

                if (target.classList.contains('star')) {
                    //点击分类或者内容题目时的点击事件
                    starClick(target);

                } else if (target.classList.contains('btn')) {
                    //.operation 包含的所有 .btn 的点击
                    btnClick(target);

                } else if (target.classList.contains('submit')) {
                    //ajax提交表单
                    submitClick(target);
                } else if (target.classList.contains('pop')) {
                    //内容详情浮层的点击事件
                    popClick(target);
                }

            }

            //callback ends

            /**
             * 所有 .star 元素，点击后环绕其出现一圈按钮，可以增删改查
             * 并且给所有.btn 的 dataset 中添加该 star 的 id,pid,tier
             * 显示对应的 operation
             * @param target 点击的目标元素
             */
            function starClick(target) {

                var dataset  = target.dataset,
                    ctg_id   = dataset['ctg_id'] ? dataset['ctg_id'] : 0,       //分类的ID
                    item_id  = dataset['item_id'] ? dataset['item_id'] : 0,     //内容的ID
                    ctg_box  = document.getElementById('ctg_box'),              //分类对应的操作面板
                    item_box = document.getElementById('item_box');             //内容对应的操作面板

                if (ctg_id) {
                    reveal(ctg_box);
                    conceal(item_box);
                } else if (item_id) {
                    reveal(item_box);
                    conceal(ctg_box);
                }

                upper.aimedStar = target;

            }

            //starClick ends

            /**
             * .operation 中各个 .btn 的点击事件
             * @param target .btn 元素
             */
            function btnClick(target) {
                /**
                 * star 选中的 .star 元素
                 * cList target的classList
                 * form 当前操作界面中的表单
                 */
                var star      = upper.aimedStar,
                    s_dataset = star.dataset,
                    b_dataset = target.dataset,
                    cList     = target.classList,
                    i         = 0,
                    form;
                /**
                 * 分类元素和内容元素选择不同的表单
                 */
                if (cList.contains('ctg_btn')) {
                    form = document.getElementById('ctg_form');
                } else if (cList.contains('item_btn')) {
                    form = document.getElementById('item_form');
                }
                /**
                 * 从 star 或 target 中取出 表单隐藏域需要的数据
                 * @type {NodeList}
                 */
                var inputs = form.querySelectorAll("input[type='hidden']");

                while (i < inputs.length) {
                    inputs[i].value = s_dataset[inputs[i].getAttribute('name')] || b_dataset[inputs[i].getAttribute('name')];
                    i++;
                }

                /**
                 * 如果按钮是操作表单的，会有 dataset.action
                 * 其他是操作样式或动画
                 */
                if (b_dataset.action) {

                    form.action = b_dataset.action;
                    reveal(form);

                    /**
                     * 将按钮的 title 属性赋予 textarea
                     * @type {Element}
                     */
                    var textarea = form.querySelector('textarea');

                    textarea.setAttribute('title', target.getAttribute('title'));

                    /**
                     * 如果是编辑名称，将 star 的内容传递到 form 中
                     * 其他的按钮，将 form.textarea 的内容清空
                     */
                    if (b_dataset.message == 'edit-self') {
                        textarea.innerHTML = star.innerHTML;
                    } else {
                        textarea.innerHTML = '';
                    }

                } else {

                    switch (target.dataset.func) {
                        /*
                         * 将选中的 .star 元素旋转到屏幕正中
                         * 目前可以显示正确，但是缺少动画效果
                         */
                        //TODO
                        case 'focus':

                            var destiny                  = roll(star.style[trsfm]);
                            upper.rotateObj.style[trsfm] = destiny;
                            upper.setStartMatrix         = matrixToArr(destiny);

                            break;
                    /**
                     * 隐藏当前的操作界面
                     */
                        case 'hide':

                            conceal(form);
                            conceal(form.parentNode);

                            break;
                    /**
                     * 显示内容的详细内容
                     */
                        case 'detail':

                            var pop_item = document.getElementById('pop_item'),
                                url      = document.getElementById('item_detail_url').value,
                                data     = new FormData(),
                                success  = function (res) {

                                    if (res.status) {

                                        var content  = pop_item.querySelector('.content'),
                                            pop_save = pop_item.querySelector('#pop_save');

                                        content.innerHTML        = res.message;
                                        pop_save.dataset.ctg_id  = s_dataset.pid;
                                        pop_save.dataset.item_id = s_dataset.item_id;

                                        pop_item.style['display'] = 'block';
                                    }
                                };

                            data.append('item_id', s_dataset['item_id']);

                            ajax(url, success, data);

                            break;
                    }

                }

                return false;

            }

            //btnClick ends

            /**
             * ajax 提交表单
             * @param target 提交按钮，是 form 的子元素
             */
            function submitClick(target) {
                var form = target.parentNode,
                    success;

                /**
                 * 请求成功的回调函数
                 * @param res json对象 res.status == 1 成功, 0 失败
                 */
                success = function (res) {
                    //TODO
                    console.log(res);
                };

                ajax(form.action, success, new FormData(form));

            }

            //submitClick ends

        }

        //click ends


    }

    window.YangSpace = YangSpace;
});