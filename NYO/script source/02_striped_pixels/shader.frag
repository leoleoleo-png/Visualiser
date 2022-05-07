#ifdef GL_ES

precision mediump float;

#endif

varying vec2 vTexCoord;

uniform vec2 u_resolution;

uniform vec2 u_mouseCoord;

uniform float u_micVolume;

uniform vec2 u_move;

// uniform float u_time;

uniform sampler2D u_camTexture;

uniform bool u_nextBeat;


float amt = 0.1; // the amount of displacement, higher is more
float squares = 10.0; // the number of squares to render vertically

void main() {

  vec2 uv = vTexCoord;
  // the texture is loaded upside down and backwards by default so lets flip it
  uv = 1.0 - uv;

  // lets take a column of pixels from the middle of the screen and spread them across 
  //vec2 tc = vec2(u_mouseCoord.y, uv.y);

  vec2 tc = vec2(u_micVolume, uv.y);

  vec2 tc2 = vec2(u_micVolume, uv.x);

  vec2 move = u_move;


  vec4 tex;

  if(u_nextBeat) {
  tex = texture2D(u_camTexture, tc / 2.0 + move);
  } else {
  tex = texture2D(u_camTexture, tc2 / 2.0 + move);
  }

  // get the webcam as a vec4 using texture2D and our new tc variable
  

  // output the texture
  gl_FragColor = tex;
}