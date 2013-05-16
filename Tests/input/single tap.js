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
        balls = myGame.createGroup();
        myGame.input.onTap.add(tapped, this);
        myGame.input.onDoubleTap.add(doubleTapped, this);
    }
    function doubleTapped(pointer) {
        var tempBall = new Phaser.Sprite(myGame, pointer.x, pointer.y, 'ball' + Math.round(Math.random() * 5));
        tempBall.outOfBoundsAction = Phaser.GameObject.OUT_OF_BOUNDS_KILL;
        tempBall.velocity.y = 100 + Math.random() * 150;
        tempBall.elasticity = 0.9;
        tempBall.scale.setTo(4, 4);
        balls.add(tempBall);
    }
    function tapped(pointer) {
        var tempBall = new Phaser.Sprite(myGame, pointer.x, pointer.y, 'ball' + Math.round(Math.random() * 5));
        tempBall.outOfBoundsAction = Phaser.GameObject.OUT_OF_BOUNDS_KILL;
        tempBall.velocity.y = 100 + Math.random() * 150;
        tempBall.elasticity = 0.9;
        balls.add(tempBall);
    }
    function update() {
    }
    function render() {
        myGame.input.renderDebugInfo(16, 16);
        //myGame.input.pointer1.renderDebug(true);
        //myGame.input.pointer2.renderDebug(true);
        //myGame.input.pointer3.renderDebug(true);
            }
})();
