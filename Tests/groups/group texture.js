/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, null, render);

    var robot;
    var eye, body, leftArm, rightArm, leftLeg, rightLeg;

    function init() {
        game.load.spritesheet('buttons', 'assets/buttons/number-buttons.png', 90, 90);
        game.load.start();
    }
    function create() {
        // Add 6 groups and childs.
        var item = game.add.group();
        item.texture.loadImage('buttons');
    }
    function render() {
        Phaser.DebugUtils.context.fillStyle = 'rgb(0, 160, 213)';
        Phaser.DebugUtils.context.fillText('Group can have a texture too, so you can use it just like a simple sprite.', 180, 380);
    }
})();
