#ifdef GL_ES

precision mediump float;

#endif

varying vec2 vTexCoord;

uniform vec2 u_resolution;

uniform float u_mouseCoord;

uniform float u_micVolume;

// uniform float u_time;

uniform sampler2D u_camTexture;

float amt = 0.1; // the amount of displacement, higher is more
float squares = 10.0; // the number of squares to render vertically

void main() {

    squares = floor(100.0-u_micVolume*10.0);

    float aspect = u_resolution.x / u_resolution.y;
    float offset = amt * 0.5;

    vec2 uv = vTexCoord;

  // the texture is loaded upside down and backwards by default so lets flip it
    uv.y = 1.0 - uv.y;
    uv.x = 1.0 - uv.x;

  // copy of the texture coords
    vec2 tc = uv;

  // move into a range of -0.5 - 0.5
    uv -= 0.5;

  // correct for window aspect to make squares
    uv.x *= aspect;

  // tile will be used to offset the texture coordinates
  // taking the fract will give us repeating patterns
    vec2 tile = fract(uv * squares + 0.5) * amt;

  // sample the texture using our computed tile
  // offset will remove some texcoord edge artifacting
    vec4 tex = texture2D(u_camTexture, tc + tile - offset);

    tex.r = 0.7 - tex.r;
    tex.g = 0.2 + tex.g;
    tex.b = 0.7 + tex.b;

    tex.w = tex.w/2.0;

    gl_FragColor = tex;
}