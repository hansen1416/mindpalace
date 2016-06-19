define([
    "../var/document",
    "./build_space",

], function (document, build_space) {

    class YangSpace extends BuildSpace {

        constructor (param) {
            super(param);
        }

        click() {
            console.log(this.stage);
        }


    }

    window.YangSpace = YangSpace;
});