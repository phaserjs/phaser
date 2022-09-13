
var game = new Phaser.Game(800, 600, Phaser.WEBGL, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('bg', 'assets/skies/space1.png');
    game.load.image('particle', 'assets/sprites/aqua_ball.png');
    game.load.image('logo', 'assets/sprites/phaser2.png');

}

function between (min, max)
{
    return Math.floor(Math.random() * (max - min + 1) + min);
}

var sprites = [];

function create() {

    var logo = game.add.image(400, 200, 'logo', 0, game.stage);
    logo.anchor = 0.5;

    var logo2 = game.add.image(400, 300, 'logo', 0, game.stage);
    logo2.anchor = 0.5;
    logo2.shader = 2;

    var logo3 = game.add.image(400, 400, 'logo', 0, game.stage);
    logo3.anchor = 0.5;
    logo3.shader = 1;

}

function update() {

    for (var i = 0; i < sprites.length; i++)
    {
        var sprite = sprites[i].s;

        sprite.y -= sprites[i].r;

        if (sprite.y < -256)
        {
            sprite.y = 700;
        }
    }

}