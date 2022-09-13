class SceneA extends Phaser.Scene {

    constructor ()
    {
        super('sceneA');

        this.hotdog;
    }

    preload ()
    {
        this.load.image('pic', 'assets/pics/case.jpg');
        this.load.image('hotdog', 'assets/sprites/hotdog.png');
    }

    create ()
    {
        this.add.image(400, 300, 'pic');

        var hotdog = this.add.image(400, 300, 'hotdog');

        this.add.text(10, 10, 'Scene A. Press arrows to move. Click to change Scene.', { font: '16px Courier', fill: '#00ff00' });

        this.input.keyboard.addCapture('UP, DOWN, LEFT, RIGHT')

        this.input.keyboard.on('keydown_UP', function (event) {

            hotdog.y -= 4;

        }, this);

        this.input.keyboard.on('keydown_DOWN', function (event) {

            hotdog.y += 4;

        }, this);

        this.input.keyboard.on('keydown_LEFT', function (event) {

            console.log('A left');
            hotdog.x -= 4;

        }, this);

        this.input.keyboard.on('keydown_RIGHT', function (event) {

            console.log('A right');
            hotdog.x += 4;

        }, this);

        this.input.on('pointerdown', function () {

            console.log('down');
            this.scene.pause();
            this.scene.run('sceneB');

        }, this);

        this.hotdog = hotdog;
    }

    update ()
    {
        this.hotdog.rotation += 0.001;
    }

}

class SceneB extends Phaser.Scene {

    constructor ()
    {
        super('sceneB');

        this.hotdog;
    }

    create ()
    {
        var graphics = this.add.graphics();

        graphics.fillStyle(0x000000, 0.5);
        graphics.fillRect(0, 0, 800, 600);

        this.add.text(10, 30, 'Scene B. Press arrows to move. Space to change Scene.', { font: '16px Courier', fill: '#00ff00' });

        var hotdog = this.add.image(400, 300, 'hotdog').setTint(0xff0000);

        this.input.keyboard.addCapture('UP, DOWN, LEFT, RIGHT');

        this.input.keyboard.on('keydown_UP', function (event) {

            hotdog.y -= 4;

        }, this);

        this.input.keyboard.on('keydown_DOWN', function (event) {

            hotdog.y += 4;

        }, this);

        this.input.keyboard.on('keydown_LEFT', function (event) {

            console.log('B left');
            hotdog.x -= 4;

        }, this);

        this.input.keyboard.on('keydown_RIGHT', function (event) {

            console.log('B right');
            hotdog.x += 4;

        }, this);

        this.input.keyboard.once('keydown_SPACE', function (event) {

            this.scene.stop();
            this.scene.resume('sceneA');

        }, this);

        this.hotdog = hotdog;
    }

}

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [ SceneA, SceneB ]
};

var game = new Phaser.Game(config);
