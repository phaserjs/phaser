
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', {preload:preload,create: create });

function preload() {

    game.load.spritesheet('pig', 'assets/sprites/invaderpig.png', 124, 104);
    game.load.image('starfield', 'assets/misc/starfield.jpg');
    game.load.image('mushroom', 'assets/sprites/mushroom2.png');
    
}

var mushroom;
var pig;
var pigArrives;
var s;

function create() {

    game.add.tileSprite(0, 0, 800, 600, 'starfield');

    pig = game.add.sprite(-50, 200, 'pig', 1);

    pig.scale.setTo(0.5, 0.5);

    mushroom = game.add.sprite(380, 200, 'mushroom');
    mushroom.anchor.setTo(0.5, 0.5);

    pigArrives = game.add.tween(pig);
    
    pigArrives.to({x:150}, 1000, Phaser.Easing.Bounce.Out);
    pigArrives.onComplete.add(firstTween, this);
    pigArrives.start();

}

function firstTween() {

    s = game.add.tween(mushroom.scale);
    s.to({x: 2, y:2}, 1000, Phaser.Easing.Linear.None);
    s.onComplete.addOnce(theEnd, this);
    s.start();

}

function theEnd() {
    
    e = game.add.tween(pig);
    
    e.to({ x: -150 }, 1000, Phaser.Easing.Bounce.Out);
    e.start();

}
