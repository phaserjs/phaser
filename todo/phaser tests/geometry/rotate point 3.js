/// <reference path="../../Phaser/Game.ts" />
(function () {
    var myGame = new Phaser.Game(this, 'game', 800, 600, null, create, update, render);
    var origin;
    var p1;
    var p2;
    var p3;
    var p4;
    var d = 0;
    function create() {
        //  This creates a box made up of 4 edge-points and rotates it around the origin
        origin = new Phaser.Point(400, 300);
        p1 = new Phaser.Point()// top left
        ;
        p2 = new Phaser.Point()// top right
        ;
        p3 = new Phaser.Point()// bottom right
        ;
        p4 = new Phaser.Point()// bottom left
        ;
    }
    function update() {
        //  top left (red)
        p1.rotate(origin.x, origin.y, myGame.math.wrapAngle(d), true, 200);
        //  top right (yellow)
        p2.rotate(origin.x, origin.y, myGame.math.wrapAngle(d + 90), true, 200);
        //  bottom right (aqua)
        p3.rotate(origin.x, origin.y, myGame.math.wrapAngle(d + 180), true, 200);
        //  bottom left (blue)
        p4.rotate(origin.x, origin.y, myGame.math.wrapAngle(d + 270), true, 200);
        d++;
    }
    function render() {
        //  Render the shape
        myGame.stage.context.beginPath();
        myGame.stage.context.fillStyle = 'rgba(0,255,0,0.2)';
        myGame.stage.context.strokeStyle = 'rgb(0,255,0)';
        myGame.stage.context.lineWidth = 1;
        myGame.stage.context.moveTo(p1.x, p1.y);
        myGame.stage.context.lineTo(p2.x, p2.y);
        myGame.stage.context.lineTo(p3.x, p3.y);
        myGame.stage.context.lineTo(p4.x, p4.y);
        myGame.stage.context.lineTo(p1.x, p1.y);
        myGame.stage.context.fill();
        myGame.stage.context.stroke();
        myGame.stage.context.closePath();
        //  Render the points
        myGame.stage.context.fillStyle = 'rgb(255,255,255)';
        myGame.stage.context.fillRect(origin.x, origin.y, 4, 4);
        myGame.stage.context.beginPath();
        myGame.stage.context.fillStyle = 'rgb(255,0,0)';
        myGame.stage.context.arc(p1.x, p1.y, 4, 0, Math.PI * 2);
        myGame.stage.context.fill();
        myGame.stage.context.closePath();
        myGame.stage.context.beginPath();
        myGame.stage.context.fillStyle = 'rgb(255,255,0)';
        myGame.stage.context.arc(p2.x, p2.y, 4, 0, Math.PI * 2);
        myGame.stage.context.fill();
        myGame.stage.context.closePath();
        myGame.stage.context.beginPath();
        myGame.stage.context.fillStyle = 'rgb(0,255,255)';
        myGame.stage.context.arc(p3.x, p3.y, 4, 0, Math.PI * 2);
        myGame.stage.context.fill();
        myGame.stage.context.closePath();
        myGame.stage.context.beginPath();
        myGame.stage.context.fillStyle = 'rgb(0,0,255)';
        myGame.stage.context.arc(p4.x, p4.y, 4, 0, Math.PI * 2);
        myGame.stage.context.fill();
        myGame.stage.context.closePath();
    }
})();
