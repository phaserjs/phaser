var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    },
    width: 800,
    height: 600
};

var game = new Phaser.Game(config);

var bunny0;
var bunny1;
var logo;
var bg;
var rt;
var mousedown = false;

function preload() {

    this.load.image('logo', 'assets/sprites/phaser1.png');
    this.load.image('bunny', 'assets/sprites/bunny.png');
    this.load.image('bg', 'assets/pics/platformer-backdrop.png');
    this.load.image('checker', 'assets/pics/checker.png');

}

function create() {

    bg = this.add.sprite(400, 300, 'bg').setOrigin(0.5).setScale(2.5);
    logo = this.make.sprite({key:'logo', add: false});
    rt = this.make.renderTexture({x: 0, y: 0, width: 800, height: 600, add: false}).setOrigin(0.0);
    bunny1 = this.add.sprite(400, 300, 'bunny').setTint(0x000000);
    checker = this.add.sprite(400, 300, 'checker');
    bunny0 = this.add.sprite(400, 300, 'bunny');

    bunny0.mask = new Phaser.Display.Masks.BitmapMask(this, rt);
    bunny0.mask.invertAlpha = true;
    checker.mask = new Phaser.Display.Masks.BitmapMask(this, bunny1);

    this.input.on('pointerdown', function (event) {
        mousedown = true;
    }, this);

    this.input.on('pointerup', function (event) {
        mousedown = false;
    }, this);

    this.input.on('pointermove', function (event) {
        if (mousedown)
        {
            rt.save();
            rt.translate(event.x, event.y);
            rt.scale(0.25, 0.25);
            if (event.buttons === 4)
            {
                rt.draw(bunny0.texture, bunny0.frame, -bunny0.width / 2, -bunny0.height / 2);
            }
            else
            {
                rt.draw(logo.texture, logo.frame, -logo.width / 2, -logo.height / 2);
            }
            rt.restore();
        }
    }, this);

}

