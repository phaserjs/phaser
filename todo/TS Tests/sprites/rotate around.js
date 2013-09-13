(function() {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update, render);

    var rotationSrv, angle = 0;

    function init() {
        game.load.spritesheet('x', 'assets/sprites/x.png', 220, 160);
        game.load.start();
    }
    function create() {
        // Create 6 sprites rotating around the center at the beginning.
        for (var i = 0; i < 3; i++) {
            game.add.sprite(210 - ((i % 2) ? 140 : 0), 120 * (i + 1), 'x', i);
            game.add.sprite(370 + ((i % 2) ? 140 : 0), 120 * (i + 1), 'x', i + 3);
        }

        // Set a default rotation server pointer.
        rotationSrv = new Phaser.Point(game.stage.centerX, game.stage.centerY);

        // Rotate all the sprites around the touch point.
        game.input.onTap.add(function(pointer) {
            rotationSrv.x = pointer.position.x;
            rotationSrv.y = pointer.position.y;
        });
    }
    function update() {
        angle += 0.1;

        game.world.group.forEach(function(obj) {
            var resPointer = new Phaser.Point(obj.x, obj.y);
            Phaser.PointUtils.rotateAroundPoint(resPointer, rotationSrv, angle);
            obj.x = resPointer.x;
            obj.y = resPointer.y;
        });
    }
    function render() {
        Phaser.DebugUtils.context.fillStyle = '#fff';
        Phaser.DebugUtils.context.fillText('Tap or click to set new rotation point.', 280, 100);
    }
})();
