/// <reference path="../../Phaser/Game.ts" />

(function () {

    //  Here we create a quite tiny game (320x240 in size)
    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);

    function init() {

        //  Tell Phaser that we want it to scale up to whatever the browser can handle, but to do it proportionally
        myGame.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;

    }

    function create() {

        myGame.onRenderCallback = render;

    }

    function update() {


    }

    function render() {


    }

})();
