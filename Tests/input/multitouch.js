/// <reference path="../../Phaser/Game.ts" />
(function () {
    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update, render);
    function init() {
        myGame.loader.addImageFile('dragonsun', 'assets/pics/cougar_dragonsun.png');
        myGame.loader.load();
    }
    function create() {
        console.log('dragons 8');
        myGame.input.onDown.add(test1, this);
    }
    function test1() {
        console.log('down');
    }
    function update() {
    }
    function render() {
        myGame.input.pointer1.renderDebug();
        myGame.input.pointer2.renderDebug();
        myGame.input.pointer3.renderDebug();
        myGame.input.pointer4.renderDebug();
    }
})();
