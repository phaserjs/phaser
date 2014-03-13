
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.spritesheet('veg', 'assets/sprites/fruitnveg32wh37.png', 32, 32);
    
}

var veg;

function create() {

    //  Create a group
    veg = game.add.group();

    //  Add 20 sprites to it - the 'false' parameter sets them all to dead
    veg.createMultiple(20, 'veg', 0, false);

    //  Set-up a simple repeating timer
    game.time.events.repeat(Phaser.Timer.SECOND, 20, resurrect, this);
    
}

function resurrect() {

    //  Get a dead item
    var item = veg.getFirstDead();

    if (item)
    {
        //  And bring it back to life
        item.reset(game.world.randomX, game.world.randomY);

        //  This just changes its frame
        item.frame = game.rnd.integerInRange(0, 36);
    }

}

function update() {
}

function render() {

    game.debug.text('One item will be resurrected every second', 32, 32);
    game.debug.text('Living: ' + veg.countLiving() + '   Dead: ' + veg.countDead(), 32, 64);
    
}
