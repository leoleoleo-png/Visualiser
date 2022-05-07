#ifdef GL_ES

precision mediump float;

#endif

varying vec2 vTexCoord;

uniform vec2 u_resolution;

uniform float u_mouseCoord;

uniform float u_micVolume;

uniform float u_frequency;
uniform float u_amplitude;

uniform float u_time;
uniform float u_scale;
uniform vec2 u_move;

uniform sampler2D u_camTexture;

void main() {

  vec2 uv = vTexCoord;
  // the texture is loaded upside down and backwards by default so lets flip it
  uv = 1.0 - uv;

  float sineWave = sin(uv.y * u_frequency*1000.0) * u_amplitude;
  float cosWave = cos(uv.x * u_frequency*1000.0) * u_amplitude;

  // create a vec2 with our sine
  // what happens if you put sineWave in the y slot? in Both slots?
  vec2 distort = vec2(sineWave/10.0, cosWave/10.0);

  vec2 distorted = uv / 4.0 + distort;

  vec2 move = u_move;

  // add the distortion to our texture coordinates
  vec4 tex = texture2D(u_camTexture, distorted + move);

  gl_FragColor = tex;
}