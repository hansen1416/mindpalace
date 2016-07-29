define([
           "../anim/conceal",
           "../anim/reveal"
       ], function (conceal, reveal) {

    return function (message) {

        let bar      = document.getElementById('errorBar'),
            progress = document.getElementById('progress');

        if (progress) {
            conceal(progress);
        }

        if (!bar) {
            return false;
        }

        bar.innerHTML = message;
        reveal(bar);

        setTimeout(function () {
            conceal(bar);
        }, 5000);

    }

});
