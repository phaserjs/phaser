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

            this._game = game;

            this._cameras = [];

            this.default = this.addCamera(x, y, width, height);
            this.current = this.default;

        }

        /**
         * Local private reference to Game.
         */
        private _game: Game;

        /**
         * Local container for storing cameras.
         */
        private _cameras: Camera[];

        /**
         * Local helper stores index of next created camera.
         */
        private _cameraInstance: number = 0;

        /**
         * Helper for sort.
         */
        private _sortIndex: string = '';

        /**
         * Helper for sort.
         */
        private _sortOrder: number;

        public static CAMERA_TYPE_ORTHOGRAPHIC: number = 0;
        public static CAMERA_TYPE_ISOMETRIC: number = 1;

        /**
         * Currently used camera.
         */
        public current: Camera;

        /**
         * The default created camera.
         */
        public default: Camera;

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
        public addCamera(x: number, y: number, width: number, height: number, type: number = CameraManager.CAMERA_TYPE_ORTHOGRAPHIC): Camera {

            var newCam: Camera = new Camera(this._game, this._cameraInstance, x, y, width, height);

            this._cameras.push(newCam);

            this._cameraInstance++;

            return newCam;

        }

        /**
         * Remove a new camera with its id.
         *
         * @param id {number} ID of the camera you want to remove.
         * @returns {boolean} True if successfully removed the camera, otherwise return false.
         */
        public removeCamera(id: number): bool {

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

        public swap(camera1: Camera, camera2: Camera, sort?: bool = true): bool {

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

            this.current = this.addCamera(0, 0, this._game.stage.width, this._game.stage.height);

        }

    }

}