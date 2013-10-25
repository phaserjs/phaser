
MonsterBunny = function (game, rotateSpeed) {

    //  We call the Phaser.Sprite passing in the game reference
    //  We're giving it a random X/Y position here, just for the sake of this demo - you could also pass the x/y in the constructor
    Phaser.Sprite.call(this, game, game.world.randomX, game.world.randomY, 'bunny');

    this.anchor.setTo(0.5, 0.5);

    this.rotateSpeed = rotateSpeed;

    var randomScale = 0.1 + Math.random();

    this.scale.setTo(randomScale, randomScale)

    game.add.existing(this);

};

MonsterBunny.prototype = Object.create(Phaser.Sprite.prototype);
MonsterBunny.prototype.constructor = MonsterBunny;

MonsterBunny.prototype.update = function() {

    //  Automatically called by World.update
    this.angle += this.rotateSpeed;

};

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create });

function preload() {

    game.load.image('bunny', 'assets/sprites/bunny.png');

}

function create() {

    for (var i = 0.1; i < 2; i += 0.1)
    {
        new MonsterBunny(game, i);
    }

}
