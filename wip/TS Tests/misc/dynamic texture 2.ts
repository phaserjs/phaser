(function() {
    var game = new Phaser.Game(this, 'game', 800, 600, null, create, null, render);

    // Pattern texture for tiling render to the stage later.
    var pattern: Phaser.DynamicTexture;

    function create() {
        // Create a simple pattern texture.
        pattern = game.add.dynamicTexture(96, 96);
        pattern.fillRect(new Phaser.Rectangle(0, 0, 48, 48), '#5b35c0');
        pattern.fillRect(new Phaser.Rectangle(48, 48, 48, 48), '#5b35c0');
        pattern.fillRect(new Phaser.Rectangle(48, 0, 48, 48), '#43baf3');
        pattern.fillRect(new Phaser.Rectangle(0, 48, 48, 48), '#43baf3');

        // Create a sprite and load to our newly created DynamicTexture.
        // Notice that loadDynamicTexture() will destroy sprite's AnimationManager,
        // so all the animations already added will no longer exist.
        var sprite: Phaser.Sprite = game.add.sprite(game.stage.centerX - 48, game.stage.centerY - 48);
        sprite.texture.loadDynamicTexture(pattern);

        console.log('Size of the sprite is now: (' + sprite.width + ', ' + sprite.height + ').');
    }
    function render() {
        Phaser.DebugUtils.context.fillStyle = '#fff';
        Phaser.DebugUtils.context.fillText('This is a sprite whose appearance defined by a DynamicTexture created on the fly.', 160, 450);
    }
})();
