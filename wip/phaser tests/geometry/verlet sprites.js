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
    var wheel;
    var diamond;
    var triangle;
    var cube;
    function create() {
        myGame.verlet.friction = 1;
        myGame.verlet.step = 32;
        wheel = myGame.verlet.createTire(new Phaser.Vector2(200, 50), 100, 30, 0.3, 0.9);
        wheel.loadGraphic('ball0');
        diamond = myGame.verlet.createTire(new Phaser.Vector2(400, 50), 70, 7, 0.1, 0.2);
        diamond.loadGraphic('ball1');
        triangle = myGame.verlet.createTire(new Phaser.Vector2(600, 50), 100, 3, 1, 1);
        triangle.loadGraphic('ball2');
        cube = myGame.verlet.createTire(new Phaser.Vector2(300, 50), 100, 4, 0.3, 0.9);
        cube.loadGraphic('ball3');
    }
    function update() {
    }
    function render() {
        myGame.verlet.render();
    }
})();
