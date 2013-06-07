/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, null, null, null, render);
    function render() {
        game.input.pointer1.renderDebug();
        game.input.pointer2.renderDebug();
        game.input.pointer3.renderDebug();
        game.input.pointer4.renderDebug();
    }
})();
