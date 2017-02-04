let vec2 = Float32Array;

export default function (a, b, dst = new vec2(2)) {

    dst[0] = a[0] + b;
    dst[1] = a[1] + b;

    return dst;

}
