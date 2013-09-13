/// <reference path="../../Phaser/_definitions.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, preload, create);

    function preload() {

        game.load.image('boss', 'assets/misc/boss1.png');
        game.load.spritesheet('button', 'assets/buttons/button_sprite_sheet.png', 193, 71);

    }

    var boss: Phaser.Sprite;
    var button: Phaser.UI.Button;

    function create() {

        //  For browsers that support it, this keeps our pixel art looking crisp
        Phaser.CanvasUtils.setSmoothingEnabled(game.stage.context, false);

        boss = game.add.sprite(game.stage.centerX, game.stage.centerY, 'boss');
        boss.origin.setTo(0.5, 0.5);

        //  Zoom in each time we press it
        button = game.add.button(32, 32, 'button', clickedIt, this, 2, 1, 0);

    }

    function clickedIt() {

        boss.scale.x += 0.5;
        boss.scale.y += 0.5;

    }

})();
