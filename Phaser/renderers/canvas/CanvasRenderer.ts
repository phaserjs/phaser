/// <reference path="../../_definitions.ts" />

module Phaser.Renderer.Canvas {

    export class CanvasRenderer implements Phaser.IRenderer {

        constructor(game: Phaser.Game) {

            this.game = game;

            this.cameraRenderer = new Phaser.Renderer.Canvas.CameraRenderer(game);
            this.groupRenderer = new Phaser.Renderer.Canvas.GroupRenderer(game);
            this.spriteRenderer = new Phaser.Renderer.Canvas.SpriteRenderer(game);
            this.geometryRenderer = new Phaser.Renderer.Canvas.GeometryRenderer(game);
            this.scrollZoneRenderer = new Phaser.Renderer.Canvas.ScrollZoneRenderer(game);
            this.tilemapRenderer = new Phaser.Renderer.Canvas.TilemapRenderer(game);

        }

        public game: Phaser.Game;

        private _c: number = 0;
        private _cameraList: Phaser.Camera[];
        private _camera: Phaser.Camera;

        public cameraRenderer: Phaser.Renderer.Canvas.CameraRenderer;
        public groupRenderer: Phaser.Renderer.Canvas.GroupRenderer;
        public spriteRenderer: Phaser.Renderer.Canvas.SpriteRenderer;
        public geometryRenderer: Phaser.Renderer.Canvas.GeometryRenderer;
        public scrollZoneRenderer: Phaser.Renderer.Canvas.ScrollZoneRenderer;
        public tilemapRenderer: Phaser.Renderer.Canvas.TilemapRenderer;

        public renderCount: number;
        public renderTotal: number;

        public render() {

            this._cameraList = this.game.world.getAllCameras();
            this.renderCount = 0;

            //  Then iterate through world.group on them all (where not blacklisted, etc)
            for (this._c = 0; this._c < this._cameraList.length; this._c++)
            {
                if (this._cameraList[this._c].visible)
                {
                    this.cameraRenderer.preRender(this._cameraList[this._c]);

                    this.game.world.group.render(this._cameraList[this._c]);

                    this.cameraRenderer.postRender(this._cameraList[this._c]);
                }
            }

            this.renderTotal = this.renderCount;

        }

        public renderGameObject(camera:Phaser.Camera, object) {

            if (object.type == Types.SPRITE || object.type == Types.BUTTON)
            {
                this.spriteRenderer.render(camera, object);
            }
            else if (object.type == Types.SCROLLZONE)
            {
                this.scrollZoneRenderer.render(camera, object);
            }
            else if (object.type == Types.TILEMAP)
            {
                this.tilemapRenderer.render(camera, object);
            }

        }

    }

}