/// <reference path="../Game.ts" />
/// <reference path="Camera.ts" />

/**
* Phaser - CameraManager
*
* Your game only has one CameraManager instance and it's responsible for looking after, creating and destroying
* all of the cameras in the world.
*/

module Phaser {

    export class CameraManager {

        /**
         * CameraManager constructor
         * This will create a new <code>Camera</code> with position and size.
         *
         * @param x {number} X Position of the created camera.
         * @param y {number} y Position of the created camera.
         * @param width {number} Width of the created camera.
         * @param height {number} Height of the created camera.
         */
        constructor(game: Game, x: number, y: number, width: number, height: number) {

            this.game = game;

            this._cameras = [];
            this._cameraLength = 0;

            this.defaultCamera = this.addCamera(x, y, width, height);

            this.current = this.defaultCamera;

        }

        /**
         * Local reference to Game.
         */
        public game: Game;

        /**
         * Local container for storing cameras.
         */
        private _cameras: Camera[];

        /**
         * Local container for storing cameras array length.
         */
        private _cameraLength: number;

        /**
         * Helper for sort.
         */
        private _sortIndex: string = '';

        /**
         * Helper for sort.
         */
        private _sortOrder: number;

        /**
         * Currently used camera.
         */
        public current: Camera;

        /**
         * The default created camera.
         */
        public defaultCamera: Camera;

        /**
         * Get all the cameras.
         *
         * @returns {Camera[]} An array contains all the cameras.
         */
        public getAll(): Camera[] {
            return this._cameras;
        }

        /**
         * Update cameras.
         */
        public update() {

            for (var i = 0; i < this._cameras.length; i++)
            {
                this._cameras[i].update();
            }

        }

        /**
         * postUpdate cameras.
         */
        public postUpdate() {

            for (var i = 0; i < this._cameras.length; i++)
            {
                this._cameras[i].postUpdate();
            }

        }

        /**
         * Create a new camera with specific position and size.
         *
         * @param x {number} X position of the new camera.
         * @param y {number} Y position of the new camera.
         * @param width {number} Width of the new camera.
         * @param height {number} Height of the new camera.
         * @returns {Camera} The newly created camera object.
         */
        public addCamera(x: number, y: number, width: number, height: number): Camera {

            var newCam: Camera = new Camera(this.game, this._cameraLength, x, y, width, height);

            this._cameraLength = this._cameras.push(newCam);

            return newCam;

        }

        /**
         * Remove a new camera with its id.
         *
         * @param id {number} ID of the camera you want to remove.
         * @returns {boolean} True if successfully removed the camera, otherwise return false.
         */
        public removeCamera(id: number): boolean {

            for (var c = 0; c < this._cameras.length; c++)
            {
                if (this._cameras[c].ID == id)
                {
                    if (this.current.ID === this._cameras[c].ID)
                    {
                        this.current = null;
                    }

                    this._cameras.splice(c, 1);

                    return true;
                }
            }

            return false;

        }

        public swap(camera1: Camera, camera2: Camera, sort: boolean = true): boolean {

            if (camera1.ID == camera2.ID)
            {
                return false;
            }

            var tempZ: number = camera1.z;

            camera1.z = camera2.z;
            camera2.z = tempZ;

            if (sort)
            {
                this.sort();
            }

            return true;

        }

        public getCameraUnderPoint(x: number, y: number): Camera {

            //  Work through the cameras in reverse as they are rendered in array order
            //  Return the first camera we find matching the criteria
            for (var c = this._cameraLength - 1; c >= 0; c--)
            {
                if (this._cameras[c].visible && Phaser.RectangleUtils.contains(this._cameras[c].screenView, x, y))
                {
                    return this._cameras[c];
                }
            }

            return null;

        }

        /**
         * Call this function to sort the Cameras according to a particular value and order (default is their Z value).
         * The order in which they are sorted determines the render order. If sorted on z then Cameras with a lower z-index value render first.
         *
         * @param {string} index The <code>string</code> name of the Camera variable you want to sort on. Default value is "z".
         * @param {number} order A <code>Group</code> constant that defines the sort order. Possible values are <code>Group.ASCENDING</code> and <code>Group.DESCENDING</code>.  Default value is <code>Group.ASCENDING</code>.
         */
        public sort(index: string = 'z', order: number = Group.ASCENDING) {

            this._sortIndex = index;
            this._sortOrder = order;
            this._cameras.sort((a, b) => this.sortHandler(a, b));

        }

        /**
         * Helper function for the sort process.
         *
         * @param {Basic} Obj1 The first object being sorted.
         * @param {Basic} Obj2 The second object being sorted.
         *
         * @return {number} An integer value: -1 (Obj1 before Obj2), 0 (same), or 1 (Obj1 after Obj2).
         */
        public sortHandler(obj1, obj2): number {

            if (obj1[this._sortIndex] < obj2[this._sortIndex])
            {
                return this._sortOrder;
            }
            else if (obj1[this._sortIndex] > obj2[this._sortIndex])
            {
                return -this._sortOrder;
            }

            return 0;

        }

        /**
         * Clean up memory.
         */
        public destroy() {

            this._cameras.length = 0;

            this.current = this.addCamera(0, 0, this.game.stage.width, this.game.stage.height);

        }

    }

}