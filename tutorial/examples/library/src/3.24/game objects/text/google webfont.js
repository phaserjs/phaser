var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('bg', 'assets/skies/gradient28.png');
    this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
}

function create ()
{
    this.add.image(400, 300, 'bg');

    var add = this.add;
    var input = this.input;

    WebFont.load({
        google: {
            families: [ 'Freckle Face', 'Finger Paint', 'Nosifer' ]
        },
        active: function ()
        {
            add.text(16, 0, 'The face of the\nmoon was in\nshadow.', { fontFamily: 'Freckle Face', fontSize: 80, color: '#ffffff' }).setShadow(2, 2, "#333333", 2, false, true);
            add.text(250, 450, 'Waves flung themselves\nat the blue evening.', { fontFamily: 'Finger Paint', fontSize: 40, color: '#5656ee' });

            var t = add.text(330, 200, 'R.I.P', { fontFamily: 'Nosifer', fontSize: 150, color: '#ff3434' });

            input.once('pointerdown', function () {
                t.setFontSize(64);
            });
        }
    });
}
