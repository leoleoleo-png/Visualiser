#ifdef GL_ES

precision mediump float;

#endif


precision mediump float;

varying vec2 vTexCoord;

// Get the normal from the vertex shader
varying vec3 vNormal;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_threshold;
uniform sampler2D u_texture;

mat2 rotate(float angle) {
  return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

float luma(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}

void main() {

  // Normalize the normal
  vec3 color = vNormal * 0.5 + 0.5 ;

  vec2 uv = vTexCoord;
  
  vec4 tex = texture2D(u_texture, uv);

  vec4 ballColor = vec4(color, 1.0);

  // Lets just draw the texcoords to the screen
  gl_FragColor = tex;
}

