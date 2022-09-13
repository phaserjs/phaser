float Epsilon = 1e-10;
 
vec3 RGBToHCV(vec3 RGB)
{
    // Based on work by Sam Hocevar and Emil Persson
    vec4 P = (RGB.g < RGB.b) ? vec4(RGB.bg, -1.0, 2.0/3.0) : vec4(RGB.gb, 0.0, -1.0/3.0);
    vec4 Q = (RGB.r < P.x) ? vec4(P.xyw, RGB.r) : vec4(RGB.r, P.yzx);
    float C = Q.x - min(Q.w, Q.y);
    float H = abs((Q.w - Q.y) / (6.0 * C + Epsilon) + Q.z);
    return vec3(H, C, Q.x);
}

vec3 HUEToRGB(float H)
{
    float R = abs(H * 6.0 - 3.0) - 1.0;
    float G = 2.0 - abs(H * 6.0 - 2.0);
    float B = 2.0 - abs(H * 6.0 - 4.0);
    //return saturate(vec3(R,G,B));
    return clamp(vec3(R,G,B),0.0,1.0);
}

vec3 HSVToRGB(vec3 HSV)
{
    vec3 RGB = HUEToRGB(HSV.x);
    return ((RGB - 1.0) * HSV.y + 1.0) * HSV.z;
}

vec3 RGBToHSV(vec3 RGB)
{
    vec3 HCV = RGBToHCV(RGB);
    float S = HCV.y / (HCV.z + Epsilon);
    return vec3(HCV.x, S, HCV.z);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord.xy;
    vec2 res = iResolution.xy;
    vec2 mouseX = iMouse.xz / res.x;
    vec2 mouseY = iMouse.yw / res.y;
    
    // for some reason our image is upside down, so lets make it rightside up
    uv.y = abs(uv.y - res.y);
    
    // get the colors from the texture, pass in our UV coords
    vec4 col = texture(iChannel0, uv / res);
    
    // if the color is pure white, lets make it 0 alpha
    if (col.r == 0.0 && col.g == 0.0 && col.b == 0.0) {
        col.a = 0.0;
    }
    
    // convert to HSV
    vec3 hsv = RGBToHSV(col.rgb);
    
    // do some HSV adjustments
    // hue
    hsv.x += fract(iGlobalTime / 4.0);
    // saturation
    hsv.y += mouseX.x;
    // value
    hsv.z += mouseY.x;
    
    // convert back to RGB
    vec4 newCol = vec4(HSVToRGB(hsv), 0.0);
    
    // if we had 0 alpha in the original image, lets make it gray so we know where the alpha is
    // since shadertoy doesnt seem like it supports alpha
    if (col.a == 0.0) {
        newCol.rgb = vec3(0.3, 0.3, 0.3);
    }
    
    // set the colors back to our gl contex
    fragColor = newCol;
}
