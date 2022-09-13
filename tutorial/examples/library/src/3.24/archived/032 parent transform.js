
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, xrender: render });

function preload() {

    game.load.image('giant', 'assets/pics/giant.png');
    game.load.image('gem', 'assets/sprites/gem.png');

}

var parent;
var child;

function create() {

    // $('<input/>').attr({ type: 'text', id: 'd', value: 'bob' }).appendTo('#phaser-example');

    parent = game.add.sprite(200, 100, 'giant', null, game.stage);

    // parent.alpha = 0.5;

    child = game.add.image(50, 50, 'gem', null, parent);

    game.add.tween(parent).to( { scale: 2 }, 2000, 'Linear', true, 0, -1, true);
    game.add.tween(child).to( { angle: 360 }, 3000, 'Linear', true, 0, -1, true);

}

function render() {

    // $('#d').val(game.transforms.list.length.toString());
    // $('#d').val(game.transforms.processed.toString());

}