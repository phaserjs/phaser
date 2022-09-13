class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
        this.loadBar;
        this.text;
        this.t = 0.0;
    }

    preload ()
    {
        this.load.image('swirl', 'assets/pics/color-wheel-swirl.png');
        this.load.image('checker', 'assets/pics/checker.png');
        this.load.bitmapFont('gothic', 'assets/fonts/bitmap/gothic.png', 'assets/fonts/bitmap/gothic.xml');
    }

    create ()
    {

        this.loadBar = this.add.graphics();

        var checker = this.make.image({
            x: game.config.width / 2,
            y: game.config.height / 2,
            key: 'checker',
            add: true
        });


        var swirl = this.make.sprite({
            x: game.config.width / 2,
            y: game.config.height / 2,
            key: 'swirl',
            add: true
        });

        this.loadBar.x = game.config.width / 2;
        this.loadBar.y = game.config.height / 2;

        swirl.mask = new Phaser.Display.Masks.BitmapMask(this, this.loadBar);
        this.text = this.add.dynamicBitmapText(game.config.width / 2 - 20, game.config.height / 2 - 15, 'gothic', '0%', 32);
    }

    update ()
    {
        var step = Math.abs(Math.sin(this.t)) * 400;

        this.loadBar.clear();
        this.loadBar.lineStyle(40, 0, 1);
        this.loadBar.beginPath();
        this.loadBar.arc(0, 0, 100, 0, Phaser.Math.DegToRad(-step), false);
        this.loadBar.strokePath();
        this.loadBar.closePath();

        this.t += 0.01;

        this.text.setText((step / 400 * 100).toFixed(0) + '%')
    }
}

const config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 640,
    height: 480,
    scene: [ Example ]
};

const game = new Phaser.Game(config);

