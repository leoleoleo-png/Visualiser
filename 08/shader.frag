precision mediump float;

#define PI 3.14159265359
#define TWO_PI 6.28318530718

// grab texcoords from vert shader
varying vec2 vTexCoord;

// our textures coming from p5
uniform sampler2D u_videoTexture;
uniform sampler2D u_copyTexture;

uniform float mouseDown;

uniform float colour1;

uniform float mic;

//some custom functions

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

float luma(vec3 color) {

  return dot(color, vec3(0.299, 0.587, 0.114));

}

//main function

void main() {

  vec2 uv = vTexCoord;
  // the texture is loaded upside down and backwards by default so lets flip it
  uv.y = 1.0 - uv.y;

  // make a copy of the uvs
  vec2 feedbackUv = uv;

  // move the uv space between -1 and 1
  feedbackUv = uv * 2.0 - 1.0;

  // scale the uvs up just a tad for a feedback zoom
  feedbackUv *= 0.96;

  // return the uvs to 0 - 1 range

      //feedbackUv = feedbackUv * 0.5 + 5.5;

  feedbackUv = feedbackUv * 0.5 + 5.5;

  // get the webcam
  vec4 cam = texture2D(u_videoTexture, uv);

  // make a copy of the camera
  vec4 tex = cam;

  // calculate an angle from the hue
  // we will use these to offset the texture coordinates just a little bit
  vec3 hsb = rgb2hsb(cam.rgb);

  float angleX = cos(hsb.r * 2.0);
  float angleY = sin(hsb.r * 2.0);

  // add those angles to the tex coords and sample the feed back texture
  tex = texture2D(u_copyTexture, feedbackUv + vec2(angleX, angleY) * 0.9);

  // add some camera from the screen
  tex.rgb += cam.rgb * 1.0;

  // if tex.r > 1.0, invert the texture and swizzle the color channels around
  //tex.rgb = mix(tex.rgb, 1.5 -tex.gbr, step(1.0, tex.r) );

  tex.rgb = mix(tex.rgb, 1.5 - tex.gbr, step(10.0, tex.r));

  //float thresholdStep = 0.7;

  float thresholdStep = 0.7;

  float gray = luma(tex.rgb);

  float thresh = step(thresholdStep, gray);

  // render the output

  //INITIAL ONE

  //RED AND PINK

  vec4 finalColor = vec4(1.0, mic * (thresh / 5.0) - colour1, thresh * (colour1 * 2.0), mic);

  //other

  vec4 swag3 = vec4(0.0, mic * 8.0, mic * (thresh / 2.0) * 3.0, 0.1 + mic);

  gl_FragColor = finalColor;
}