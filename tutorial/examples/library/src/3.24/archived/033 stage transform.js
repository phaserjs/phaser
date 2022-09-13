
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('giant', 'assets/pics/giant.png');
    game.load.image('gem', 'assets/sprites/gem.png');

}

function create() {

    //  Let's debug this
    $('<input/>').attr({ type: 'text', id: 'd', value: 'bob' }).appendTo('#phaser-example');

    var pic1 = game.add.image(0, 0, 'giant', null, game.stage);
    var pic2 = game.add.image(340, 0, 'giant', null, game.stage);
    var pic3 = game.add.image(0, 220, 'giant', null, game.stage);
    var pic4 = game.add.image(340, 220, 'giant', null, game.stage);

    pic1.name = 'pic1';
    pic2.name = 'pic2';
    pic3.name = 'pic3';
    pic4.name = 'pic4';

    game.add.tween(game.stage).to( { angle: 90 }, 2000, 'Linear', true, 0, -1, true);

}

function update() {

    $('#d').val(game.stage.angle);

}