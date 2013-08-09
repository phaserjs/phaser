/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/ui/Button.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, preload, create, null, render);

    function preload() {
        game.load.spritesheet('button', 'assets/buttons/button_sprite_sheet.png', 193, 71);
    }

    var button;
    var secondCam;

    function create() {
        button = game.add.button(200, 400, 'button', clickedIt, this, 2, 1, 0);
        button.origin.setTo(0.5, 0.5);

        game.camera.width = 400;
        game.camera.texture.opaque = true;
        game.camera.texture.backgroundColor = 'rgb(100,0,0)';

        secondCam = game.add.camera(400, 0, 400, 600);
        secondCam.texture.opaque = true;
        secondCam.texture.backgroundColor = 'rgb(0,100,0)';
    }

    function render() {
        Phaser.DebugUtils.renderInputInfo(32, 32);
        Phaser.DebugUtils.renderSpriteWorldView(button, 32, 200);
    }

    function clickedIt() {
        button.rotation += 10;
    }
})();
