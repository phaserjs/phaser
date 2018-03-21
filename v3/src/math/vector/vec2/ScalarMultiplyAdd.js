let vec2 = Float32Array;

export default function (a, b, c, dst = new vec2(2)) {

    dst[0] = a[0] + b[0] * c;
    dst[1] = a[1] + b[1] * c;

    return dst;

}
