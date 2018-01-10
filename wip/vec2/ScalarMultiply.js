let vec2 = Float32Array;

export default function (a, b, dst = new vec2(2)) {

    if (b === 0)
    {
        dst[0] = 0;
        dst[1] = 0;
    }
    else
    {
        dst[0] = a[0] * b;
        dst[1] = a[1] * b;
    }

    return dst;

}
