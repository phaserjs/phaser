function createSpeechBubble (scene, x, y, width, height, quote)
{
    var bubbleWidth = width;
    var bubbleHeight = height;
    var bubblePadding = 10;
    var arrowHeight = bubbleHeight / 3;

    var bubble = scene.add.graphics({ x: x, y: y });

    //  Bubble shadow
    bubble.fillStyle(0x222222, 0.5);
    bubble.fillRoundedRect(6, 6, bubbleWidth, bubbleHeight, 16);

    //  Bubble color
    bubble.fillStyle(0xffffff, 1);

    //  Bubble outline line style
    bubble.lineStyle(4, 0x565656, 1);

    //  Bubble shape and outline
    bubble.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
    bubble.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);

    //  Calculate arrow coordinates
    var point1X = Math.floor(bubbleWidth / 4);
    var point1Y = bubbleHeight;
    var point2X = Math.floor((bubbleWidth / 4) * 1.4);
    var point2Y = bubbleHeight;
    var point3X = Math.floor(bubbleWidth / 4);
    var point3Y = Math.floor(bubbleHeight + arrowHeight);

    //  Bubble arrow shadow
    bubble.lineStyle(4, 0x222222, 0.5);
    bubble.lineBetween(point2X - 1, point2Y + 6, point3X + 2, point3Y);

    //  Bubble arrow fill
    bubble.fillTriangle(point1X, point1Y, point2X, point2Y, point3X, point3Y);
    bubble.lineStyle(2, 0x565656, 1);
    bubble.lineBetween(point2X, point2Y, point3X, point3Y);
    bubble.lineBetween(point1X, point1Y, point3X, point3Y);

    var content = scene.add.text(0, 0, quote, { fontFamily: 'Arial', fontSize: 20, color: '#000000', align: 'center', wordWrap: { width: bubbleWidth - (bubblePadding * 2) } });

    var b = content.getBounds();

    content.setPosition(bubble.x + (bubbleWidth / 2) - (b.width / 2), bubble.y + (bubbleHeight / 2) - (b.height / 2));

    var container = scene.add.container();

    container.add([ bubble, content ]);

    return container;
}

class SceneA extends Phaser.Scene {

    constructor ()
    {
        super('sceneA');
    }

    preload ()
    {
        this.load.atlas('jellies', 'assets/atlas/jellies.png', 'assets/atlas/jellies.json');
    }

    create ()
    {
        let jelly = this.add.image(150, 500, 'jellies', 'WithShadow/Jelly1').setScale(0.5);
        let bubble1 = createSpeechBubble(this, 20, 30, 220, 80, "Scene A\nKey.on").setVisible(false);
        let bubble2 = createSpeechBubble(this, 20, 160, 220, 80, "Scene A\nkeydown_SPACE").setVisible(false);
        let bubble3 = createSpeechBubble(this, 20, 290, 220, 80, "Scene A\nkeydown").setVisible(false);

        let spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //  Phase 1: Key event.
        //  Emits only when the SPACE BAR is pressed down, and dispatches from the local Key object.
        //  Call stopImmediatePropagation to stop it reaching the two global handlers in this Scene.
        //  Call stopPropagation to stop it reaching any other Scene.

        spaceKey.on('down', function (key, event) {

            // event.stopPropagation();
            // event.stopImmediatePropagation();

            bubble1.setVisible(true);

        });

        //  Phase 2: Global keydown + keycode handler.
        //  Emits only on the SPACE BAR keycode event, but dispatches globally.
        //  Call stopImmediatePropagation to stop it reaching the global handler in this Scene.
        //  Call stopPropagation to stop it reaching any other Scene.

        this.input.keyboard.on('keydown_SPACE', function (event) {

            // event.stopPropagation();
            // event.stopImmediatePropagation();

            bubble2.setVisible(true);

        });

        //  Phase 3: Global keydown handler.
        //  Fires on ANY key press, so we need to check the keyCode internally.
        //  Calling stopImmediatePropagation has no effect here, as it's the least specific handler in this Scene.
        //  Call stopPropagation to stop it reaching any other Scene.

        this.input.keyboard.on('keydown', function (event) {

            if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.SPACE)
            {
                // event.stopPropagation();

                bubble3.setVisible(true);
            }

        });

