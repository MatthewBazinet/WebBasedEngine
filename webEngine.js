//Created from the tutorial here:
//https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial

class Mesh{
constructor(gl){
}
  CreateBuffers(gl){
 this.vertexBuffer = gl.createBuffer();

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.

  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

  // Now create an array of vertices for the object.

  this.vertices = [
    // Front face
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,

    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

    // Right face
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,
  ];

  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

// Now set up the colors for the faces. We'll use solid colors
  // for each face.

  this.faceColors = [
    [1.0,  1.0,  1.0,  1.0],    // Front face: white
    [1.0,  0.0,  0.0,  1.0],    // Back face: red
    [0.0,  1.0,  0.0,  1.0],    // Top face: green
    [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
    [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
    [1.0,  0.0,  1.0,  1.0],    // Left face: purple
  ];

  // Convert the array of colors into a table for all the vertices.

  this.colors = [];

  for (var j = 0; j < this.faceColors.length; ++j) {
    const c = this.faceColors[j];

    // Repeat each color four times for the four vertices of the face
    this.colors = this.colors.concat(c, c, c, c);
  }

  this.colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);

  // Build the element array buffer; this specifies the indices
  // into the vertex arrays for each face's vertices.

  this.indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.

  this.indices = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23,   // left
  ];

  // Now send the element array to GL

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(this.indices), gl.STATIC_DRAW);
}

  Render(gl, programInfo, projectionMatrix , modelViewMatrix)
{
  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);
  }

  // Tell WebGL how to pull out the colors from the color buffer
  // into the vertexColor attribute.
  {
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexColor,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexColor);
  }

  // Tell WebGL which indices to use to index the vertices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

  // Tell WebGL to use our program when drawing

  gl.useProgram(programInfo.program);

  // Set the shader uniforms

  gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix);
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix);

  {
    const vertexCount = 36;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }
}

}
class BoundingBox{
  constructor(maxVert_,minVert_,transform_){
    this.maxVert = maxVert_;
    this.minVert = minVert_;
    this.transform = transform_;
  }
  SetSize(){

  }
  SetPosition(pos_){
    this.pos = pos_;
  }

}
function Intersects(a,b){
  var minCornerA = GetTransformedPoint(a.minVert,a.transform);
  var maxCornerA = GetTransformedPoint(a.maxVert,a.transform);

  var minCornerB = GetTransformedPoint(b.minVert,b.transform);
  var maxCornerB = GetTransformedPoint(b.maxVert,b.transform);

  return (minCornerA[0] <= maxCornerB[0] && maxCornerA[0] >= minCornerB[0]) &&
  (minCornerA[1] <= maxCornerB[1] && maxCornerA[1] >= minCornerB[1]) &&
  (minCornerA[2] <= maxCornerB[2] && maxCornerA[2] >= minCornerB[2]);
}
function GetTransformedPoint(point_,transform_){
  return [transform_[0]+ point_[0],transform_[1]+ point_[1],transform_[2]+ point_[2]] ;
}

class GameObject{
  constructor(pos_) {
    this.pos = pos_;
    this.vel = [0.0,0.0,0.0];
    this.accel = [0.0,0.0,0.0];
    this.bb = new BoundingBox([1,1,1],[-1,-1,-1],this.pos);
  }
  SetVelocity(vel_){
    this.vel = vel_;
    console.log(this.vel);
  }
  GetVelocity(){
    return this.vel;
  }
  Update(deltaTime)
  {
    this.pos[0] += this.vel[0] * deltaTime + 0.5 * this.accel[0] * deltaTime * deltaTime;
    this.pos[1] += this.vel[1] * deltaTime + 0.5 * this.accel[1] * deltaTime * deltaTime;
    this.pos[2] += this.vel[2] * deltaTime + 0.5 * this.accel[2] * deltaTime * deltaTime;
    
    
    this.vel[0] = this.vel[0] + this.accel[0] * deltaTime;
    this.vel[1] = this.vel[1] + this.accel[1] * deltaTime;
    this.vel[2] = this.vel[2] + this.accel[2] * deltaTime;
  }
  Render(gl, programInfo, projectionMatrix , modelViewMatrix)
  {
    this.mesh.Render(gl, programInfo, projectionMatrix , modelViewMatrix);
  }
}

