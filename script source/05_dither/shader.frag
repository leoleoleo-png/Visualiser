#ifdef GL_ES

precision mediump float;

#endif

varying vec2 vTexCoord;

uniform vec2 u_resolution;

uniform float u_mouseCoord;

uniform float u_micVolume;

// uniform float u_time;

uniform sampler2D u_camTexture;

uniform sampler2D u_bayTexture;


float dither(vec2 position, float brightness) {
    float bayer = texture2D(u_bayTexture, position).r;
    bayer = pow(bayer, 1.0 / 2.2); //Gamma correction
    return step(bayer, brightness);
}


void main() {

    // vec2 uv = vTexCoord;

    // uv = 1.0 - uv;

    // float brightness = texture2D(u_camTexture,uv).r;

    // brightness = (sin(brightness * 1000.0) + 1.0) / 2.0;

    // //Dithering is inherently screenspace so use fragCoord
    // vec2 position = gl_FragCoord.xy / u_resolution.xy;

    // float ditheredbrightness = dither(position, brightness);

    // gl_FragColor = vec4(vec3(ditheredbrightness), 1.0);


    vec2 bayer_resolution = vec2(96.0,96.0);

    vec2 uv = vTexCoord;

    uv = 1.0 - uv;

    float brightness = texture2D(u_camTexture, uv).r;

    brightness = (sin(brightness * 1000.0) + 1.0) / 2.0;

    //Dithering is inherently screenspace so use fragCoord
    vec2 position = gl_FragCoord.xy / bayer_resolution;

    float ditheredbrightness = dither(position, brightness);

    gl_FragColor = vec4(vec3(ditheredbrightness), 1.0);
}