float inverseRotation = -rotation - uCamera.z;
float irSine = sin(inverseRotation);
float irCosine = cos(inverseRotation);
outInverseRotationMatrix = mat3(
    irCosine, irSine, 0.0,
    -irSine, irCosine, 0.0,
    0.0, 0.0, 1.0
);
