
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

    // game.renderer.enableMultiTextureSupport(['bg', 'particle', 'logo']);

    game.add.image(0, 0, 'bg', 0, game.stage);

    var logo = game.add.image(400, 300, 'logo', 0, game.stage);
    logo.anchor = 0.5;

    //  Create the sprites
    for (var i = 0; i < 100; i++)
    {
        var x = between(-64, 800);
        var y = between(-64, 600);

        var image = game.add.image(x, y, 'particle', 0, game.stage);

        if (i === 0)
        {
            image.shader = 2;
        }

        // image.blendMode = Phaser.blendModes.ADD;

        sprites.push({ s: image, r: 2 + Math.random() * 6 });
    }

    var logo2 = game.add.image(400, 400, 'logo', 0, game.stage);
    logo2.anchor = 0.5;
    logo2.shader = 1;

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