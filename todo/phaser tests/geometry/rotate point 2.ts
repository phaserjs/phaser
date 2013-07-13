/// <reference path="../../Phaser/Game.ts" />

(function () {

    var myGame = new Phaser.Game(this, 'game', 800, 600, null, create, update, render);

    var p1:Phaser.Point;
    var p2:Phaser.Point;
    var p3:Phaser.Point;
    var p4:Phaser.Point;

    var d2: number = 0;
    var d3: number = 0;
    var d4: number = 0;

    function create() {

        p1 = new Phaser.Point(myGame.stage.centerX, myGame.stage.centerY);
        p2 = new Phaser.Point(p1.x - 50, p1.y - 50);
        p3 = new Phaser.Point(p2.x - 50, p2.y - 50);
        p4 = new Phaser.Point(p3.x - 50, p3.y - 50);

    }

    function update() {

        p2.rotate(p1.x, p1.y, myGame.math.wrapAngle(d2), true, 150);
        p3.rotate(p2.x, p2.y, myGame.math.wrapAngle(d3), true, 50);
        p4.rotate(p3.x, p3.y, myGame.math.wrapAngle(d4), true, 100);

        d2 += 1;
        d3 += 4;
        d4 += 6;

    }

    function render() {

        myGame.stage.context.strokeStyle = 'rgb(0,255,255)';
        myGame.stage.context.beginPath();
        myGame.stage.context.moveTo(p1.x, p1.y);
        myGame.stage.context.lineTo(p2.x, p2.y);
        myGame.stage.context.lineTo(p3.x, p3.y);
        myGame.stage.context.lineTo(p4.x, p4.y);
        myGame.stage.context.stroke();
        myGame.stage.context.closePath();

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
