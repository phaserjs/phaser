(function() {
    var game = new Phaser.Game(this, 'game', 800, 600, null, create, update, render);

    var rect: Phaser.Rectangle,
        renderList: Phaser.Rectangle[] = [];

    var leftHandler: Phaser.Rectangle,
        rightHandler: Phaser.Rectangle,
        topHandler: Phaser.Rectangle,
        bottomHandler: Phaser.Rectangle;

    var onDragLeft: Boolean = false,
        onDragRight: Boolean = false,
        onDragTop: Boolean = false,
        onDragBottom: Boolean = false;

    var lastPos = {x: 0, y: 0};

    function create() {
        // Rectangle to be dragged and scaled.
        rect = new Phaser.Rectangle(game.stage.centerX - 160, game.stage.centerY - 120,
            320, 240);
        // Handler rectangles for dragging scaling.
        leftHandler = new Phaser.Rectangle(game.stage.centerX - 160 - 4, game.stage.centerY - 4,
            8, 8);
        rightHandler = new Phaser.Rectangle(game.stage.centerX + 160 - 4, game.stage.centerY - 4,
            8, 8);
        topHandler = new Phaser.Rectangle(game.stage.centerX - 4, game.stage.centerY - 120 - 4,
            8, 8);
        bottomHandler = new Phaser.Rectangle(game.stage.centerX - 4, game.stage.centerY + 120 - 4,
            8, 8);
        // Add all the rectangles to the render list.
        renderList.push(rect,
            leftHandler, rightHandler, topHandler, bottomHandler);

        // Touch or press mouse button on any handler to start inflating rectangle.
        game.input.onDown.add(function(pointer) {
            if (Phaser.RectangleUtils.contains(leftHandler, pointer.position.x, pointer.position.y)) {
                onDragLeft = true;
                lastPos.x = pointer.position.x;
                lastPos.y = pointer.position.y;
            }
            else if (Phaser.RectangleUtils.contains(rightHandler, pointer.position.x, pointer.position.y)) {
                onDragRight = true;
                lastPos.x = pointer.position.x;
                lastPos.y = pointer.position.y;
            }
            else if (Phaser.RectangleUtils.contains(topHandler, pointer.position.x, pointer.position.y)) {
                onDragTop = true;
                lastPos.x = pointer.position.x;
                lastPos.y = pointer.position.y;
            }
            else if (Phaser.RectangleUtils.contains(bottomHandler, pointer.position.x, pointer.position.y)) {
                onDragBottom = true;
                lastPos.x = pointer.position.x;
                lastPos.y = pointer.position.y;
            }
        });
        // Stop dragging handlers when up.
        game.input.onUp.add(function() {
            onDragLeft = onDragRight = onDragTop = onDragBottom = false;
        });
    }
    function update() {
        var offset = {x: 0, y: 0};
        // Calc offset from last frame (previous update).
        if (onDragLeft) {
            offset.x = -game.input.x + lastPos.x;
        }
        else if (onDragRight) {
            offset.x = game.input.x - lastPos.x;
        }
        else if (onDragTop) {
            offset.y = -game.input.y + lastPos.y;
        }
        else if (onDragBottom) {
            offset.y = game.input.y - lastPos.y;
        }
        // Update last position.
        lastPos.x = game.input.x;
        lastPos.y = game.input.y;

        // Change rect's size and also the 4 handlers' position.
        Phaser.RectangleUtils.inflate(rect, offset.x, offset.y);
        leftHandler.x = rect.x - leftHandler.width / 2;
        rightHandler.x = rect.x + rect.width - rightHandler.width / 2;
        topHandler.y = rect.y - topHandler.height / 2;
        bottomHandler.y = rect.y + rect.height - bottomHandler.height / 2;
    }
    function render() {
        var context: CanvasRenderingContext2D = Phaser.DebugUtils.context;

        // Render rectangles.
        context.strokeStyle = '#fff';
        context.fillStyle = '#000';
        context.lineWidth = 4;
        for (var i = 0, len = renderList.length; i < len; i++) {
            context.strokeRect(renderList[i].x, renderList[i].y, renderList[i].width, renderList[i].height);
            context.fillRect(renderList[i].x, renderList[i].y, renderList[i].width, renderList[i].height);
        }

        // Render info.
        context.fillStyle = '#fff';
        context.lineWidth = 0;

        // Draw offset from origin point when drawing.
        var origin: Phaser.Vec2 = game.input.activePointer.positionDown,
            currPos: Phaser.Vec2 = game.input.activePointer.position;
        if (onDragLeft) {
            context.fillText('dx: ' + (currPos.x - origin.x), leftHandler.x + 16, leftHandler.y - 20);
            context.fillText('dy: 0', leftHandler.x + 16, leftHandler.y - 8);
        }
        else if (onDragRight) {
            context.fillText('dx: ' + (currPos.x - origin.x), rightHandler.x + 16, rightHandler.y - 20);
            context.fillText('dx: 0', rightHandler.x + 16, rightHandler.y - 8);
        }
        else if (onDragTop) {
            context.fillText('dy: 0', topHandler.x + 16, topHandler.y - 20);
            context.fillText('dy: ' + (currPos.y - origin.y), topHandler.x + 16, topHandler.y - 8);
        }
        else if (onDragBottom) {
            context.fillText('dy: 0', bottomHandler.x + 16, bottomHandler.y - 20);
            context.fillText('dy: ' + (currPos.y - origin.y), bottomHandler.x + 16, bottomHandler.y - 8);
        }

        context.fillText('Drag handlers to scale the rectangle!', 280, 96);
        context.fillText('Notice that the scaling does not move the rectangle\'s center!', 220, 508);
        context.fillText('You can also get same effect by using "Sprite" and its origin property.', 196, 520);
    }
})();
