/// <reference path="../../Phaser/Game.ts" />
(function () {
    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update, render);
    function init() {
    }
    function create() {
        //  We lock the game to allowing only 1 Pointer active
        //  This means on multi-touch systems it will ignore any extra fingers placed down beyond the first
        myGame.input.maxPointers = 1;
    }
    function update() {
    }
    function render() {
        myGame.input.renderDebugInfo(16, 16);
        myGame.input.pointer1.renderDebug(true);
        myGame.input.pointer2.renderDebug(true);
        myGame.input.pointer3.renderDebug(true);
    }
})();
