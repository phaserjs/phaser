var SceneA = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneB ()
    {
        Phaser.Scene.call(this, 'sceneA');

        this.pic;
    },

    preload: function ()
    {
        this.load.image('arrow', 'assets/sprites/longarrow.png');
    },

    create: function ()
    {
        this.pic = this.add.image(400, 300, 'arrow').setOrigin(0, 0.5);

        this.input.once('pointerdown', function () {

            this.scene.switch('sceneB');

        }, this);
    },

    wake: function ()
    {
        this.input.once('pointerdown', function () {

            this.scene.switch('sceneB');

        }, this);
    },

    update: function (time, delta)
    {
        this.pic.rotation += 0.01;
    }

});

var SceneB = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneB ()
    {
        Phaser.Scene.call(this, 'sceneB');

        this.graphics;
        this.timerEvent;
        this.clockSize = 240;
    },

    preload: function ()
    {
        this.load.image('face', 'assets/pics/bw-face.png');
    },

    create: function ()
    {
        this.add.image(400, 300, 'face').setAlpha(0.5);

        this.timerEvent = this.time.addEvent({ delay: 8000, loop: true });

        this.graphics = this.add.graphics({ x: 0, y: 0 });

        this.input.once('pointedown', function (event) {

            this.scene.switch('sceneA');

        }, this);
    },

    wake: function ()
    {
        this.input.once('pointedown', function (event) {

            this.scene.switch('sceneA');

        }, this);
    },

    update: function ()
    {
        this.graphics.clear();

        this.drawClock(400, 300, this.timerEvent);
    },

    drawClock: function (x, y, timer)
    {
        //  Progress is between 0 and 1, where 0 = the hand pointing up and then rotating clockwise a full 360

        var graphics = this.graphics;
        var clockSize = this.clockSize;

        //  The frame
        graphics.lineStyle(6, 0xffffff, 1);
        graphics.strokeCircle(x, y, clockSize);

        var angle;
        var dest;
        var p1;
        var p2;
        var size;

        //  The overall progress hand (only if repeat > 0)
        if (timer.repeat > 0)
        {
            size = clockSize * 0.9;

            angle = (360 * timer.getOverallProgress()) - 90;
            dest = Phaser.Math.RotateAroundDistance({ x: x, y: y }, x, y, Phaser.Math.DegToRad(angle), size);

            graphics.lineStyle(2, 0xff0000, 1);

            graphics.beginPath();

            graphics.moveTo(x, y);

            p1 = Phaser.Math.RotateAroundDistance({ x: x, y: y }, x, y, Phaser.Math.DegToRad(angle - 5), size * 0.7);

            graphics.lineTo(p1.x, p1.y);
            graphics.lineTo(dest.x, dest.y);

            graphics.moveTo(x, y);

            p2 = Phaser.Math.RotateAroundDistance({ x: x, y: y }, x, y, Phaser.Math.DegToRad(angle + 5), size * 0.7);

            graphics.lineTo(p2.x, p2.y);
            graphics.lineTo(dest.x, dest.y);

            graphics.strokePath();
            graphics.closePath();
        }

        //  The current iteration hand
        size = clockSize * 0.95;

        angle = (360 * timer.getProgress()) - 90;
        dest = Phaser.Math.RotateAroundDistance({ x: x, y: y }, x, y, Phaser.Math.DegToRad(angle), size);

        graphics.lineStyle(2, 0xffff00, 1);

        graphics.beginPath();

        graphics.moveTo(x, y);

        p1 = Phaser.Math.RotateAroundDistance({ x: x, y: y }, x, y, Phaser.Math.DegToRad(angle - 5), size * 0.7);

        graphics.lineTo(p1.x, p1.y);
        graphics.lineTo(dest.x, dest.y);

        graphics.moveTo(x, y);

        p2 = Phaser.Math.RotateAroundDistance({ x: x, y: y }, x, y, Phaser.Math.DegToRad(angle + 5), size * 0.7);

        graphics.lineTo(p2.x, p2.y);
        graphics.lineTo(dest.x, dest.y);

        graphics.strokePath();
        graphics.closePath();
    }

});

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    scene: [ SceneA, SceneB ]
};

var game = new Phaser.Game(config);
