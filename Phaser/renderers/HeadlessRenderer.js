var Phaser;
(function (Phaser) {
    (function (Renderer) {
        /// <reference path="../_definitions.ts" />
        (function (Headless) {
            var HeadlessRenderer = (function () {
                function HeadlessRenderer(game) {
                    this.game = game;
                }
                HeadlessRenderer.prototype.render = function () {
                    //  Nothing, headless remember?
                };

                HeadlessRenderer.prototype.renderGameObject = function (camera, object) {
                    //  Nothing, headless remember?
                };
                return HeadlessRenderer;
            })();
            Headless.HeadlessRenderer = HeadlessRenderer;
        })(Renderer.Headless || (Renderer.Headless = {}));
        var Headless = Renderer.Headless;
    })(Phaser.Renderer || (Phaser.Renderer = {}));
    var Renderer = Phaser.Renderer;
})(Phaser || (Phaser = {}));
