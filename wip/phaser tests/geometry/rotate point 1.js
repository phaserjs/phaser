/// <reference path="../../Phaser/Game.ts" />
(function () {
    var myGame = new Phaser.Game(this, 'game', 800, 600, null, create, update, render);
    var p1;
    var p2;
    var d = 0;
    function create() {
        p1 = new Phaser.Point(200, 300);
        p2 = new Phaser.Point(300, 300);
    }
    function update() {
        p1.rotate(p2.x, p2.y, myGame.math.wrapAngle(d), true);
        d++;
    }
    function render() {
        myGame.stage.context.fillStyle = 'rgb(255,255,0)';
        myGame.stage.context.fillRect(p1.x, p1.y, 4, 4);
        myGame.stage.context.fillStyle = 'rgb(255,0,0)';
        myGame.stage.context.fillRect(p2.x, p2.y, 4, 4);
    }
})();
