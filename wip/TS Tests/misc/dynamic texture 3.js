(function() {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, null, render);

    // Pattern texture for tiling render to the stage later.
    var pattern;

    function init() {
        game.load.spritesheet('cat', 'assets/sprites/baddie_cat_1.png', 16, 16);
        game.load.start();
    }
    function create() {
        // Create a simple pattern first.
        pattern = game.add.dynamicTexture(64, 16);
        for (var i = 0; i < 4; i++) {
            pattern.fillRect(new Phaser.Rectangle(i * 16, 0, 8, 8), '#5b35c0');
            pattern.fillRect(new Phaser.Rectangle((i + 1) * 16 - 8, 8, 8, 8), '#5b35c0');
            pattern.fillRect(new Phaser.Rectangle((i + 1) * 16 - 8, 0, 8, 8), '#43baf3');
            pattern.fillRect(new Phaser.Rectangle(i * 16, 8, 8, 8), '#43baf3');
        }

        // Paste cat image to the texture, so the cat is on top of our pattern.
        pattern.pasteImage('cat');

        // Create a sprite with our result texture.
        var sprite = game.add.sprite(game.stage.centerX - 32, game.stage.centerY - 8);
        sprite.texture.loadDynamicTexture(pattern);
    }
    function render() {
        Phaser.DebugUtils.context.fillStyle = '#fff';
        Phaser.DebugUtils.context.fillText('Paste exist spritesheet to a DynamicTexture created on the fly.', 220, 450);
    }
})();
