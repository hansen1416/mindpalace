define([
           "../anim/conceal"
       ], function (conceal) {

    return function () {

        let progress = document.getElementById('progress');

        if (!progress) {
            return false;
        }

        progress.classList.remove('taiji');
        progress.classList.add('correct');

        setTimeout(function () {
            conceal(progress);

            progress.classList.remove('correct');
            progress.classList.add('taiji');
        }, 2000);

    }
});