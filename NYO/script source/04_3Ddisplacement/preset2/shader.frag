precision mediump float;

varying vec2 vTexCoord;

// Get the normal from the vertex shader
varying vec3 vNormal;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_threshold;
uniform vec2 texelSize;

mat2 rotate(float angle) {
  return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

float luma(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}

void main() {

  // Normalize the normal
  vec3 color = vNormal * 0.5 + 0.5 ;


  float cuts_size = 5.0 * (1.1 - 0.1 / u_resolution.x);

  float angle = 0.1;
      
  vec2 Yoffset = 10.0 * sin(angle) * vec2(cos(angle), sin(angle));
  vec2 Y2offset = 10.0 * sin(angle) * vec2(cos(angle), sin(angle));
  vec2 Xoffset = 10.0 * sin(angle) * vec2(cos(angle), sin(angle));
  vec2 X2offset = 10.0 * sin(angle) * vec2(cos(angle), sin(angle));

    // Change the offset direction between cuts
  vec2 rotated_pos = (gl_FragCoord.xy - 0.5 * u_resolution) + 0.5 * u_resolution;
 
  Yoffset *= 2.0 * floor(mod(rotated_pos.y / cuts_size, 3.0)) - 0.5;
  Yoffset *= 2.0 * floor(mod(rotated_pos.y / cuts_size, 9.0)) - 0.5;
  Xoffset *= 2.0 * floor(mod(rotated_pos.x / cuts_size, 3.0)) - 0.5;
  X2offset *= 2.0 * floor(mod(rotated_pos.x / cuts_size, 9.0)) - 4.5;

  color.br += Yoffset / 4.0;
  color.rg += Y2offset/4.0;
  color.gr += Xoffset / 4.0;
  color.gb += X2offset / 4.0;

  float gray = luma(color.rgb);

  float thresholdStep = 0.0;

  thresholdStep +=  u_threshold;

  float thresh = step(thresholdStep, gray);

  // Lets just draw the texcoords to the screen
  gl_FragColor = vec4(thresh, thresh, thresh, 1.0);
}