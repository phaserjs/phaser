import Clamp from 'math/Clamp.js';

//  Get the angle in radians between the two given vectors

export default function (a, b) {

    const dot = a[0] * b[0] + a[1] * b[1];
    const len = Math.sqrt(a[0] * a[0] + a[1] * a[1]);
    const lenV = Math.sqrt(b[0] * b[0] + b[1] * b[1]);

    return Math.acos(Clamp(dot / (len * lenV), -1, 1));

}
