(function() {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update, render);

    function init() {
        game.load.spritesheet('rect', 'assets/buttons/number-buttons-90x90.png', 90, 90);
        game.load.start();
    }
    function create() {
        var rect, factor;
        for (var i = 0; i < 16; i++) {
            rect = game.add.sprite(10 + Math.random() * 700, 10 + Math.random() * 300, 'rect', Math.round(Math.random() * 5));
            factor = 0.2 + Math.random() * 2;
            rect.transform.scale.setTo(factor, factor);
            factor = 2 + Math.random() * 6;
            rect.speed = factor;
        }
        console.log(game.world.group.length);
    }
    function update() {
        game.world.group.forEach(function(rect) {
            // Apply speed to each rect.
            rect.y += rect.speed;
            // Move the rect back to screen if it's not.
            if (!Phaser.SpriteUtils.onScreen(rect)) {
                rect.y = 0;
            }
        });
    }
})();
