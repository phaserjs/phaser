(function() {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, null, render);

    var colorWheel, selected,
        color = 0xAACCA22B, colorStr = '#CCA22B';
    var offset = {
        x: 300 - 578 / 2,
        y: 300 - 550 / 2
    };
    var rect, rectSize = 24;

    function init() {
        game.load.image('color-wheel', 'assets/pics/color-wheel.png');
        game.load.start();
    }
    function create() {
        // Create color wheel texture.
        colorWheel = game.add.dynamicTexture(578, 550);
        colorWheel.pasteImage('color-wheel');

        // Create a rectangle shows the color you just selected.
        rect = new Phaser.Rectangle(0, 0, rectSize, rectSize);
        selected = game.add.sprite(600, 430);
        selected.width = rectSize;
        selected.height = rectSize;
        selected.texture.loadDynamicTexture(game.add.dynamicTexture(rectSize, rectSize));
        selected.texture.dynamicTexture.fillRect(rect, colorStr);

        // Get the color under the position you tapped or clicked.
        var pos = {};
        game.input.onTap.add(function(pointer) {
            pos.x = pointer.position.x - offset.x;
            pos.y = pointer.position.y - offset.y;
            color = colorWheel.getPixel32(pos.x, pos.y);
            colorStr = Phaser.ColorUtils.RGBtoWebstring(color);

            // Set the rectangle's color to new selected one.
            selected.texture.dynamicTexture.fillRect(rect, colorStr);
        });

        // Set the background color to white.
        game.stage.backgroundColor = '#fff';
}
    function render() {
        colorWheel.render(offset.x, offset.y);

        Phaser.DebugUtils.context.fillStyle = '#000';
        Phaser.DebugUtils.context.fillText('Tap or click the color wheel to select a color.', 480, 52);

        // Display more color formated infos here. You can also get a
        // string contains everything using getColorInfo();
        Phaser.DebugUtils.context.fillText('Web String: ' + colorStr, 600, 492);
        Phaser.DebugUtils.context.fillText('Hex String: ' + Phaser.ColorUtils.RGBtoHexstring(color), 600, 508);
        var hsv = Phaser.ColorUtils.RGBtoHSV(color);
        Phaser.DebugUtils.context.fillText('HSV: (' + hsv.hue.toFixed() + ', ' + hsv.saturation.toFixed(2) + ', ' + hsv.value.toFixed(2) + ')', 600, 524);
    }
})();
