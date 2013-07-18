/// <reference path="../../Phaser/Game.ts" />
(function () {
    var myGame = new Phaser.Game(this, 'game', 800, 600, null, create, update, render);
    var p1;
    var p2;
    var p3;
    var p4;
    var d = 0;
    function create() {
        p1 = new Phaser.Point(myGame.stage.centerX, myGame.stage.centerY);
        p2 = new Phaser.Point(p1.x - 50, p1.y - 50);
        p3 = new Phaser.Point(p1.x - 100, p1.y - 100);
        p4 = new Phaser.Point(p1.x - 150, p1.y - 150);
    }
    function update() {
        p2.rotate(p1.x, p1.y, myGame.math.wrapAngle(d), true);
        p3.rotate(p1.x, p1.y, myGame.math.wrapAngle(d), true);
        p4.rotate(p1.x, p1.y, myGame.math.wrapAngle(d), true);
        d++;
    }
    function render() {
        myGame.stage.context.fillStyle = 'rgb(255,255,0)';
        myGame.stage.context.fillRect(p1.x, p1.y, 4, 4);
        myGame.stage.context.fillStyle = 'rgb(255,0,0)';
        myGame.stage.context.fillRect(p2.x, p2.y, 4, 4);
        myGame.stage.context.fillStyle = 'rgb(0,255,0)';
        myGame.stage.context.fillRect(p3.x, p3.y, 4, 4);
        myGame.stage.context.fillStyle = 'rgb(255,0,255)';
        myGame.stage.context.fillRect(p4.x, p4.y, 4, 4);
    }
})();
