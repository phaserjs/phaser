/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, null, null, null, render);
    function render() {
        Phaser.DebugUtils.renderPointer(game.input.pointer1);
        Phaser.DebugUtils.renderPointer(game.input.pointer2);
        Phaser.DebugUtils.renderPointer(game.input.pointer3);
        Phaser.DebugUtils.renderPointer(game.input.pointer4);
    }
})();
