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
    }
    function render() {
        // Directly render the texture to the stage.
        // In screen coordinates.
        pattern.render(400 - 48, 300 - 48);

        Phaser.DebugUtils.context.fillStyle = '#fff';
        Phaser.DebugUtils.context.fillText('There\'s no sprites here, only a DynamicTexture created on the fly.', 210, 450);
    }
})();
