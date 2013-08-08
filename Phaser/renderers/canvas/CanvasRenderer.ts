/// <reference path="../../Game.ts" />
/// <reference path="../../gameobjects/Sprite.ts" />
/// <reference path="../../gameobjects/ScrollZone.ts" />
/// <reference path="../../cameras/Camera.ts" />
/// <reference path="../IRenderer.ts" />
/// <reference path="CameraRenderer.ts" />
/// <reference path="GeometryRenderer.ts" />
/// <reference path="GroupRenderer.ts" />
/// <reference path="ScrollZoneRenderer.ts" />
/// <reference path="SpriteRenderer.ts" />
/// <reference path="TilemapRenderer.ts" />

module Phaser.Renderer.Canvas {

    export class CanvasRenderer implements Phaser.IRenderer {

        constructor(game: Phaser.Game) {

            this.game = game;

            this.cameraRenderer = new CameraRenderer(game);
            this.groupRenderer = new GroupRenderer(game);
            this.spriteRenderer = new SpriteRenderer(game);
            this.geometryRenderer = new GeometryRenderer(game);
            this.scrollZoneRenderer = new ScrollZoneRenderer(game);
            this.tilemapRenderer = new TilemapRenderer(game);

        }

        public game: Phaser.Game;

        private _c: number = 0;
        private _cameraList: Phaser.Camera[];
        private _camera: Camera;

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

        public renderGameObject(camera, object) {

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