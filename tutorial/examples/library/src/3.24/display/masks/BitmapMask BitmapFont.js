var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 640,
    height: 480,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload() {

    this.load.image('bunny', 'assets/sprites/bunny.png');
    this.load.image('phaser2', 'assets/sprites/phaser2.png');
    this.load.image('checker', 'assets/pics/checker.png');
    this.load.bitmapFont('desyrel', 'assets/fonts/bitmap/desyrel.png', 'assets/fonts/bitmap/desyrel.xml');

}

function create() {

    var checker = this.make.image({
        x: game.config.width / 2,
        y: game.config.height / 2,
        key: 'checker',
        add: true
    });

    var bunny = this.make.sprite({
        x: game.config.width / 2,
        y: game.config.height / 2,
        key: 'bunny',
        add: true
    });

    var phaser2 = this.add.dynamicBitmapText(60, 200, 'desyrel', 'PHASER', 72);

    phaser2.setDisplayCallback(textCallback);

    this.tweens.add({
        targets: phaser2,
        duration: 2000,
        delay: 2000,
        scaleX: 2,
        scaleY: 2,
        ease: 'Sine.easeInOut',
        repeat: -1,
        yoyo: true
    });

    phaser2.visible = false;

    bunny.mask = new Phaser.Display.Masks.BitmapMask(this, phaser2);

    this.input.on('pointermove', function (pointer) {

        phaser2.x = pointer.x;
        phaser2.y = pointer.y;

        phaser2.setText('PHASER\nX: ' + phaser2.x + '\nY: ' + phaser2.y);

    });

}

function textCallback (data)
{
    data.x = Phaser.Math.Between(data.x - 2, data.x + 2);
    data.y = Phaser.Math.Between(data.y - 4, data.y + 4);

    return data;
}