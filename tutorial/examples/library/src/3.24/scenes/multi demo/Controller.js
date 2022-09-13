class Controller extends Phaser.Scene {

    constructor ()
    {
        super();

        this.count = 0;

        this.workbench;
        this.workbenchTitle;
        this.workbenchIcons;
    }

    preload ()
    {
        this.load.image('disk', 'assets/phaser3/disk.png');

        this.load.image('workbenchTitle', 'assets/phaser3/workbench-title.png');
        this.load.image('workbenchIcons', 'assets/phaser3/workbench-icons.png');
        this.load.image('demosWindow', 'assets/phaser3/demos-window.png');
        this.load.image('eyesIcon', 'assets/phaser3/eyes-icon.png');
        this.load.image('starsIcon', 'assets/phaser3/stars-icon.png');
        this.load.image('jugglerIcon', 'assets/phaser3/juggler-icon.png');
        this.load.image('twistIcon', 'assets/phaser3/twist-icon.png');
        this.load.image('invadersIcon', 'assets/phaser3/invaders-icon.png');
        this.load.image('clockIcon', 'assets/phaser3/clock-icon.png');
        this.load.image('boingIcon', 'assets/phaser3/boing-icon.png');

        this.load.image('starsWindow', 'assets/phaser3/stars-window.png');
        this.load.image('sineWindow', 'assets/phaser3/sinewave-window.png');
        this.load.image('eyesWindow', 'assets/phaser3/eyes-window.png');
        this.load.image('jugglerWindow', 'assets/phaser3/juggler-window.png');
        this.load.image('invadersWindow', 'assets/phaser3/invaders-window.png');
        this.load.image('clockWindow', 'assets/phaser3/clock-window.png');

        this.load.atlas('boing', 'assets/phaser3/boing.png', 'assets/phaser3/boing.json');

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
            key: 'boing',
            frames: this.anims.generateFrameNames('boing', { prefix: 'boing', start: 1, end: 14 }),
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

        this.workbench = this.add.graphics({ x: 16, y: 21 });

        this.workbench.fillStyle(0xffffff);
        this.workbench.fillRect(0, 0, this.sys.game.config.width - 105, 20);

        this.workbenchTitle = this.add.image(16, 21, 'workbenchTitle').setOrigin(0);
        this.workbenchIcons = this.add.image(this.sys.game.config.width - 87, 21, 'workbenchIcons').setOrigin(0);

        var disk = this.add.image(16, 64, 'disk').setOrigin(0).setInteractive();

        var demosWindow = this.add.image(0, 0, 'demosWindow').setOrigin(0);
        var eyesIcon = this.add.image(32, 34, 'eyesIcon', 0).setOrigin(0).setInteractive();
        var jugglerIcon = this.add.image(48, 110, 'jugglerIcon', 0).setOrigin(0).setInteractive();
        var starsIcon = this.add.image(230, 40, 'starsIcon', 0).setOrigin(0).setInteractive();
        var invadersIcon = this.add.image(120, 34, 'invadersIcon', 0).setOrigin(0).setInteractive();
        var clockIcon = this.add.image(240, 120, 'clockIcon', 0).setOrigin(0).setInteractive();
        var boingIcon = this.add.image(146, 128, 'boingIcon', 0).setOrigin(0).setInteractive();

        var demosContainer = this.add.container(32, 70, [ demosWindow, eyesIcon, jugglerIcon, starsIcon, invadersIcon, clockIcon, boingIcon ]);

        demosContainer.setVisible(false);

        demosContainer.setInteractive(new Phaser.Geom.Rectangle(0, 0, demosWindow.width, demosWindow.height), Phaser.Geom.Rectangle.Contains);

        this.input.setDraggable(demosContainer);

        demosContainer.on('drag', function (pointer, dragX, dragY) {

            this.x = dragX;
            this.y = dragY;

        });

        disk.once('pointerup', function () {

            demosContainer.setVisible(true);

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

        boingIcon.on('pointerup', function () {

            this.createWindow(Boing);

        }, this);


        this.events.on('resize', this.resize, this);
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

        this.workbench.clear();
        this.workbench.fillStyle(0xffffff);
        this.workbench.fillRect(0, 0, width - 105, 20);

        this.workbenchIcons.x = (width - 87);
    }

}
