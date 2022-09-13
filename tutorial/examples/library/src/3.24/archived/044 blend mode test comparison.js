
var game = new Phaser.Game(800, 600, Phaser.WEBGL, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('bg', 'assets/skies/space1.png');
    game.load.image('particle', 'assets/particles/yellow.png');
    game.load.image('logo', 'assets/sprites/phaser2.png');

}

function between (min, max)
{
    return Math.floor(Math.random() * (max - min + 1) + min);
}

var sprites = [];

function create() {

    game.add.image(0, 0, 'bg');

    //  Create the sprites
    for (let i = 0; i < 1000; i++)
    {
        var x = between(-64, 800);
        var y = between(-64, 600);

        var image = game.add.image(x, y, 'particle');

        image.blendMode = Phaser.blendModes.ADD;

        sprites.push({ s: image, r: 2 + Math.random() * 6 });
    }

    var logo = game.add.image(game.world.centerX, game.world.centerY, 'logo');
    logo.anchor.set(0.5);

}

function update() {

    for (let i = 0; i < sprites.length; i++)
    {
        let sprite = sprites[i].s;

        sprite.y -= sprites[i].r;

        if (sprite.y < -256)
        {
            sprite.y = 700;
        }
    }

}