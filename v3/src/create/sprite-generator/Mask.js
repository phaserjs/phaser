/**
 *   The Mask class defines a 2D template form which sprites can be generated.
 *
 *   @class Mask
 *   @constructor
 *   @param {data} Integer array describing which parts of the sprite should be
 *   empty, body, and border. The mask only defines a semi-ridgid stucture
 *   which might not strictly be followed based on randomly generated numbers.
 *
 *      -1 = Always border (black)
 *       0 = Empty
 *       1 = Randomly chosen Empty/Body
 *       2 = Randomly chosen Border/Body
 *
 *   @param {width} Width of the mask data array
 *   @param {height} Height of the mask data array
 *   @param {mirrorX} A boolean describing whether the mask should be mirrored on the x axis
 *   @param {mirrorY} A boolean describing whether the mask should be mirrored on the y axis
export default function Mask (data, width, height, mirrorX = true, mirrorY = true) {

    return {
        data,
        width,
        height,
        mirrorX,
        mirrorY
    };

}
 */
