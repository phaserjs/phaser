/// <reference path="../../Phaser/Game.ts" />
(function () {
    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update, render);
    function init() {
        myGame.loader.addImageFile('ball0', 'assets/sprites/yellow_ball.png');
        myGame.loader.addImageFile('ball1', 'assets/sprites/aqua_ball.png');
        myGame.loader.addImageFile('ball2', 'assets/sprites/blue_ball.png');
        myGame.loader.addImageFile('ball3', 'assets/sprites/green_ball.png');
        myGame.loader.addImageFile('ball4', 'assets/sprites/red_ball.png');
        myGame.loader.addImageFile('ball5', 'assets/sprites/purple_ball.png');
        myGame.loader.load();
    }
    var balls;
    function create() {
        balls = myGame.add.group();
        myGame.input.onTap.add(tapped, this);
    }
    function tapped(pointer, doubleTap) {
        if(balls.countDead() > 0) {
            var tempBall = balls.getFirstDead();
            tempBall.revive();
            tempBall.x = pointer.x;
            tempBall.y = pointer.y;
        } else {
            var tempBall = new Phaser.Sprite(myGame, pointer.x, pointer.y, 'ball' + Math.round(Math.random() * 5));
            tempBall.setBoundsFromWorld(Phaser.GameObject.OUT_OF_BOUNDS_KILL);
            balls.add(tempBall);
        }
        tempBall.velocity.y = 150;
        if(doubleTap) {
            tempBall.scale.setTo(4, 4);
        }
    }
    function update() {
    }
    function render() {
        myGame.input.renderDebugInfo(16, 16);
    }
})();
