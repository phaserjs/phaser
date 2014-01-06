//  Here is a custom group
//  It will automatically create 30 sprites of the given image when created.

MonsterGroup = function (game, image, action) {

    Phaser.Group.call(this, game);

    for (var i = 0; i < 30; i++)
    {
        var sprite = this.create(game.world.randomX, game.world.randomY, image);

        if (action == 'bounce')
        {
            game.add.tween(sprite).to({ y: sprite.y - 100 }, 2000, Phaser.Easing.Elastic.Out, true, 0, 1000, true);
        }
        else if (action == 'slide')
        {
            game.add.tween(sprite).to({ x: sprite.x + 200 }, 4000, Phaser.Easing.Elastic.Out, true, 0, 1000, true);
        }

    }

};

MonsterGroup.prototype = Object.create(Phaser.Group.prototype);
MonsterGroup.prototype.constructor = MonsterGroup;

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create });

var customGroup1;
var customGroup2;

function preload() {

    game.load.image('ufo', 'assets/sprites/ufo.png');
    game.load.image('baddie', 'assets/sprites/space-baddie.png');
    
}

function create() {

    customGroup1 = new MonsterGroup(game, 'ufo', 'bounce');
    customGroup2 = new MonsterGroup(game, 'baddie', 'slide');

}
