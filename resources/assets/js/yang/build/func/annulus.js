define([
           '../../var/document',
           '../../var/trsfm',
       ], function(document, trsfm) {

    /**
     * 将若干个元素根据指定半径排成环形
     * 顺时针从12点方位开始
     * @param annulusOpt 选项
     * arr 传入元素选择器和半径 array 每一个键值如下 {'selector':'', 'radius':number}
     */
    return function (arr){

        var ele  = [],                                      //元素数组
            len  = 0,                                       //元素的个数
            i    = 0,                                       //annu 的键名
            j    = 0,                                       //ele 的键名
            r    = 0,                                       //半径
            x    = 0,                                       //元素的x方向位移
            y    = 0,                                       //元素的y方向位移
            a    = 0;                                       //元素的顺时针弧度角

        while (i < arr.length) {

            ele = document.body.querySelectorAll(arr[i].selector);
            r   = arr[i].radius;
            len = ele.length;
            a   = Math.PI * 2 / len;

            j = x = y = 0;

            while (j < ele.length) {

                x = r * Math.sin(a * j);
                y = r * Math.cos(a * j) * -1;

                ele[j].style[trsfm] = 'translate(' + x + 'px,' + y + 'px)';

                j++;
            }

            i++;
        }

    }

} );