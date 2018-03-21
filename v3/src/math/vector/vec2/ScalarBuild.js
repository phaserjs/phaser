let vec2 = Float32Array;

export default function (a, dst = new vec2(2)) {

    dst[0] = a;
    dst[1] = a;

    return dst;

}
