
export function equal (a, b, precision = 1e-6) {

    return (
        Math.abs(a[0] - b[0]) <= precision &&
        Math.abs(a[1] - b[1]) <= precision
    );

}

export function less (a, b) {

    return [ a[0] < b[0], a[1] < b[1] ];

}

export function greater (a, b) {

    return [ a[0] > b[0], a[1] > b[1] ];

}

export function greaterEq (a, b) {

    return [ a[0] >= b[0], a[1] >= b[1] ];

}

export function not (a) {

    return [ !a[0], !a[1] ];

}

export function or (a, b) {

    return [ a[0] || b[0], a[1] || b[1] ];

}

export function and (a, b) {

    return [ a[0] && b[0], a[1] && b[1] ];

}
