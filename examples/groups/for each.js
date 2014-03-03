
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

var baseAlphaIncSpeed = 0.006;

function preload() {
    game.load.spritesheet('item', 'assets/buttons/number-buttons-90x90.png', 90, 90);
}

function create() {

    for (var i = 0; i < 3; i++)
    {
        //  Note: alphaIncSpeed is a new property we're adding to Phaser.Sprite, not a pre-existing one
        game.add.sprite(290, 98 * (i + 1), 'item', i).alphaIncSpeed = baseAlphaIncSpeed * (i + 1);
        game.add.sprite(388, 98 * (i + 1), 'item', i + 3).alphaIncSpeed = baseAlphaIncSpeed * (i + 4);
    }

}

function update() {

    // Animating alpha property of each item using forEach() method.
    game.world.forEach(function(item) {

        // Update alpha first.
        item.alpha -= item.alphaIncSpeed;

        // Check for switch between increasing and descreasing.
        if (item.alpha < 0.001 || item.alpha > 0.999)
        {
            item.alphaIncSpeed *= -1;
        }
        
    });

}

function render() {

    game.debug.text('Alpha of items is always changing.', 280, 480);

}
