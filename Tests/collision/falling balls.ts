/// <reference path="../../Phaser/Game.ts" />

(function () {

    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);

    function init() {

        myGame.loader.addImageFile('ball0', 'assets/sprites/yellow_ball.png');
        myGame.loader.addImageFile('ball1', 'assets/sprites/aqua_ball.png');
        myGame.loader.addImageFile('ball2', 'assets/sprites/blue_ball.png');
        myGame.loader.addImageFile('ball3', 'assets/sprites/green_ball.png');
        myGame.loader.addImageFile('ball4', 'assets/sprites/red_ball.png');
        myGame.loader.addImageFile('ball5', 'assets/sprites/purple_ball.png');
        myGame.loader.addImageFile('atari', 'assets/sprites/atari130xe.png');

        myGame.loader.load();

    }

    var atari: Phaser.Sprite;
    var balls: Phaser.Group;

    function create() {

        atari = myGame.createSprite(300, 450, 'atari');
        atari.immovable = true;

        balls = myGame.createGroup();

        for (var i = 0; i < 100; i++)
        {
            var tempBall: Phaser.Sprite = new Phaser.Sprite(myGame, Math.random() * myGame.stage.width, -32, 'ball' + Math.round(Math.random() * 5));
            tempBall.velocity.y = 100 + Math.random() * 150;
            tempBall.elasticity = 0.9;
            balls.add(tempBall);
        }

    }

    function update() {

        atari.velocity.x = 0;

        if (myGame.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            atari.velocity.x = -400;
        }
        else if (myGame.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            atari.velocity.x = 400;
        }

        balls.forEach(checkOffScreen, false);

        myGame.collide(atari, balls);

    }

    function checkOffScreen(ball:Phaser.Sprite) {

        if (ball.y < -32 || ball.y > myGame.stage.height || ball.x < 0 || ball.x > myGame.stage.width)
        {
            ball.x = Math.random() * myGame.stage.width;
            ball.y = -32;
            ball.velocity.x = 0;
            ball.velocity.y = 100 + Math.random() * 150;
        }

    }

})();
