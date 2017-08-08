let vec2 = Float32Array;

export default function (a, b, c, d, dst = new vec2(2)) {

    dst[0] = a[0] + b[0] + c[0] + d[0];
    dst[1] = a[1] + b[1] + c[1] + d[1];

    return dst;

}
