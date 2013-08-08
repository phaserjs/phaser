/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/ui/Button.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, init, create, null, render);

    function init() {

        game.load.spritesheet('button', 'assets/buttons/button_sprite_sheet.png', 193, 71);
        game.load.start();

    }

    var button: Phaser.UI.Button;
    var secondCam: Phaser.Camera;

    function create() {

        button = game.add.button(100, 400, 'button', clickedIt, this, 2, 1, 0);

        game.camera.width = 400;
        //game.camera.rotation = 10;
        game.camera.texture.opaque = true;
        game.camera.texture.backgroundColor = 'rgb(100,0,0)';

        secondCam = game.add.camera(400, 0, 400, 600);
        secondCam.texture.opaque = true;
        secondCam.texture.backgroundColor = 'rgb(0,100,0)';

    }

    function render() {

        Phaser.DebugUtils.renderInputInfo(32, 32);

    }

    function clickedIt() {


    }

})();
