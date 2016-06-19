define([
    "../var/document",
    "./m",

], function (document, m) {

    class YangSpace extends M {

        constructor (stage) {
            super(stage);
        }

        click() {
            console.log(this.stage);
        }


    }

    window.YangSpace = YangSpace;
});