(function() {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, null, render);

    var colorWheel: Phaser.Sprite,
        selected: Phaser.Sprite,
        compHarmony: Phaser.Sprite,
        analoHarmony: Phaser.Sprite, analoHarmony1: Phaser.Sprite,
        splitHarmony: Phaser.Sprite, splitHarmony1: Phaser.Sprite,
        triaHarmony: Phaser.Sprite, triaHarmony1: Phaser.Sprite,

        color: Number = 0xAACCA22B, colorStr: String = '#CCA22B',
        compHColor: Number,
        analoColor: Number, splitColor: Number, triaColor: Number,
        analoColor1: Number, splitColor1: Number, triaColor1: Number;

    var offset = {
        x: 300 - 578 / 2,
        y: 300 - 550 / 2
    };
    var rect: Phaser.Rectangle,
        rectSize: Number = 24;

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
        selected = game.add.sprite(700, 290);
        selected.width = rectSize;
        selected.height = rectSize;
        selected.texture.loadDynamicTexture(game.add.dynamicTexture(rectSize, rectSize));
        selected.texture.dynamicTexture.fillRect(rect, colorStr);

        // Create rectangles to show the harmony colors to the selected one.
        compHColor = Phaser.ColorUtils.getComplementHarmony(color),
        analoColor = Phaser.ColorUtils.getAnalogousHarmony(color),
        splitColor = Phaser.ColorUtils.getSplitComplementHarmony(color),
        triaColor = Phaser.ColorUtils.getTriadicHarmony(color);

        // Complement
        compHarmony = game.add.sprite(700, 390);
        compHarmony.width = rectSize;
        compHarmony.height = rectSize;
        compHarmony.texture.loadDynamicTexture(game.add.dynamicTexture(rectSize, rectSize));
        compHarmony.texture.dynamicTexture.fillRect(rect, Phaser.ColorUtils.RGBtoWebstring(compHColor));

        // Analogous
        analoHarmony = game.add.sprite(700, 434);
        analoHarmony.width = rectSize;
        analoHarmony.height = rectSize;
        analoHarmony.texture.loadDynamicTexture(game.add.dynamicTexture(rectSize, rectSize));
        analoHarmony.texture.dynamicTexture.fillRect(rect, Phaser.ColorUtils.RGBtoWebstring(analoColor.color2));

        analoHarmony1 = game.add.sprite(744, 434);
        analoHarmony1.width = rectSize;
        analoHarmony1.height = rectSize;
        analoHarmony1.texture.loadDynamicTexture(game.add.dynamicTexture(rectSize, rectSize));
        analoHarmony1.texture.dynamicTexture.fillRect(rect, Phaser.ColorUtils.RGBtoWebstring(analoColor.color3));

        // Split Complement
        splitHarmony = game.add.sprite(700, 478);
        splitHarmony.width = rectSize;
        splitHarmony.height = rectSize;
        splitHarmony.texture.loadDynamicTexture(game.add.dynamicTexture(rectSize, rectSize));
        splitHarmony.texture.dynamicTexture.fillRect(rect, Phaser.ColorUtils.RGBtoWebstring(splitColor.color2));

        splitHarmony1 = game.add.sprite(744, 478);
        splitHarmony1.width = rectSize;
        splitHarmony1.height = rectSize;
        splitHarmony1.texture.loadDynamicTexture(game.add.dynamicTexture(rectSize, rectSize));
        splitHarmony1.texture.dynamicTexture.fillRect(rect, Phaser.ColorUtils.RGBtoWebstring(splitColor.color3));

        // Triadic
        triaHarmony = game.add.sprite(700, 522);
        triaHarmony.width = rectSize;
        triaHarmony.height = rectSize;
        triaHarmony.texture.loadDynamicTexture(game.add.dynamicTexture(rectSize, rectSize));
        triaHarmony.texture.dynamicTexture.fillRect(rect, Phaser.ColorUtils.RGBtoWebstring(triaColor.color2));

        triaHarmony1 = game.add.sprite(744, 522);
        triaHarmony1.width = rectSize;
        triaHarmony1.height = rectSize;
        triaHarmony1.texture.loadDynamicTexture(game.add.dynamicTexture(rectSize, rectSize));
        triaHarmony1.texture.dynamicTexture.fillRect(rect, Phaser.ColorUtils.RGBtoWebstring(triaColor.color3));

        // Get the color under the position you tapped or clicked.
        var pos = {};
        game.input.onTap.add(function(pointer) {
            pos.x = pointer.position.x - offset.x;
            pos.y = pointer.position.y - offset.y;

            // Update colors.
            color = colorWheel.getPixel32(pos.x, pos.y);
            compHColor = Phaser.ColorUtils.getComplementHarmony(color),
            analoColor = Phaser.ColorUtils.getAnalogousHarmony(color).color2,
            analoColor1 = Phaser.ColorUtils.getAnalogousHarmony(color).color3,
            splitColor = Phaser.ColorUtils.getSplitComplementHarmony(color).color2,
            splitColor1 = Phaser.ColorUtils.getSplitComplementHarmony(color).color3,
            triaColor = Phaser.ColorUtils.getTriadicHarmony(color).color2;
            triaColor1 = Phaser.ColorUtils.getTriadicHarmony(color).color3;

            // Calc color strings.
            colorStr = Phaser.ColorUtils.RGBtoWebstring(color);
            var compStr: String = Phaser.ColorUtils.RGBtoWebstring(compHColor),
                analStr: String = Phaser.ColorUtils.RGBtoWebstring(analoColor),
                analStr1: String = Phaser.ColorUtils.RGBtoWebstring(analoColor1),
                spliStr: String = Phaser.ColorUtils.RGBtoWebstring(splitColor),
                spliStr1: String = Phaser.ColorUtils.RGBtoWebstring(splitColor1),
                triaStr: String = Phaser.ColorUtils.RGBtoWebstring(triaColor),
                triaStr1: String = Phaser.ColorUtils.RGBtoWebstring(triaColor1);

            // Update color of the rectangles.
            selected.texture.dynamicTexture.fillRect(rect, colorStr);
            compHarmony.texture.dynamicTexture.fillRect(rect, compStr);
            analoHarmony.texture.dynamicTexture.fillRect(rect, analStr);
            analoHarmony1.texture.dynamicTexture.fillRect(rect, analStr1);
            splitHarmony.texture.dynamicTexture.fillRect(rect, spliStr);
            splitHarmony1.texture.dynamicTexture.fillRect(rect, spliStr1);
            triaHarmony.texture.dynamicTexture.fillRect(rect, triaStr);
            triaHarmony1.texture.dynamicTexture.fillRect(rect, triaStr1);
        });

        // Set the background color to white.
        game.stage.backgroundColor = '#fff';
    }
    function render() {
        colorWheel.render(offset.x, offset.y);

        Phaser.DebugUtils.context.fillStyle = '#000';
        Phaser.DebugUtils.context.fillText('Tap or click the color wheel to select a color.', 480, 52);
        Phaser.DebugUtils.context.fillText('All the harmony colors are calculated on the fly.', 480, 590);

        // Display more color formated infos here. You can also get a
        // string contains everything using getColorInfo();
        Phaser.DebugUtils.context.fillText('Selected Color: ', 600, 312);
        Phaser.DebugUtils.context.fillText('Web String: ' + colorStr, 640, 342);
        Phaser.DebugUtils.context.fillText('Hex String: ' + Phaser.ColorUtils.RGBtoHexstring(color), 640, 358);
        var hsv = Phaser.ColorUtils.RGBtoHSV(color);
        Phaser.DebugUtils.context.fillText('HSV: (' + hsv.hue.toFixed() + ', ' + hsv.saturation.toFixed(2) + ', ' + hsv.value.toFixed(2) + ')', 640, 374);

        // Harmony color types info.
        Phaser.DebugUtils.context.fillText('Complement Harmony Color: ', 540, 412);
        Phaser.DebugUtils.context.fillText(' Analogous Harmony Color: ', 540, 456);
        Phaser.DebugUtils.context.fillText('Split Complement Harmony Color: ', 502, 500);
        Phaser.DebugUtils.context.fillText('   Triadic Harmony Color: ', 540, 544);
    }
})();
