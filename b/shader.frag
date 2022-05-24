precision mediump float;

// lets grab texcoords just for fun
varying vec2 vTexCoord;

// our texture and image coming from p5
uniform sampler2D u_mainTexture;
uniform vec2 resolution;
uniform sampler2D u_distortTexture;



// how much to displace by (controlled by mouse)
uniform float u_amt;

// float amtt = 0.8; // the amount of displacement, higher is more
// float squares = 10.0; // the number of squares to render vertically

void main() {

  // float aspect = resolution.x / resolution.y;
  // float offset = amtt * 0.5;

// vec2 st = gl_FragCoord.xy/u_resolution.xy; 

  vec2 uv = vTexCoord;
  // the texture is loaded upside down and backwards by default so lets flip it
  // uv = 1.0 - uv;

  // get the webcam as a vec4 using texture2D
  vec4 main = texture2D(u_distortTexture, uv);
  
  // lets get the average color of the rgb values
  
  //float avg = dot(cam.rgb, vec3(0.5));

  float avg = dot(main.rgb, vec3(0.333));
   

  // then spread it between -1 and 1
  avg = avg  * 1.0 - 1.0;

  // we will displace the image by the average color times the amt of displacement 
  float disp = avg * u_amt;


  // displacement works by moving the texture coordinates of one image with the colors of another image
  // add the displacement to the texture coordinages
  vec4 distorted = texture2D(u_mainTexture, uv + disp);

  // // output the image  
  
  // vec2 tc = uv;

  //   uv -= 0.5;

  //     uv.x *= aspect;

  //     vec2 tile = fract(uv * squares + 0.5) * amtt;

  //       vec4 tex = texture2D(tex0, tc + tile - offset);

  //gl_FragColor = tex;
    gl_FragColor = distorted;
}