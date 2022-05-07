#ifdef GL_ES

precision mediump float;

#endif

varying vec2 vTexCoord;

uniform vec2 u_resolution;

uniform float u_mouseCoord;

uniform float u_micVolume;

uniform vec2 u_texelSize;

uniform float u_time;

uniform sampler2D u_camTexture;

float luma(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}

// color conversion functions from Sam Hocevar
// http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl
// sad to admit that I have no clue how the math inside here works, but they show up all over the web when you search for glsl rgb to hsb
// we will just use them as functions, feel free to copy and use as you like
// don't worry about what's going on in here, just copy paste into your own shaders if you need
vec3 rgb2hsb(vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = c.g < c.b ? vec4(c.bg, K.wz) : vec4(c.gb, K.xy);
  vec4 q = c.r < p.x ? vec4(p.xyw, c.r) : vec4(c.r, p.yzx);

  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsb2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}


void main() {

  vec2 uv = vTexCoord;

  // the texture is loaded upside down and backwards by default so lets flip it
  uv.y = 1.0 - uv.y;
  uv.x = 1.0 - uv.x;

    // move into a range of -0.5 - 0.5
    // uv.y -= sin(u_mouseCoord);

  float spread =  500.0;
  vec2 offset = u_texelSize * spread;

    // sample the texture using our computed tile
    // offset will remove some texcoord edge artifacting
  vec4 tex = texture2D(u_camTexture, uv); // middle middle

      // get all the neighbor pixels!
  tex += texture2D(u_camTexture, uv + vec2(-offset.x, -offset.y)); // top left
  tex += texture2D(u_camTexture, uv + vec2(0.0, -offset.y)); // top middle
  tex += texture2D(u_camTexture, uv + vec2(offset.x, -offset.y)); // top right

  tex += texture2D(u_camTexture, uv + vec2(-offset.x, 0.0)); //middle left
  tex += texture2D(u_camTexture, uv + vec2(offset.x, 0.0)); //middle right

  tex += texture2D(u_camTexture, uv + vec2(-offset.x, offset.y)); // bottom left
  tex += texture2D(u_camTexture, uv + vec2(0.0, offset.y)); // bottom middle
  tex += texture2D(u_camTexture, uv + vec2(offset.x, offset.y)); // bottom right

  tex /= 9.0;


  //INCREASE SATURATION

   // convert the texture to hsb using our function from up top
  vec3 hsb = rgb2hsb(tex.rgb);

  hsb.g *= 3.0;
  hsb.b *= 0.9;
  
  // finally convert back to rgb
  vec3 rgb = hsb2rgb(hsb);

  //THRESHOLD

  float gray = luma(rgb.rgb);

  float thresholdStep = 0.5;

  float thresh = step(thresholdStep, gray);

  // vec4(thresh, thresh, thresh, 1.0);

  gl_FragColor = vec4(thresh, thresh, thresh, 1.0);
}