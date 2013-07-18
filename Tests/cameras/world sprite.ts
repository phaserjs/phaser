/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/utils/DebugUtils.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update, render);

    function init() {

        game.world.setSize(1920, 1200, true);

        game.load.image('backdrop', 'assets/pics/remember-me.jpg');
        game.load.image('ball', 'assets/sprites/mana_card.png');

        game.load.start();

    }

    var ball: Phaser.Sprite;

    function create() {

        game.add.sprite(0, 0, 'backdrop');

        ball = game.add.sprite(200, 200, 'ball');

        ball.body.velocity.x = 50;
        ball.transform.scale.setTo(2, 2);

    }

    function update() {

        /*
        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            game.camera.x -= 4;
            //ball.x -= 4;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            game.camera.x += 4;
            //ball.x += 4;
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
        {
            game.camera.y -= 4;
            //ball.y -= 4;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
        {
            game.camera.y += 4;
            //ball.y += 4;
        }
        */

        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            ball.x -= 4;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            ball.x += 4;
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
        {
            ball.y -= 4;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
        {
            ball.y += 4;
        }

    }

    function render() {

        game.camera.renderDebugInfo(32, 32);
        Phaser.DebugUtils.renderSpriteInfo(ball, 32, 200);

    }

})();
