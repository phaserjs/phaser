/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2015 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* FrameData is a container for Frame objects, which are the internal representation of animation data in Phaser.
*
* @class Phaser.FrameData
* @constructor
*/
Phaser.FrameData = function () {

    /**
    * @property {Array} _frames - Local array of frames.
    * @private
    */
    this._frames = [];

    /**
    * @property {Array} _frameNames - Local array of frame names for name to index conversions.
    * @private
    */
    this._frameNames = [];

};

Phaser.FrameData.prototype = {

    /**
    * Adds a new Frame to this FrameData collection. Typically called by the Animation.Parser and not directly.
    *
    * @method Phaser.FrameData#addFrame
    * @param {Phaser.Frame} frame - The frame to add to this FrameData set.
    * @return {Phaser.Frame} The frame that was just added.
    */
    addFrame: function (frame) {

        frame.index = this._frames.length;

        this._frames.push(frame);

        if (frame.name !== '')
        {
            this._frameNames[frame.name] = frame.index;
        }

        return frame;

    },

    /**
    * Get a Frame by its numerical index.
    *
    * @method Phaser.FrameData#getFrame
    * @param {number} index - The index of the frame you want to get.
    * @return {Phaser.Frame} The frame, if found.
    */
    getFrame: function (index) {

        if (index >= this._frames.length)
        {
            index = 0;
        }

        return this._frames[index];

    },

    /**
    * Get a Frame by its frame name.
    *
    * @method Phaser.FrameData#getFrameByName
    * @param {string} name - The name of the frame you want to get.
    * @return {Phaser.Frame} The frame, if found.
    */
    getFrameByName: function (name) {

        if (typeof this._frameNames[name] === 'number')
        {
            return this._frames[this._frameNames[name]];
        }

        return null;

    },

    /**
    * Check if there is a Frame with the given name.
    *
    * @method Phaser.FrameData#checkFrameName
    * @param {string} name - The name of the frame you want to check.
    * @return {boolean} True if the frame is found, otherwise false.
    */
    checkFrameName: function (name) {

        if (this._frameNames[name] == null)
        {
            return false;
        }

        return true;

    },

    /**
     * Makes a copy of this FrameData including copies (not references) to all of the Frames it contains.
     *
     * @method Phaser.FrameData#clone
     * @return {Phaser.FrameData} A clone of this object, including clones of the Frame objects it contains.
     */
    clone: function () {

        var output = new Phaser.FrameData();

        //  No input array, so we loop through all frames
        for (var i = 0; i < this._frames.length; i++)
        {
            output._frames.push(this._frames[i].clone());
        }

        for (var p in this._frameNames)
        {
            if (this._frameNames.hasOwnProperty(p))
            {
                output._frameNames.push(this._frameNames[p]);
            }
        }

        return output;

    },

    /**
    * Returns a range of frames based on the given start and end frame indexes and returns them in an Array.
    *
    * @method Phaser.FrameData#getFrameRange
    * @param {number} start - The starting frame index.
    * @param {number} end - The ending frame index.
    * @param {Array} [output] - If given the results will be appended to the end of this array otherwise a new array will be created.
    * @return {Array} An array of Frames between the start and end index values, or an empty array if none were found.
    */
    getFrameRange: function (start, end, output) {

        if (output === undefined) { output = []; }

        for (var i = start; i <= end; i++)
        {
            output.push(this._frames[i]);
        }

        return output;

    },

    /**
    * Returns all of the Frames in this FrameData set where the frame index is found in the input array.
    * The frames are returned in the output array, or if none is provided in a new Array object.
    *
    * @method Phaser.FrameData#getFrames
    * @param {Array} [frames] - An Array containing the indexes of the frames to retrieve. If the array is empty or undefined then all frames in the FrameData are returned.
    * @param {boolean} [useNumericIndex=true] - Are the given frames using numeric indexes (default) or strings? (false)
    * @param {Array} [output] - If given the results will be appended to the end of this array otherwise a new array will be created.
    * @return {Array} An array of all Frames in this FrameData set matching the given names or IDs.
    */
    getFrames: function (frames, useNumericIndex, output) {

        if (useNumericIndex === undefined) { useNumericIndex = true; }
        if (output === undefined) { output = []; }

        if (frames === undefined || frames.length === 0)
        {
            //  No input array, so we loop through all frames
            for (var i = 0; i < this._frames.length; i++)
            {
                //  We only need the indexes
                output.push(this._frames[i]);
            }
        }
        else
        {
            //  Input array given, loop through that instead
            for (var i = 0; i < frames.length; i++)
            {
                //  Does the input array contain names or indexes?
                if (useNumericIndex)
                {
                    //  The actual frame
                    output.push(this.getFrame(frames[i]));
                }
                else
                {
                    //  The actual frame
                    output.push(this.getFrameByName(frames[i]));
                }
            }
        }

        return output;

    },

    /**
    * Returns all of the Frame indexes in this FrameData set.
    * The frames indexes are returned in the output array, or if none is provided in a new Array object.
    *
    * @method Phaser.FrameData#getFrameIndexes
    * @param {Array} [frames] - An Array containing the indexes of the frames to retrieve. If undefined or the array is empty then all frames in the FrameData are returned.
    * @param {boolean} [useNumericIndex=true] - Are the given frames using numeric indexes (default) or strings? (false)
    * @param {Array} [output] - If given the results will be appended to the end of this array otherwise a new array will be created.
    * @return {Array} An array of all Frame indexes matching the given names or IDs.
    */
    getFrameIndexes: function (frames, useNumericIndex, output) {

        if (useNumericIndex === undefined) { useNumericIndex = true; }
        if (output === undefined) { output = []; }

        if (frames === undefined || frames.length === 0)
        {
            //  No frames array, so we loop through all frames
            for (var i = 0; i < this._frames.length; i++)
            {
                output.push(this._frames[i].index);
            }
        }
        else
        {
            //  Input array given, loop through that instead
            for (var i = 0; i < frames.length; i++)
            {
                //  Does the frames array contain names or indexes?
                if (useNumericIndex)
                {
                    output.push(this._frames[frames[i]].index);
                }
                else
                {
                    if (this.getFrameByName(frames[i]))
                    {
                        output.push(this.getFrameByName(frames[i]).index);
                    }
                }
            }
        }

        return output;

    }

};

Phaser.FrameData.prototype.constructor = Phaser.FrameData;

/**
* @name Phaser.FrameData#total
* @property {number} total - The total number of frames in this FrameData set.
* @readonly
*/
Object.defineProperty(Phaser.FrameData.prototype, "total", {

    get: function () {
        return this._frames.length;
    }

});
