define([
    "../var/document",
    "./build_space",

], function (document, build_space) {

    class YangSpace extends BuildSpace {

        constructor (stage) {
            super(stage);
        }

        click() {
            console.log(this.stage);
        }


    }

    window.YangSpace = YangSpace;
});