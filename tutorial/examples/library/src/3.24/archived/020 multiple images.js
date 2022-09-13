
var game = new Phaser.Game(800, 600, Phaser.WEBGL, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    //  40x88
    game.load.image('gem', 'assets/sprites/gem.png');

}

var images = [];
var s = 0;
var c = 0;

function create() {

    for (var i = 0; i < 20; i++)
    {
        var img = game.add.image(i * 40, 300, 'gem', 0, game.stage);

        img.data.s = 0;
        img.data.c = 0;

        images.push(img);
    }

}

function update () {

    for (var i = 0; i < images.length; i++)
    {
        images[i].data.c += 0.1;
        images[i].data.s = Math.sin(images[i].data.c) * (Math.cos(i) * 64);

        images[i].y = 200 + images[i].data.s;
    }

}
