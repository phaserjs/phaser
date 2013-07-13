/**
* Phaser - Components - Debug
*
* 
*/

module Phaser.Components {

    export class Debug {

        /**
         * Render bound of this sprite for debugging? (default to false)
         * @type {boolean}
         */
        public renderDebug: bool = false;

        /**
         * Color of the Sprite when no image is present. Format is a css color string.
         * @type {string}
         */
        public fillColor: string = 'rgb(255,255,255)';

        /**
         * Color of bound when render debug. (see renderDebug) Format is a css color string.
         * @type {string}
         */
        public renderDebugColor: string = 'rgba(0,255,0,0.5)';

        /**
         * Color of points when render debug. (see renderDebug) Format is a css color string.
         * @type {string}
         */
        public renderDebugPointColor: string = 'rgba(255,255,255,1)';

        /**
         * Renders the bounding box around this Sprite and the contact points. Useful for visually debugging.
         * @param camera {Camera} Camera the bound will be rendered to.
         * @param cameraOffsetX {number} X offset of bound to the camera.
         * @param cameraOffsetY {number} Y offset of bound to the camera.
         */
        /*
        private renderBounds(camera: Camera, cameraOffsetX: number, cameraOffsetY: number) {

            this._dx = cameraOffsetX + (this.frameBounds.topLeft.x - camera.worldView.x);
            this._dy = cameraOffsetY + (this.frameBounds.topLeft.y - camera.worldView.y);

            this.context.fillStyle = this.renderDebugColor;
            this.context.fillRect(this._dx, this._dy, this.frameBounds.width, this.frameBounds.height);

            //this.context.fillStyle = this.renderDebugPointColor;

            //var hw = this.frameBounds.halfWidth * this.scale.x;
            //var hh = this.frameBounds.halfHeight * this.scale.y;
            //var sw = (this.frameBounds.width * this.scale.x) - 1;
            //var sh = (this.frameBounds.height * this.scale.y) - 1;

            //this.context.fillRect(this._dx, this._dy, 1, 1);            //  top left
            //this.context.fillRect(this._dx + hw, this._dy, 1, 1);       //  top center
            //this.context.fillRect(this._dx + sw, this._dy, 1, 1);       //  top right
            //this.context.fillRect(this._dx, this._dy + hh, 1, 1);       //  left center
            //this.context.fillRect(this._dx + hw, this._dy + hh, 1, 1);  //  center
            //this.context.fillRect(this._dx + sw, this._dy + hh, 1, 1);  //  right center
            //this.context.fillRect(this._dx, this._dy + sh, 1, 1);       //  bottom left
            //this.context.fillRect(this._dx + hw, this._dy + sh, 1, 1);  //  bottom center
            //this.context.fillRect(this._dx + sw, this._dy + sh, 1, 1);  //  bottom right

        }
        */

        /**
         * Render debug infos. (including name, bounds info, position and some other properties)
         * @param x {number} X position of the debug info to be rendered.
         * @param y {number} Y position of the debug info to be rendered.
         * @param [color] {number} color of the debug info to be rendered. (format is css color string)
         */
        /*
        public renderDebugInfo(x: number, y: number, color?: string = 'rgb(255,255,255)') {

            this.context.fillStyle = color;
            this.context.fillText('Sprite: ' + this.name + ' (' + this.frameBounds.width + ' x ' + this.frameBounds.height + ')', x, y);
            this.context.fillText('x: ' + this.frameBounds.x.toFixed(1) + ' y: ' + this.frameBounds.y.toFixed(1) + ' rotation: ' + this.angle.toFixed(1), x, y + 14);
            this.context.fillText('dx: ' + this._dx.toFixed(1) + ' dy: ' + this._dy.toFixed(1) + ' dw: ' + this._dw.toFixed(1) + ' dh: ' + this._dh.toFixed(1), x, y + 28);
            this.context.fillText('sx: ' + this._sx.toFixed(1) + ' sy: ' + this._sy.toFixed(1) + ' sw: ' + this._sw.toFixed(1) + ' sh: ' + this._sh.toFixed(1), x, y + 42);

        }
        */

    }

}