//  A linear interpolation between a and b (by amount 't')
//  Set into a which is returned

let vec2 = Float32Array;

export default function (a, b, t, dst = new vec2(2)) {

    dst[0] = a[0] + ((b[0] - a[0]) * t);
    dst[1] = a[1] + ((b[1] - a[1]) * t);

    return dst;

}
