var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var MyScene = /** @class */ (function (_super) {
    __extends(MyScene, _super);
    function MyScene() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MyScene.prototype.preload = function () {
        this.load.atlas('cards', 'assets/atlas/cards.png', 'assets/atlas/cards.json');
    };
    MyScene.prototype.create = function () {
        var sprite = this.add.sprite(400, 300, 'cards', 'clubs3');
        sprite.setInteractive();
        this.input.on('pointerdown', function () {
            sprite.setFrame('hearts4');
        });
    };
    return MyScene;
}(Phaser.Scene));
var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: MyScene
};
var game = new Phaser.Game(config);
//# sourceMappingURL=game.js.map