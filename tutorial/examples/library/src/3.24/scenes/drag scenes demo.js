class Controller extends Phaser.Scene {

    constructor ()
    {
        super();

        this.count = 0;
    }

    preload ()
    {
        this.load.image('bg', 'assets/phaser3/workbench.png');
        this.load.image('demosWindow', 'assets/phaser3/demos-window.png');
        this.load.image('eyesIcon', 'assets/phaser3/eyes-icon.png');
        this.load.image('starsIcon', 'assets/phaser3/stars-icon.png');
        this.load.image('jugglerIcon', 'assets/phaser3/juggler-icon.png');
        this.load.image('twistIcon', 'assets/phaser3/twist-icon.png');
        this.load.image('invadersIcon', 'assets/phaser3/invaders-icon.png');
        this.load.image('clockIcon', 'assets/phaser3/clock-icon.png');

        this.load.image('starsWindow', 'assets/phaser3/stars-window.png');
        this.load.image('sineWindow', 'assets/phaser3/sinewave-window.png');
        this.load.image('eyesWindow', 'assets/phaser3/eyes-window.png');
        this.load.image('jugglerWindow', 'assets/phaser3/juggler-window.png');
        this.load.image('invadersWindow', 'assets/phaser3/invaders-window.png');
        this.load.image('clockWindow', 'assets/phaser3/clock-window.png');

        this.load.spritesheet('juggler', 'assets/phaser3/juggler.png', { frameWidth: 128, frameHeight: 184 });
        this.load.image('star', 'assets/phaser3/star2.png');
        this.load.image('eye', 'assets/phaser3/eye.png');

        this.load.image('invaders.boom', 'assets/games/multi/boom.png');
        this.load.image('invaders.bullet', 'assets/games/multi/bullet.png', { frameWidth: 12, frameHeight: 14 });
        this.load.image('invaders.bullet2', 'assets/games/multi/bullet2.png');
        this.load.image('invaders.explode', 'assets/games/multi/explode.png');
        this.load.spritesheet('invaders.invader1', 'assets/games/multi/invader1.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('invaders.invader2', 'assets/games/multi/invader2.png', { frameWidth: 22, frameHeight: 16 });
        this.load.spritesheet('invaders.invader3', 'assets/games/multi/invader3.png', { frameWidth: 24, frameHeight: 16 });
        this.load.image('invaders.mothership', 'assets/games/multi/mothership.png');
        this.load.image('invaders.ship', 'assets/games/multi/ship.png');
    }

    create ()
    {
        //  Create animations

        this.anims.create({
            key: 'juggler',
            frames: this.anims.generateFrameNumbers('juggler'),
            frameRate: 28,
            repeat: -1
        });

        this.anims.create({
            key: 'bullet',
            frames: this.anims.generateFrameNumbers('invaders.bullet'),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'invader1',
            frames: this.anims.generateFrameNumbers('invaders.invader1'),
            frameRate: 2,
            repeat: -1
        });

        this.anims.create({
            key: 'invader2',
            frames: this.anims.generateFrameNumbers('invaders.invader2'),
            frameRate: 2,
            repeat: -1
        });

        this.anims.create({
            key: 'invader3',
            frames: this.anims.generateFrameNumbers('invaders.invader3'),
            frameRate: 2,
            repeat: -1
        });

        this.add.image(0, 0, 'bg').setOrigin(0);

        var demosWindow = this.add.image(0, 0, 'demosWindow').setOrigin(0);
        var eyesIcon = this.add.image(32, 34, 'eyesIcon', 0).setOrigin(0).setInteractive();
        var jugglerIcon = this.add.image(64, 110, 'jugglerIcon', 0).setOrigin(0).setInteractive();
        var starsIcon = this.add.image(230, 40, 'starsIcon', 0).setOrigin(0).setInteractive();
        var invadersIcon = this.add.image(120, 34, 'invadersIcon', 0).setOrigin(0).setInteractive();
        var clockIcon = this.add.image(200, 120, 'clockIcon', 0).setOrigin(0).setInteractive();

        var demosContainer = this.add.container(32, 70, [ demosWindow, eyesIcon, jugglerIcon, starsIcon, invadersIcon, clockIcon ]);

        demosContainer.setInteractive(new Phaser.Geom.Rectangle(0, 0, demosWindow.width, demosWindow.height), Phaser.Geom.Rectangle.Contains);

        this.input.setDraggable(demosContainer);

        demosContainer.on('drag', function (pointer, dragX, dragY) {

            this.x = dragX;
            this.y = dragY;

        });

        eyesIcon.on('pointerup', function () {

            this.createWindow(Eyes);

        }, this);

        jugglerIcon.on('pointerup', function () {

            this.createWindow(Juggler);

        }, this);

        starsIcon.on('pointerup', function () {

            this.createWindow(Stars);

        }, this);

        invadersIcon.on('pointerup', function () {

            this.createWindow(Invaders);

        }, this);

        clockIcon.on('pointerup', function () {

            this.createWindow(Clock);

        }, this);
    }

    createWindow (func)
    {
        var x = Phaser.Math.Between(400, 600);
        var y = Phaser.Math.Between(64, 128);

        var handle = 'window' + this.count++;

        var win = this.add.zone(x, y, func.WIDTH, func.HEIGHT).setInteractive().setOrigin(0);

        var demo = new func(handle, win);

        this.input.setDraggable(win);

        win.on('drag', function (pointer, dragX, dragY) {

            this.x = dragX;
            this.y = dragY;

            demo.refresh()

        });

        this.scene.add(handle, demo, true);
    }

    resize (width, height)
    {
        if (width === undefined) { width = this.game.config.width; }
        if (height === undefined) { height = this.game.config.height; }

        this.cameras.resize(width, height);
    }

}

class Juggler extends Phaser.Scene {

    constructor (handle, parent)
    {
        super(handle);

        this.parent = parent;
    }

    create ()
    {
        var bg = this.add.image(0, 0, 'jugglerWindow').setOrigin(0);

        this.cameras.main.setViewport(this.parent.x, this.parent.y, Juggler.WIDTH, Juggler.HEIGHT);

        this.add.sprite(100, 22, 'juggler').setOrigin(0).play('juggler');
    }

    refresh ()
    {
        this.cameras.main.setPosition(this.parent.x, this.parent.y);

        this.scene.bringToTop();
    }

}

Juggler.WIDTH = 328;
Juggler.HEIGHT = 226;

class Stars extends Phaser.Scene {

    constructor (handle, parent)
    {
        super(handle);

        this.parent = parent;

        this.blitter;

        this.width = 320;
        this.height = 220;
        this.depth = 1700;
        this.distance = 200;
        this.speed = 6;

        this.max = 300;
        this.xx = [];
        this.yy = [];
        this.zz = [];
    }

    create ()
    {
        this.cameras.main.setViewport(this.parent.x, this.parent.y, Stars.WIDTH, Stars.HEIGHT);
        this.cameras.main.setBackgroundColor(0x000000);

        this.blitter = this.add.blitter(0, 0, 'star');

        for (var i = 0; i < this.max; i++)
        {
            this.xx[i] = Math.floor(Math.random() * this.width) - (this.width / 2);
            this.yy[i] = Math.floor(Math.random() * this.height) - (this.height / 2);
            this.zz[i] = Math.floor(Math.random() * this.depth) - 100;

            var perspective = this.distance / (this.distance - this.zz[i]);
            var x = (this.width / 2) + this.xx[i] * perspective;
            var y = (this.height / 2) + this.yy[i] * perspective;
            var a = (x < 0 || x > 320 || y < 20 || y > 260) ? 0 : 1;

            this.blitter.create(x, y);
        }

        var bg = this.add.image(0, 0, 'starsWindow').setOrigin(0);
    }

    update (time, delta)
    {
        var list = this.blitter.children.list;

        for (var i = 0; i < this.max; i++)
        {
            var perspective = this.distance / (this.distance - this.zz[i]);

            var x = (this.width / 2) + this.xx[i] * perspective;
            var y = (this.height / 2) + this.yy[i] * perspective;

            this.zz[i] += this.speed;

            if (this.zz[i] > this.distance)
            {
                this.zz[i] -= (this.distance * 2);
            }

            list[i].x = x;
            list[i].y = y;
            list[i].a = (x < 0 || x > 320 || y < 20 || y > 260) ? 0 : 1;
        }
    }

    refresh ()
    {
        this.cameras.main.setPosition(this.parent.x, this.parent.y);

        this.scene.bringToTop();
    }

}

Stars.WIDTH = 328;
Stars.HEIGHT = 266;

class Eyes extends Phaser.Scene {

    constructor (handle, parent)
    {
        super(handle);

        this.parent = parent;

        this.left;
        this.right;

        this.leftTarget;
        this.rightTarget;

        this.leftBase;
        this.rightBase;

        this.mid = new Phaser.Math.Vector2();
    }

    create ()
    {
        var bg = this.add.image(0, 0, 'eyesWindow').setOrigin(0);

        this.cameras.main.setViewport(this.parent.x, this.parent.y, Eyes.WIDTH, Eyes.HEIGHT);

        this.left = this.add.image(46, 92, 'eye');
        this.right = this.add.image(140, 92, 'eye');

        this.leftTarget = new Phaser.Geom.Line(this.left.x, this.left.y, 0, 0);
        this.rightTarget = new Phaser.Geom.Line(this.right.x, this.right.y, 0, 0);

        this.leftBase = new Phaser.Geom.Ellipse(this.left.x, this.left.y, 24, 40);
        this.rightBase = new Phaser.Geom.Ellipse(this.right.x, this.right.y, 24, 40);
    }

    update ()
    {
        this.leftTarget.x2 = this.input.activePointer.x - this.parent.x;
        this.leftTarget.y2 = this.input.activePointer.y - this.parent.y;

        //  Within the left eye?
        if (this.leftBase.contains(this.leftTarget.x2, this.leftTarget.y2))
        {
            this.mid.x = this.leftTarget.x2;
            this.mid.y = this.leftTarget.y2;
        }
        else
        {
            Phaser.Geom.Ellipse.CircumferencePoint(this.leftBase, Phaser.Geom.Line.Angle(this.leftTarget), this.mid);
        }

        this.left.x = this.mid.x;
        this.left.y = this.mid.y;

        this.rightTarget.x2 = this.input.activePointer.x - this.parent.x;
        this.rightTarget.y2 = this.input.activePointer.y - this.parent.y;

        //  Within the right eye?
        if (this.rightBase.contains(this.rightTarget.x2, this.rightTarget.y2))
        {
            this.mid.x = this.rightTarget.x2;
            this.mid.y = this.rightTarget.y2;
        }
        else
        {
            Phaser.Geom.Ellipse.CircumferencePoint(this.rightBase, Phaser.Geom.Line.Angle(this.rightTarget), this.mid);
        }

        this.right.x = this.mid.x;
        this.right.y = this.mid.y;
    }

    refresh ()
    {
        this.cameras.main.setPosition(this.parent.x, this.parent.y);

        this.scene.bringToTop();
    }

}

Eyes.WIDTH = 183;
Eyes.HEIGHT = 162;

class Invaders extends Phaser.Scene {

    constructor (handle, parent)
    {
        super(handle);

        this.parent = parent;

        this.left;
        this.right;

        this.ship;

        this.invaders;
        this.mothership;
        this.bullet;

        this.topLeft;
        this.bottomRight;

        this.bulletTimer;
        this.mothershipTimer;

        this.isGameOver = false;

        this.invadersBounds = { x: 12, y: 62, right: 152 };
    }

    create (config)
    {
        this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        this.physics.world.setBounds(4, 22, 400, 300);

        this.cameras.main.setViewport(this.parent.x, this.parent.y, Invaders.WIDTH, Invaders.HEIGHT);
        this.cameras.main.setBackgroundColor('#000');

        this.createInvaders();

        this.bullet = this.physics.add.image(200, 290, 'invaders.bullet2');

        this.mothership = this.physics.add.image(500, 40, 'invaders.mothership');

        this.ship = this.physics.add.image(200, 312, 'invaders.ship');

        var bg = this.add.image(0, 0, 'invadersWindow').setOrigin(0);

        this.ship.setCollideWorldBounds(true);

        this.physics.add.overlap(this.bullet, this.invaders, this.bulletHit, null, this);
        this.physics.add.overlap(this.bullet, this.mothership, this.bulletHitMothership, null, this);

        this.launchBullet();

        this.mothershipTimer = this.time.addEvent({ delay: 10000, callback: this.launchMothership, callbackScope: this, repeat: -1 });

        this.invaders.setVelocityX(50);
    }

    launchMothership ()
    {
        this.mothership.setVelocityX(-100);
    }

    bulletHit (bullet, invader)
    {
        this.launchBullet();

        invader.body.enable = false;

        this.invaders.killAndHide(invader);

        this.refreshOutliers();
    }

    bulletHitMothership (bullet, mothership)
    {
        this.launchBullet();

        this.mothership.body.reset(500, 40);
    }

    refreshOutliers ()
    {
        var list = this.invaders.getChildren();

        var first = this.invaders.getFirst(true);
        var last = this.invaders.getLast(true);

        for (var i = 0; i < list.length; i++)
        {
            var vader = list[i];

            if (vader.active)
            {
                if (vader.x < first.x)
                {
                    first = vader;
                }
                else if (vader.x > last.x)
                {
                    last = vader;
                }
            }
        }

        this.topLeft = first;
        this.bottomRight = last;
    }

    launchBullet ()
    {
        this.bullet.body.reset(this.ship.x, this.ship.y);

        this.bullet.body.velocity.y = -400;
    }

    createInvaders ()
    {
        this.invaders = this.physics.add.group();

        var x = this.invadersBounds.x;
        var y = this.invadersBounds.y;

        for (var i = 0; i < 10; i++)
        {
            this.invaders.create(x, y, 'invaders.invader1').setTint(0xff0000).play('invader1');

            x += 26;
        }

        x = this.invadersBounds.x;
        y += 28

        for (var i = 0; i < 16; i++)
        {
            this.invaders.create(x, y, 'invaders.invader2').setTint(0x00ff00).play('invader2');

            x += 33;

            if (i === 7)
            {
                x = this.invadersBounds.x;
                y += 28;
            }
        }

        x = this.invadersBounds.x;
        y += 28

        for (var i = 0; i < 14; i++)
        {
            this.invaders.create(x, y, 'invaders.invader3').setTint(0x00ffff).play('invader3');

            x += 38;

            if (i === 6)
            {
                x = this.invadersBounds.x;
                y += 28;
            }
        }

        //  We can use these markers to work out where the whole Group is and how wide it is
        this.topLeft = this.invaders.getFirst(true);
        this.bottomRight = this.invaders.getLast(true);
    }

    refresh ()
    {
        this.cameras.main.setPosition(this.parent.x, this.parent.y);

        this.scene.bringToTop();
    }

    gameOver ()
    {
        this.invaders.setVelocityX(0);

        this.ship.setVisible(false);

        this.bullet.setVisible(false);

        this.isGameOver = true;
    }

    update ()
    {
        if (this.isGameOver)
        {
            return;
        }

        if (this.left.isDown)
        {
            this.ship.body.velocity.x = -400;
        }
        else if (this.right.isDown)
        {
            this.ship.body.velocity.x = 400;
        }
        else
        {
            this.ship.body.velocity.x = 0;
        }

        //  Bullet bounds
        if (this.bullet.y < -32)
        {
            this.launchBullet();
        }

        //  Invaders bounds

        var moveDown = false;

        if (this.bottomRight.body.velocity.x > 0 && this.bottomRight.x >= 390)
        {
            this.invaders.setVelocityX(-50);
            moveDown = true;
        }
        else if (this.topLeft.body.velocity.x < 0 && this.topLeft.x <= 12)
        {
            this.invaders.setVelocityX(50);
            moveDown = true;
        }

        if (moveDown)
        {
            var list = this.invaders.getChildren();
            var lowest = 0;

            for (var i = 0; i < list.length; i++)
            {
                var vader = list[i];

                vader.body.y += 4;

                if (vader.active && vader.body.y > lowest)
                {
                    lowest = vader.body.y;
                }
            }

            if (lowest > 240)
            {
                this.gameOver();
            }
        }
    }

}

Invaders.WIDTH = 408;
Invaders.HEIGHT = 326;

class Clock extends Phaser.Scene {

    constructor (handle, parent)
    {
        super(handle);

        this.parent = parent;

        this.graphics;
        this.clockSize = 120;
    }

    create ()
    {
        var bg = this.add.image(0, 0, 'clockWindow').setOrigin(0);

        this.cameras.main.setViewport(this.parent.x, this.parent.y, Clock.WIDTH, Clock.HEIGHT);
        this.cameras.main.setBackgroundColor(0x0055aa);

        this.graphics = this.add.graphics();
    }

    update ()
    {
        var graphics = this.graphics;
        var timer = this.timerEvent;
        var clockSize = this.clockSize;
        var x = Clock.WIDTH / 2;
        var y = 8 + Clock.HEIGHT / 2;

        graphics.clear();

        //  Progress is between 0 and 1, where 0 = the hand pointing up and then rotating clockwise a full 360

        //  The frame
        graphics.fillStyle(0xffffff, 1);
        graphics.lineStyle(3, 0x000000, 1);
        graphics.fillCircle(x, y, clockSize);
        graphics.strokeCircle(x, y, clockSize);

        var angle;
        var dest;
        var p1;
        var p2;
        var size;

        var date = new Date;
        var seconds = date.getSeconds() / 60;
        var mins = date.getMinutes() / 60;
        var hours = date.getHours() / 24;

        //  The hours hand
        size = clockSize * 0.9;

        angle = (360 * hours) - 90;
        dest = Phaser.Math.RotateAroundDistance({ x: x, y: y }, x, y, Phaser.Math.DegToRad(angle), size);

        graphics.fillStyle(0x000000, 1);

        graphics.beginPath();

        graphics.moveTo(x, y);

        p1 = Phaser.Math.RotateAroundDistance({ x: x, y: y }, x, y, Phaser.Math.DegToRad(angle - 5), size * 0.7);

        graphics.lineTo(p1.x, p1.y);
        graphics.lineTo(dest.x, dest.y);

        graphics.moveTo(x, y);

        p2 = Phaser.Math.RotateAroundDistance({ x: x, y: y }, x, y, Phaser.Math.DegToRad(angle + 5), size * 0.7);

        graphics.lineTo(p2.x, p2.y);
        graphics.lineTo(dest.x, dest.y);

        graphics.fillPath();
        graphics.closePath();

        //  The minutes hand
        size = clockSize * 0.9;

        angle = (360 * mins) - 90;
        dest = Phaser.Math.RotateAroundDistance({ x: x, y: y }, x, y, Phaser.Math.DegToRad(angle), size);

        graphics.fillStyle(0x000000, 1);

        graphics.beginPath();

        graphics.moveTo(x, y);

        p1 = Phaser.Math.RotateAroundDistance({ x: x, y: y }, x, y, Phaser.Math.DegToRad(angle - 5), size * 0.7);

        graphics.lineTo(p1.x, p1.y);
        graphics.lineTo(dest.x, dest.y);

        graphics.moveTo(x, y);

        p2 = Phaser.Math.RotateAroundDistance({ x: x, y: y }, x, y, Phaser.Math.DegToRad(angle + 5), size * 0.7);

        graphics.lineTo(p2.x, p2.y);
        graphics.lineTo(dest.x, dest.y);

        graphics.fillPath();
        graphics.closePath();

        //  The seconds hand
        size = clockSize * 0.9;

        angle = (360 * seconds) - 90;
        dest = Phaser.Math.RotateAroundDistance({ x: x, y: y }, x, y, Phaser.Math.DegToRad(angle), size);

        graphics.fillStyle(0xff0000, 1);

        graphics.beginPath();

        graphics.moveTo(x, y);

        p1 = Phaser.Math.RotateAroundDistance({ x: x, y: y }, x, y, Phaser.Math.DegToRad(angle - 5), size * 0.3);

        graphics.lineTo(p1.x, p1.y);
        graphics.lineTo(dest.x, dest.y);

        graphics.moveTo(x, y);

        p2 = Phaser.Math.RotateAroundDistance({ x: x, y: y }, x, y, Phaser.Math.DegToRad(angle + 5), size * 0.3);

        graphics.lineTo(p2.x, p2.y);
        graphics.lineTo(dest.x, dest.y);

        graphics.fillPath();
        graphics.closePath();

    }

    refresh ()
    {
        this.cameras.main.setPosition(this.parent.x, this.parent.y);

        this.scene.bringToTop();
    }

}

Clock.WIDTH = 275;
Clock.HEIGHT = 276;

var config = {
    type: Phaser.WEBGL,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#0055aa',
    parent: 'phaser-example',
    scene: Controller,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 }
        }
    }
};

var game = new Phaser.Game(config);

window.addEventListener('resize', function (event) {

    game.resize(window.innerWidth, window.innerHeight);

}, false);
