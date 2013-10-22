
//  Here is a custom game object
MonsterBunny = function (game, x, y, rotateSpeed) {

    Phaser.Sprite.call(this, game, x, y, 'bunny');

    this.rotateSpeed = rotateSpeed;

};

MonsterBunny.prototype = Object.create(Phaser.Sprite.prototype);
MonsterBunny.prototype.constructor = MonsterBunny;

/**
 * Automatically called by World.update
 */
MonsterBunny.prototype.update = function() {

    this.angle += this.rotateSpeed;

};

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create });

function preload() {

    game.load.image('bunny', 'assets/sprites/bunny.png');

}

function create() {

    var wabbit = new MonsterBunny(game, 200, 300, 1);
    wabbit.anchor.setTo(0.5, 0.5);

    var wabbit2 = new MonsterBunny(game, 600, 300, 0.5);
    wabbit2.anchor.setTo(0.5, 0.5);

    game.add.existing(wabbit);
    game.add.existing(wabbit2);

}
