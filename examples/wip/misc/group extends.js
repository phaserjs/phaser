
//  Here is a custom group with a property 'key'
//  This isn't required, it's just an example of a custom group level property. Only 'game' is required.
MonsterGroup = function (game, key) {

    Phaser.Group.call(this, game);

    this.key = key;

};

MonsterGroup.prototype = Object.create(Phaser.Group.prototype);
MonsterGroup.prototype.constructor = MonsterGroup;

/**
 * Generate some monsters on request, all spaced out evenly
 */
MonsterGroup.prototype.make = function(qty, x, y) {

    for (var i = 0; i < qty; i++)
    {
        this.create(x, y, this.key);
        x += 64;
    }

}

//  Boilerplate code below

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create });

function preload() {

    game.load.image('bunny', 'assets/sprites/bunny.png');
    game.load.image('ball', 'assets/sprites/shinyball.png');

}

function create() {

    var monsters = new MonsterGroup(game, 'bunny');
    var balls = new MonsterGroup(game, 'ball');

    monsters.make(6, 100, 100);
    balls.make(10, 64, 500);

}