        //  Launch the other 2 Scenes, so they are running in parallel to SceneA.
        this.scene.launch('sceneB');
        this.scene.launch('sceneC');
    }

}

class SceneB extends Phaser.Scene {

    constructor ()
    {
        super('sceneB');
    }

    create ()
    {
        let jelly = this.add.image(400, 500, 'jellies', 'WithShadow/Jelly2').setScale(0.5);
        let bubble1 = createSpeechBubble(this, 290, 30, 220, 80, "Scene B\nKey.on").setVisible(false);
        let bubble2 = createSpeechBubble(this, 290, 160, 220, 80, "Scene B\nkeydown_SPACE").setVisible(false);
        let bubble3 = createSpeechBubble(this, 290, 290, 220, 80, "Scene B\nkeydown").setVisible(false);

        let spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //  Phase 1: Key event.
        //  Emits only when the SPACE BAR is pressed down, and dispatches from the local Key object.
        //  Call stopImmediatePropagation to stop it reaching the two global handlers in this Scene.
        //  Call stopPropagation to stop it reaching any other Scene.

        spaceKey.on('down', function (key, event) {

            // event.stopPropagation();
            // event.stopImmediatePropagation();

            bubble1.setVisible(true);

        });

        //  Phase 2: Global keydown + keycode handler.
        //  Emits only on the SPACE BAR keycode event, but dispatches globally.
        //  Call stopImmediatePropagation to stop it reaching the global handler in this Scene.
        //  Call stopPropagation to stop it reaching any other Scene.

        this.input.keyboard.on('keydown_SPACE', function (event) {

            // event.stopPropagation();
            // event.stopImmediatePropagation();

            bubble2.setVisible(true);

        });

        //  Phase 3: Global keydown handler.
        //  Fires on ANY key press, so we need to check the keyCode internally.
        //  Calling stopImmediatePropagation has no effect here, as it's the least specific handler in this Scene.
        //  Call stopPropagation to stop it reaching any other Scene.

        this.input.keyboard.on('keydown', function (event) {

            if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.SPACE)
            {
                // event.stopPropagation();

                bubble3.setVisible(true);
            }

        });
    }

}

class SceneC extends Phaser.Scene {

    constructor ()
    {
        super('sceneC');
    }

    create ()
    {
        let jelly = this.add.image(650, 500, 'jellies', 'WithShadow/Jelly3').setScale(0.5);
        let bubble1 = createSpeechBubble(this, 560, 30, 220, 80, "Scene C\nKey.on").setVisible(false);
        let bubble2 = createSpeechBubble(this, 560, 160, 220, 80, "Scene C\nkeydown_SPACE").setVisible(false);
        let bubble3 = createSpeechBubble(this, 560, 290, 220, 80, "Scene C\nkeydown").setVisible(false);

        let spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //  Phase 1: Key event.
        //  Emits only when the SPACE BAR is pressed down, and dispatches from the local Key object.
        //  Call stopImmediatePropagation to stop it reaching the two global handlers in this Scene.
        //  Call stopPropagation to stop it reaching any other Scene.

        spaceKey.on('down', function (key, event) {

            // event.stopPropagation();
            // event.stopImmediatePropagation();

            bubble1.setVisible(true);

        });

        //  Phase 2: Global keydown + keycode handler.
        //  Emits only on the SPACE BAR keycode event, but dispatches globally.
        //  Call stopImmediatePropagation to stop it reaching the global handler in this Scene.
        //  Call stopPropagation to stop it reaching any other Scene.

        this.input.keyboard.on('keydown_SPACE', function (event) {

            // event.stopPropagation();
            // event.stopImmediatePropagation();

            bubble2.setVisible(true);

        });

        //  Phase 3: Global keydown handler.
        //  Fires on ANY key press, so we need to check the keyCode internally.
        //  Calling stopImmediatePropagation has no effect here, as it's the least specific handler in this Scene.
        //  Call stopPropagation to stop it reaching any other Scene.

        this.input.keyboard.on('keydown', function (event) {

            if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.SPACE)
            {
                // event.stopPropagation();

                bubble3.setVisible(true);
            }

        });
    }

}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    backgroundColor: '#0072bc',
    scene: [ SceneA, SceneB, SceneC ]
};

let game = new Phaser.Game(config);
