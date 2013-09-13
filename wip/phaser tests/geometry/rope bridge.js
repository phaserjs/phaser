/// <reference path="../../Phaser/Game.ts" />
(function () {
    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update, render);
    function init() {
        myGame.loader.addImageFile('ball5', 'assets/sprites/purple_ball.png');
        myGame.loader.load();
    }
    var segment;
    function create() {
        myGame.verlet.friction = 1;
        myGame.verlet.hideNearestEntityCircle = true;
        var points = [];
        var startX = 100;
        var startY = 200;
        var spacing = 20;
        for(var i = 0; i < 30; i++) {
            points.push(new Phaser.Vector2(startX + (i * spacing), startY));
        }
        segment = myGame.verlet.createLineSegments(points, 0.5);
        segment.loadGraphic('ball5');
        segment.hideConstraints = false;
        segment.pin(0);
        segment.pin(points.length - 1);
    }
    function update() {
    }
    function render() {
        myGame.verlet.render();
        //myGame.stage.context.fillStyle = 'rgb(255,255,0)';
        //myGame.stage.context.fillRect(p1.x, p1.y, 4, 4);
        //myGame.stage.context.fillStyle = 'rgb(255,0,0)';
        //myGame.stage.context.fillRect(p2.x, p2.y, 4, 4);
            }
})();
