vec4 applyLighting (vec4 fragColor, vec3 normal)
{
    vec4 lighting = getLighting(fragColor, normal);
    return fragColor * vec4(lighting.rgb * lighting.a, lighting.a);
}
