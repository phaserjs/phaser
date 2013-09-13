/// <reference path="../../Phaser/Game.ts" />
(function () {
    var myGame = new Phaser.Game(this, 'game', 800, 600, null, create, update, render);
    var origin;
    var origin2;
    var points = [];
    var points2 = [];
    var d = 0;
    var d2 = 0;
    var m = 64;
    function create() {
        //  Let's have some fun :)
        origin = new Phaser.Point(300, 200);
        origin2 = new Phaser.Point(600, 350);
        for(var i = 0; i < m; i++) {
            points.push(new Phaser.Point());
            points2.push(new Phaser.Point());
        }
    }
    function update() {
        for(var i = 0; i < m; i++) {
            points[i].rotate(origin.x, origin.y, myGame.math.wrapAngle(d + (i * (360 / m))), true, i * 5);
            //points2[i].rotate(origin2.x, origin2.y, myGame.math.wrapAngle(d2 + (i * (360/m))), true, i * 10);
            //points[i].rotate(origin.x, origin.y, myGame.math.wrapAngle(d + (i * (360/m))), true, 200);
            points2[i].rotate(origin2.x, origin2.y, myGame.math.wrapAngle(d2 + (i * (360 / m))), true, 200);
        }
        d -= 2;
        d2 += 2;
    }
    function render() {
        //  Render the shape
        myGame.stage.context.save();
        //myGame.stage.context.globalCompositeOperation = 'xor';
        myGame.stage.context.globalCompositeOperation = 'lighter';
        myGame.stage.context.lineWidth = 20;
        for(var i = 0; i < m; i++) {
            myGame.stage.context.beginPath();
            myGame.stage.context.strokeStyle = 'rgba(255,' + Math.round(i * (255 / m)).toString() + ',0,1)';
            myGame.stage.context.moveTo(origin.x, origin.y);
            myGame.stage.context.lineTo(points[i].x, points[i].y);
            myGame.stage.context.stroke();
            myGame.stage.context.closePath();
        }
        for(var i = 0; i < m; i++) {
            myGame.stage.context.beginPath();
            myGame.stage.context.strokeStyle = 'rgba(0,' + Math.round(i * (255 / m)).toString() + ',255,1)';
            myGame.stage.context.moveTo(origin2.x, origin2.y);
            myGame.stage.context.lineTo(points2[i].x, points2[i].y);
            myGame.stage.context.stroke();
            myGame.stage.context.closePath();
        }
        myGame.stage.context.restore();
    }
})();
