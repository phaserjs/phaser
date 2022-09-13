var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload()
{
    this.load.bitmapFont('ice', 'assets/fonts/bitmap/iceicebaby.png', 'assets/fonts/bitmap/iceicebaby.xml');
}

function create()
{
    var i = 0;
    var films = [ 'Aliens', 'Terminator', 'Star Wars', 'The Thing', 'Red Dawn', 'Commando', 'Terminator 2', 'Robocop', 'Batman', 'Street Fighter', 'Back to the Future' ];

    var text = this.add.bitmapText(400, 300, 'ice', films[i], 96).setOrigin(0.5);

    this.tweens.add({
        targets: text,
        duration: 2000,
        angle: 360,
        ease: 'Quad.easeInOut',
        repeat: -1,
        yoyo: true
    });

    this.input.on('pointerdown', function () {

        i++;

        if (i === films.length)
        {
            i = 0;
        }

        text.setText(films[i]);

    });
}