var cubeRotation = 0.0;
var cube = new GameObject([-3,0,-6]);

var cube2 = new GameObject([3, 0, -6]);

main();

//
// Start here
//

function main()
{
    //renderOBJ();
    InitWebGl();
}

async function renderOBJ()
{
    const canvas = document.querySelector('#glcanvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    // If we don't have a GL context, give up now

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }

    const vs = `
    attribute vec4 a_position;
    attribute vec3 a_normal;
 
    uniform mat4 u_projection;
    uniform mat4 u_view;
    uniform mat4 u_world;
 
    varying vec3 v_normal;
 
    void main() {
        gl_Position = u_projection * u_view * u_world * a_position;
        v_normal = mat3(u_world) * a_normal;
    }
    `;
 
    const fs = `
    precision mediump float;
 
    varying vec3 v_normal;
 
    uniform vec4 u_diffuse;
    uniform vec3 u_lightDirection;
 
    void main () {
        vec3 normal = normalize(v_normal);
        float fakeLight = dot(u_lightDirection, normal) * .5 + .5;
        gl_FragColor = vec4(u_diffuse.rgb * fakeLight, u_diffuse.a);
    }
    `;

    const meshProgramInfo = webglUtils.createProgramInfo(gl, [vs, fs]);
    const response = await fetch('https://webglfundamentals.org/webgl/resources/models/cube/cube.obj');  
    const text = await response.text();
    const data = parseOBJ(text);

    const bufferInfo = webglUtils.createBufferInfoFromArrays(gl, data);

    const cameraTarget = [0, 0, 0];
    const cameraPosition = [0, 0, 4];
    const zNear = 0.1;
    const zFar = 50;
 
  function degToRad(deg) {
    return deg * Math.PI / 180;
  }
 
  function render(time) {
    time *= 0.001;  // convert to seconds
 
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
 
    const fieldOfViewRadians = degToRad(60);
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const projection = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);
 
    const up = [0, 1, 0];
    // Compute the camera's matrix using look at.
    const camera = m4.lookAt(cameraPosition, cameraTarget, up);
 
    // Make a view matrix from the camera matrix.
    const view = m4.inverse(camera);
 
    const sharedUniforms = {
      u_lightDirection: m4.normalize([-1, 3, 5]),
      u_view: view,
      u_projection: projection,
    };
 
    gl.useProgram(meshProgramInfo.program);
 
    // calls gl.uniform
    webglUtils.setUniforms(meshProgramInfo, sharedUniforms);
 
    // calls gl.bindBuffer, gl.enableVertexAttribArray, gl.vertexAttribPointer
    webglUtils.setBuffersAndAttributes(gl, meshProgramInfo, bufferInfo);
 
    // calls gl.uniform
    webglUtils.setUniforms(meshProgramInfo, {
      u_world: m4.yRotation(time),
      u_diffuse: [1, 0.7, 0.5, 1],
    });
 
    // calls gl.drawArrays or gl.drawElements
    webglUtils.drawBufferInfo(gl, bufferInfo);
 
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

function InitWebGl() {
  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  // If we don't have a GL context, give up now

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

 cube.mesh = new Mesh(gl);
 cube.mesh.CreateBuffers(gl);
 cube2.mesh = new Mesh(gl);
 cube2.mesh.CreateBuffers(gl);
  // Vertex shader program

  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    varying lowp vec4 vColor;
    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `;

  // Fragment shader program

  const fsSource = `
    varying lowp vec4 vColor;
    void main(void) {
      gl_FragColor = vColor;
    }
  `;

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  // Collect all the info needed to use the shader program.
  // Look up which attributes our shader program is using
  // for aVertexPosition, aVertexColor and also
  // look up uniform locations.
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    }
  };

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  //const buffers = initBuffers(gl);

var then = 0;
  
 // Draw the scene repeatedly
  function gameLoop(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;

    drawScene(gl, programInfo, deltaTime);
    update(deltaTime);

    requestAnimationFrame(gameLoop);
  }
requestAnimationFrame(gameLoop);

}

function update(deltaTime)
{
  // Update the rotation for the next draw
  cube.Update(deltaTime);
  //cube2.Update(deltaTime);
  if(Intersects(cube.bb,cube2.bb)){
    cube.SetVelocity([-0.8,0.0,0.0]);
  }else{
    cube.SetVelocity([0.8,0.0,0.0]);
  }
  //cubeRotation += deltaTime;
  
}

//
// Draw the scene.
//
function drawScene(gl, programInfo, deltaTime) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = mat4.create();
  const modelViewMatrix2 = mat4.create();
  // Now move the drawing position a bit to where we want to
  // start drawing the square.
    
  mat4.translate(modelViewMatrix,     // destination matrix
                 modelViewMatrix,     // matrix to translate
                 cube.pos);  // amount to translate
  mat4.rotate(modelViewMatrix,  // destination matrix
              modelViewMatrix,  // matrix to rotate
              cubeRotation,     // amount to rotate in radians
              [0, 0, 1]);       // axis to rotate around (Z)
  mat4.rotate(modelViewMatrix,  // destination matrix
              modelViewMatrix,  // matrix to rotate
              cubeRotation * 0.7,// amount to rotate in radians
              [0, 1, 0]);       // axis to rotate around (X)

cube.Render(gl, programInfo, projectionMatrix, modelViewMatrix);
  mat4.translate(modelViewMatrix2,     // destination matrix
              modelViewMatrix2,     // matrix to translate
              cube2.pos);  // amount to translate
  mat4.rotate(modelViewMatrix2,  // destination matrix
              modelViewMatrix2,  // matrix to rotate
              cubeRotation,     // amount to rotate in radians
              [0, 0, 1]);       // axis to rotate around (Z)
  mat4.rotate(modelViewMatrix2,  // destination matrix
              modelViewMatrix2,  // matrix to rotate
              cubeRotation * 0.7,// amount to rotate in radians
              [0, 1, 0]);       // axis to rotate around (X)
cube2.Render(gl, programInfo, projectionMatrix, modelViewMatrix2);
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully
  
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}


// OBJ Parser made from tutorial at
// https://webglfundamentals.org/webgl/lessons/webgl-load-obj.html

function parseOBJ(text) {
  // because indices are base 1 let's just fill in the 0th data
  const objPositions = [[0, 0, 0]];
  const objTexcoords = [[0, 0]];
  const objNormals = [[0, 0, 0]];

  // same order as `f` indices
  const objVertexData = [
    objPositions,
    objTexcoords,
    objNormals,
  ];

  // same order as `f` indices
  let webglVertexData = [
    [],   // positions
    [],   // texcoords
    [],   // normals
  ];

  function newGeometry() {
    // If there is an existing geometry and it's
    // not empty then start a new one.
    if (geometry && geometry.data.position.length) {
      geometry = undefined;
    }
    setGeometry();
  }

  function addVertex(vert) {
    const ptn = vert.split('/');
    ptn.forEach((objIndexStr, i) => {
      if (!objIndexStr) {
        return;
      }
      const objIndex = parseInt(objIndexStr);
      const index = objIndex + (objIndex >= 0 ? 0 : objVertexData[i].length);
      webglVertexData[i].push(...objVertexData[i][index]);
    });
  }

  const keywords = {
    v(parts) {
      objPositions.push(parts.map(parseFloat));
    },
    vn(parts) {
      objNormals.push(parts.map(parseFloat));
    },
    vt(parts) {
      // should check for missing v and extra w?
      objTexcoords.push(parts.map(parseFloat));
    },
    f(parts) {
      const numTriangles = parts.length - 2;
      for (let tri = 0; tri < numTriangles; ++tri) {
        addVertex(parts[0]);
        addVertex(parts[tri + 1]);
        addVertex(parts[tri + 2]);
      }
    },
  };

  const keywordRE = /(\w*)(?: )*(.*)/;
  const lines = text.split('\n');
  for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
    const line = lines[lineNo].trim();
    if (line === '' || line.startsWith('#')) {
      continue;
    }
    const m = keywordRE.exec(line);
    if (!m) {
      continue;
    }
    const [, keyword, unparsedArgs] = m;
    const parts = line.split(/\s+/).slice(1);
    const handler = keywords[keyword];
    if (!handler) {
      console.warn('unhandled keyword:', keyword);  // eslint-disable-line no-console
      continue;
    }
    handler(parts, unparsedArgs);
  }

  return {
    position: webglVertexData[0],
    texcoord: webglVertexData[1],
    normal: webglVertexData[2],
    };
    
}

