(function() {
    var game = new Phaser.Game(this, 'game', 800, 600, null, create, update, render);

    var rects: Phaser.Rectangle[] = [],
        rect: Phaser.Rectangle,
        lastCreated: Phaser.Rectangle;

    function create() {
        // Create a rect first.
        spawnRect(64, 32, 64, 64);

        // Add a rectangle on each touch or click.
        game.input.onTap.add(function() {
            spawnRect(lastCreated.x + 12, lastCreated.y + 12, 64, 64);
        });
    }
    function update() {
        // body...
    }
    function render() {
        var context: CanvasRenderingContext2D = Phaser.DebugUtils.context;

        // Render rectangles.
        context.strokeStyle = '#fff';
        // context.fillStyle = '#fff';
        context.lineWidth = 2;
        for (var i = 0, len = rects.length; i < len; i++) {
            rect = rects[i];
            context.strokeRect(rect.x, rect.y, rect.width, rect.height);
        }

        // Render info.
        context.fillStyle = '#fff';
        context.lineWidth = 0;
        context.fillText('Tap or click to clone a new rectangle.', 480, 128);
    }
    function spawnRect(x, y, w, h) {
        // If a rect already created, clone it to create a new one instead
        // of allocating.
        if (lastCreated) {
            rect = Phaser.RectangleUtils.clone(lastCreated);
            // Offset the newly created rectangle.
            rect.x += 24;
            rect.y += 24;
            // Now the last created is this one.
            lastCreated = rect;
        }
        else {
            lastCreated = new Phaser.Rectangle(x, y, w, h);
        }
        rects.push(lastCreated);
    }
})();
