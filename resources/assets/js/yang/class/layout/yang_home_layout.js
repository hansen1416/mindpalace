define([
           "../../func/style/annulus"

       ], function (annulus) {


    class YangHomeLayout {

        constructor() {

        }

        /**
         * 元素环形布局
         * @param param {'selector': '.panel', 'radius': 150}
         */
        static setRings(param) {
            annulus(param);
        }

    }

    window.YangHomeLayout = YangHomeLayout;


});