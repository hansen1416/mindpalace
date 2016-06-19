define([
    "../var/document",

], function (document) {

    class BuildSpace {

        constructor(param) {
            this.stage     = param.stage;
            this.rotateObj = param.rotateObj;
            this.aimedStar = 99;
        }

        init() {
            console.log(123);
        }





    }

    window.BuildSpace = BuildSpace;
});