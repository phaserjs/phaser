
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create });

function preload() {

    game.load.image('bg', 'assets/pics/TheEnd_by_Iloe_and_Made.jpg');
    game.load.image('ball', 'assets/sprites/bsquadron3.png');

}

function create() {

    var bg = game.add.sprite(0, 0, 'bg', null, game.stage);
    bg.width = 800;
    bg.height = 600;

    //  Now let's create loads of sprites

    for (var i = 0; i < 100; i++)
    {
        //  64x62
        var x = Math.random() * (800-64);
        var y = Math.random() * (600-62);

        game.add.sprite(x, y, 'ball', null, game.stage);
    }

    //  This tells Phaser to only update the Canvas is one of the Game Objects is dirty,
    //  i.e. has moved position, alpha, frame, tint, etc. If none of them are dirty then
    //  the canvas is left as-is
    // game.renderer.dirtyRender = true;

}
