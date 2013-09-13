/// <reference path="../_definitions.ts" />
/**
* FrameData
*
* FrameData is a container for Frame objects, which are the internal representation of animation data in Phaser.
*
* @package    Phaser.FrameData
* @author     Richard Davey <rich@photonstorm.com>
* @copyright  2013 Photon Storm Ltd.
* @license    https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
*/
var Phaser;
(function (Phaser) {
    var FrameData = (function () {
        /**
        * FrameData constructor
        */
        function FrameData() {
            this._frames = [];
            this._frameNames = [];
        }
        Object.defineProperty(FrameData.prototype, "total", {
            get: function () {
                return this._frames.length;
            },
            enumerable: true,
            configurable: true
        });
        FrameData.prototype.addFrame = /**
        * Add a new frame.
        * @param frame {Frame} The frame you want to add.
        * @return {Frame} The frame you just added.
        */
        function (frame) {
            frame.index = this._frames.length;
            this._frames.push(frame);
            if(frame.name !== '') {
                this._frameNames[frame.name] = frame.index;
            }
            return frame;
        };
        FrameData.prototype.getFrame = /**
        * Get a frame by its index.
        * @param index {number} Index of the frame you want to get.
        * @return {Frame} The frame you want.
        */
        function (index) {
            if(this._frames[index]) {
                return this._frames[index];
            }
            return null;
        };
        FrameData.prototype.getFrameByName = /**
        * Get a frame by its name.
        * @param name {string} Name of the frame you want to get.
        * @return {Frame} The frame you want.
        */
        function (name) {
            if(this._frameNames[name] !== '') {
                return this._frames[this._frameNames[name]];
            }
            return null;
        };
        FrameData.prototype.checkFrameName = /**
        * Check whether there's a frame with given name.
        * @param name {string} Name of the frame you want to check.
        * @return {bool} True if frame with given name found, otherwise return false.
        */
        function (name) {
            if(this._frameNames[name] == null) {
                return false;
            }
            return true;
        };
        FrameData.prototype.getFrameRange = /**
        * Get ranges of frames in an array.
        * @param start {number} Start index of frames you want.
        * @param end {number} End index of frames you want.
        * @param [output] {Frame[]} result will be added into this array.
        * @return {Frame[]} Ranges of specific frames in an array.
        */
        function (start, end, output) {
            if (typeof output === "undefined") { output = []; }
            for(var i = start; i <= end; i++) {
                output.push(this._frames[i]);
            }
            return output;
        };
        FrameData.prototype.getFrameIndexes = /**
        * Get all indexes of frames by giving their name.
        * @param [output] {number[]} result will be added into this array.
        * @return {number[]} Indexes of specific frames in an array.
        */
        function (output) {
            if (typeof output === "undefined") { output = []; }
            output.length = 0;
            for(var i = 0; i < this._frames.length; i++) {
                output.push(i);
            }
            return output;
        };
        FrameData.prototype.getFrameIndexesByName = /**
        * Get the frame indexes by giving the frame names.
        * @param [output] {number[]} result will be added into this array.
        * @return {number[]} Names of specific frames in an array.
        */
        function (input) {
            var output = [];
            for(var i = 0; i < input.length; i++) {
                if(this.getFrameByName(input[i])) {
                    output.push(this.getFrameByName(input[i]).index);
                }
            }
            return output;
        };
        FrameData.prototype.getAllFrames = /**
        * Get all frames in this frame data.
        * @return {Frame[]} All the frames in an array.
        */
        function () {
            return this._frames;
        };
        FrameData.prototype.getFrames = /**
        * Get All frames with specific ranges.
        * @param range {number[]} Ranges in an array.
        * @return {Frame[]} All frames in an array.
        */
        function (range) {
            var output = [];
            for(var i = 0; i < range.length; i++) {
                output.push(this._frames[i]);
            }
            return output;
        };
        return FrameData;
    })();
    Phaser.FrameData = FrameData;    
})(Phaser || (Phaser = {}));
