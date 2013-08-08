(function() {
    var game = new Phaser.Game(this, 'game', 800, 600, preload, create, update, render);

    var xTop: Phaser.Group,
        yTop: Phaser.Group,
        zTop: Phaser.Group;

    function preload() {
        game.load.image('cell', 'assets/sprites/diamond.png');
        
    }
    function create() {
        // Create 3 groups which will have different sort "index".
        xTop = game.add.group();
        yTop = game.add.group();
        zTop = game.add.group();

        var i: Number;
        for (i = 0; i < 64; i++) {
            xTop.addNewSprite(160 + 48 * Math.cos(i * Math.PI / 8), 540 - i * 8,
                'cell', 0,
                Phaser.Types.BODY_DISABLED);
        }
        for (i = 0; i < 64; i++) {
            yTop.addNewSprite(340 + 48 * Math.cos(i * Math.PI / 8), 540 - i * 8,
                'cell', 0,
                Phaser.Types.BODY_DISABLED);
        }
        for (i = 0; i < 64; i++) {
            zTop.addNewSprite(520 + 48 * Math.cos(i * Math.PI / 8), 540 - i * 8,
                'cell', 0,
                Phaser.Types.BODY_DISABLED);
        }
    }
    function update() {
        // Sort 3 groups using different methods, all of them are
        // ascending by default.
        xTop.sort('x');
        yTop.sort('y');
        zTop.sort('z');
    }
    function render() {
        Phaser.DebugUtils.context.fillStyle = '#fff';
        Phaser.DebugUtils.context.fillText('Left group sorted by x.', 16, 18);
        Phaser.DebugUtils.context.fillText('Middle group sorted by y.', 16, 36);
        Phaser.DebugUtils.context.fillText('Right group sorted by z.', 16, 54);
    }
})();
