//Created from the tutorial here:
//https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial
class Mesh{
  constructor(gl){
  }
    CreateBuffers(gl, object){
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
  
    //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.position), gl.STATIC_DRAW);
  
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
  
    Render(gl, programInfo, projectionMatrix , modelMatrix, viewMatrix)
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
        programInfo.uniformLocations.viewMatrix,
        false,
        viewMatrix);
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelMatrix,
        false,
        modelMatrix);
  
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
  SetPosition(transform_){
    this.transform = transform_;
  }
  getMaxVert() { return this.maxVert; }
  getMinVert() { return this.minVert; }
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
  
  class Camera {
      constructor() {
  
      }
  
      UpdateCamera() {
          this.viewMatrix = mat4.create();
          mat4.multiply(this.viewMatrix, this.rotate, this.translate);
          this.viewProjectionMatrix = mat4.create();
          mat4.multiply(this.viewProjectionMatrix, this.projectionMatrix, this.viewMatrix);
      }
  
      OnCreate(gl)
      {
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
          this.projectionMatrix = mat4.create();
  
          // note: glmatrix.js always has the first argument
          // as the destination to receive the result.
          mat4.perspective(this.projectionMatrix,
              fieldOfView,
              aspect,
              zNear,
              zFar);
  
          this.rotate = mat4.create();
          mat4.rotate(this.rotate, this.rotate, 0.0, [0.0, 1.0, 0.0]);
          this.translate = mat4.create();
          mat4.translate(this.translate, this.translate, [0.0, 0.0, -10.0]);
          this.UpdateCamera()
      }
  
      SetPosition(X, Y, Z)
      {
          this.translate = mat4.create();
          mat4.translate(this.translate, this.translate, [X, Y, Z]);
          this.UpdateCamera();
      }
  
      SetRotation(X, Y, Z, Theta)
      {
          this.rotate = mat4.create();
          mat4.rotate(this.rotate, this.rotate, Theta, [X, Y, Z]);
          this.UpdateCamera();
      }
  
      Translate(X, Y, Z)
      {
          mat4.translate(this.translate, this.translate, [X, Y, Z]);
      }
  
  }
  function CheckPlaneCollision(point_, plane_) {
    var tmpleftPlane = plane_;
    var test = tmpleftPlane[0] * point_.getXPos() + tmpleftPlane[1] * point_.getYPos() + tmpleftPlane[2] * point_.getZPos() + tmpleftPlane[3];

    if (test > -0.05)
    {
        return false;
    }
    return true;
  }

  class EnvironmentalCollisionManager {
    constructor() {
      
    }

    SetPosition(object_,planes_){
      if (CheckPlaneCollision(object_, planes_))
      {
        if (planes_[0] != 0.0)
        {
          object_.setXPos(-planes_[0] * planes_[3] - planes_[0] * 0.1);
          object_.setYPos(object_.getYPos());
          object_.setZPos(object_.getZPos());
        }else if(planes_[1] != 0.0){
          object_.setXPos(object_.getXPos());
          object_.setYPos(-planes_[1] * planes_[3] - planes_[1] * 0.1);
          object_.setZPos(object_.getZPos());
          object_.setYVel(0);
          object_.setYAccel(0);
        }
        else
        {
          object_.setXPos(object_.getXPos());
          object_.setYPos(object_.getYPos());
          object_.setZPos(-planes_[2] * planes_[3] - planes_[2] * 0.1);
        }
      }
    }
    UpdatePlane(object_, planes){
      for(var i = 0; i < planes.length; i++){
        this.SetPosition(object_,planes[i]);
      }
    };

  

    NormalizePlane(plane_){
      var Result = plane_;
      var Distance = sqrtf(plane_.x * plane_.x + plane_.y * plane_.y + plane_.z * plane_.z);
      Result.x = plane_.x / Distance;
      Result.y = plane_.y / Distance;
      Result.z = plane_.z / Distance;
      Result.w = plane_.w / Distance;
    
      return Result;
    }
  
    AddObject(object_) {
      this.objects.push(object_);
    }
  }

  class GameObject{
  
    constructor(cubeRotation_, xPos_, yPos_, zPos_) {
      
      this.cubeRotation = cubeRotation_;
      this.xPos = xPos_;
      this.yPos = yPos_;
      this.zPos = zPos_;
        this.xVel = 0.0;
        this.yVel = 0.0;
        this.zVel = 0.0;
        this.xAccel = 0.0;
        this.yAccel = 0.0;
        this.zAccel = 0.0;
      this.bb = new BoundingBox([1,1,1],[-1,-1,-1],[this.xPos,this.yPos,this.zPos]); 
    }
  
    getXPos() { return this.xPos; }
    setXPos(xPos_) { this.xPos = xPos_; }
  
    getYPos() { return this.yPos; }
    setYPos(yPos_) { this.yPos = yPos_; }
  
    getZPos() { return this.zPos; }
    setZPos(zPos_) { this.zPos = zPos_; }
  
  
      getXVel() { return this.xVel; }
      setXVel(xVel_) { this.xVel = xVel_; }
  
      getYVel() { return this.yVel; }
      setYVel(yVel_) { this.yVel = yVel_; }
  
      getZVel() { return this.zVel; }
      setZVel(zVel_) { this.zVel = zVel_; }

      getXAccel() { return this.xAccel; }
      setXAccel(xAccel_) { this.xAccel = xAccel_; }
  
      getYAccel() { return this.yAccel; }
      setYAccel(zAccel_) { this.yAccel = zAccel_; }
  
      getZAccel() { return this.zAccel; }
      setZAccel(zAccel_) { this.zAccel = zAccel_; }
  
    getRotation() { return this.cubeRotation; }
    setRotation(rotation_) { cubeRotation = rotation_; }
  
    Update(deltaTime)
    {
        this.xPos += this.xVel * deltaTime + 0.5 * this.xAccel* deltaTime * deltaTime;   
        this.yPos += this.yVel * deltaTime + 0.5 * this.yAccel* deltaTime * deltaTime;
        this.zPos += this.zVel * deltaTime + 0.5 * this.zAccel* deltaTime * deltaTime;

        this.xVel = this.xVel + this.xAccel * deltaTime;
        this.yVel = this.yVel + this.yAccel * deltaTime;
        this.zVel = this.zVel + this.zAccel * deltaTime;

        this.bb.SetPosition([this.xPos,this.yPos,this.zPos]);
      if(this.yPos > 0.0)
      {
          this.yAccel -= 1.0
      }
    }
    Render(gl, programInfo, projectionMatrix , modelMatrix, viewMatrix)
    {
      this.mesh.Render(gl, programInfo, projectionMatrix , modelMatrix, viewMatrix);
    }
  }
  
  var cubeRotation = 0.0;
  class Platform extends GameObject{
    OnCreate(){

    }
    
    Update(deltaTime)
    {
      super.Update(deltaTime);
    }
  }

  
  class Enemy extends GameObject {
  
      OnCreate() {
          this.timeSinceVelUpdate = 0.0;
      }
  
      Update(deltaTime) {
          super.Update(deltaTime);
          this.timeSinceVelUpdate += deltaTime;
          if (this.timeSinceVelUpdate > 2.0) {
              this.xVel += (Math.random() - 0.5) * 10.0 * deltaTime;
              this.zVel += (Math.random() - 0.5) * 10.0 * deltaTime;
          }
      }
  
  }
  
  var cubes = [];
  var numCubes = 0 - 3;
  
  for(let i = 0; i < numCubes; i++)
  {
      cubes[i] = new GameObject(0.0, i, 4.0, -6.0);
  }

var enemies = [];
var numEnemies = 3;

for (let i = 0; i < numEnemies; i++) {
    enemies[i] = new Enemy(0.0, i, 4.0, -6.0);
}

  var platforms = [];
  var numOfPlatformsCollumn = 5;
  var numOfPlatformsRow = 5;

  for(let i = 0; i < numOfPlatformsRow; i++)
  {
    for(let j = 0; j < numOfPlatformsCollumn; j++){
      platforms.push(new Platform(0.0, i, 4.0, -j));
    }
  }

  var cube = new GameObject(0.0, 4.0, 0.0, -6.0);
  var cube2 = new GameObject(0.0, 0.0, 0.0, -6.0);
  //var platform = new Platform(0.0, -4.0, 2.0, -6.0);
  var environmentCollision =  new EnvironmentalCollisionManager();
  var plane1 = [-1.0, 0.0, 0.0, 8.0];
  var plane2 = [1.0, 0.0, 0.0, 8.0];
  var plane3 = [0.0, 0.0, 1.0, 8.0];
  var plane4 = [0.0, 0.0, -1.0, 8.0];
  var plane5 = [0.0, 1.0, 0.0, 1.0];
  var planes = [];
  planes[0] = plane1;
  planes[1] = plane2;
  planes[2] = plane3;
  planes[3] = plane4;
  planes[4] = plane5;
  var enemy1 = new Enemy(0.0, 4.0, 4.0, -6.0);
  var camera = new Camera();
  var cameraPositionZ = -10.0;
  
  main();
  
  //
  // Start here
  //
  
  function main()
  {
      InitWebGl();
  }
  
  async function InitWebGl() {
    const canvas = document.querySelector('#glcanvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    const fpsCounter = document.querySelector("#fps");
  
    var startTime = Date.now();
    

    // If we don't have a GL context, give up now
  
    if (!gl) {
      alert('Unable to initialize WebGL. Your browser or machine may not support it.');
      return;
    }
  
   //const response = await fetch('http://web.mit.edu/djwendel/www/weblogo/shapes/basic-shapes/sphere/sphere.obj');
   const response = await fetch('https://webglfundamentals.org/webgl/resources/models/cube/cube.obj');  
   const text = await response.text();
   const cubeModel = parseOBJ(text);
  
   camera.OnCreate(gl);
  
   for(let i = 0; i < numCubes; i++)
   {
      cubes[i].mesh = new Mesh(gl);
      cubes[i].mesh.CreateBuffers(gl, cubeModel);
   }

      for (let i = 0; i < numEnemies; i++) {
          enemies[i].mesh = new Mesh(gl);
          enemies[i].mesh.CreateBuffers(gl, cubeModel);
      }
  
   cube.mesh = new Mesh(gl);
   cube.mesh.CreateBuffers(gl, cubeModel);
  
   cube2.mesh = new Mesh(gl);
   cube2.mesh.CreateBuffers(gl, cubeModel);
   for(let i = 0; i < platforms.length; i++)
   {
    platforms[i].mesh = new Mesh(gl);
    platforms[i].mesh.CreateBuffers(gl, cubeModel);
   }

      enemy1.mesh = new Mesh(gl);
      enemy1.mesh.CreateBuffers(gl, cubeModel);
      enemy1.OnCreate();
  
    // Vertex shader program
  
    const vsSource = `
      attribute vec4 aVertexPosition;
      attribute vec4 aVertexColor;
      uniform mat4 uModelMatrix;
      uniform mat4 uViewMatrix;
      uniform mat4 uProjectionMatrix;
      varying lowp vec4 vColor;
      void main(void) {
        gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aVertexPosition;
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
          modelMatrix: gl.getUniformLocation(shaderProgram, 'uModelMatrix'),
          viewMatrix: gl.getUniformLocation(shaderProgram, 'uViewMatrix'),
      }
    };
  
    console.log((Date.now() - startTime) * 0.001);
  
    // Here's where we call the routine that builds all the
    // objects we'll be drawing.
    //const buffers = initBuffers(gl);
  
    // FPS counter from here: https://stackoverflow.com/questions/47421760/how-to-record-and-display-fps-on-webgl
  
  var then = 0;
    
   // Draw the scene repeatedly
    function gameLoop(now) {
      now *= 0.001;  // convert to seconds
      const deltaTime = now - then;
      then = now;
      const fps = 1 / deltaTime;
      fpsCounter.textContent = fps.toFixed(1);
  
      drawScene(gl, programInfo, deltaTime);
      update(deltaTime);
  
      requestAnimationFrame(gameLoop);
    }
  requestAnimationFrame(gameLoop);
  
  }
  
  function update(deltaTime)
  {
    // Update the rotation for the next draw
  
    for(let i = 0; i < numCubes; i++)
    {
      cubes[i].Update(deltaTime);
    }

    cube.Update(deltaTime);
    cube2.Update(deltaTime);
    environmentCollision.UpdatePlane(cube,planes);
    environmentCollision.UpdatePlane(cube2,planes);
      if (Intersects(cube.bb, cube2.bb)) {

  
          cube2.setXVel(cube.xVel);
          cube2.setYVel(cube.yVel);
          cube2.setZVel(cube.zVel);
      }
      else {
          cube2.setXVel(0);
          cube2.setYVel(0);
          cube2.setZVel(0);
      }

      for(let i = 0; i < platforms.length; i++)
      {
        platforms[i].Update(deltaTime);
        environmentCollision.UpdatePlane(platforms[i],planes);
        if (Intersects(cube.bb, platforms[i].bb)) {
          if(cube.getYPos() > platforms[i].getYPos() + platforms[i].bb.getMinVert()[1]){
            cube.setYVel(0);
            cube.setYPos(platforms[i].getYPos() + platforms[i].bb.getMaxVert()[1] * 2);
          }
        }
      }

      for (let i = 0; i < enemies.length; i++) {
          
          enemies[i].Update(deltaTime);
          environmentCollision.UpdatePlane(enemies[i], planes);
          if (Intersects(cube.bb, enemies[i].bb)) {
              //damage player
          }
      }
    // else {
    //     cube2.setXVel(0);
    //     cube2.setYVel(0);
    //     cube2.setZVel(0);
    // }
    //cubeRotation += deltaTime;
    
  
    //cube.cubeRotation += deltaTime;
    enemy1.Update(deltaTime);
  environmentCollision.UpdatePlane(enemy1,planes);
      document.addEventListener('keydown', onKeyDown, false);
      document.addEventListener('keyup', onKeyUp, false);
  
    function onKeyDown(event)
    {
          switch(event.key)
          {
          case 'w':
          cube.setZVel(-5);
          break;
          case 'a':
          cube.setXVel(-5);
          break;
          case 's':
          cube.setZVel(5);
          break;
          case 'd':
          cube.setXVel(5);
          break;
          case ' ':
          cube.setYVel(10);
          break;
          }
      }
      ;
  
      function onKeyUp(event) {
          switch (event.key) {
              case 'w':
                  if (cube.getZVel() < 0) {
                      cube.setZVel(0);
                  }
                  break;
              case 'a':
                  if (cube.getXVel() < 0) {
                      cube.setXVel(0);
                  }
                  break;
              case 's':
                  if (cube.getZVel() > 0) {
                      cube.setZVel(0);
                  }
                  break;
              case 'd':
                  if (cube.getXVel() > 0) {
                      cube.setXVel(0);
                  }
                  break;
          }
      }
      ;
      //cameraPositionZ += 1 * deltaTime;
      //if (cameraPositionZ > -1.0) {
       //   cameraPositionZ = -10.0;
      //}
      camera.SetPosition(-cube.getXPos(), -cube.getYPos(), -cube.getZPos() - 10);
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
  
  
  
    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix2 = mat4.create();
    // Now move the drawing position a bit to where we want to
    // start drawing the square.
  
    mat4.translate(modelViewMatrix2,     // destination matrix
                modelViewMatrix2,     // matrix to translate
                [cube2.getXPos(), cube2.getYPos(), cube2.getZPos()]);  // amount to translate
    mat4.rotate(modelViewMatrix2,  // destination matrix
                modelViewMatrix2,  // matrix to rotate
                cube2.getRotation(),     // amount to rotate in radians
                [0, 0, 1]);       // axis to rotate around (Z)
    mat4.rotate(modelViewMatrix2,  // destination matrix
                modelViewMatrix2,  // matrix to rotate
                cube2.getRotation() * 0.0,// amount to rotate in radians
                [0, 1, 0]);       // axis to rotate around (X)
  cube2.Render(gl, programInfo, camera.projectionMatrix, modelViewMatrix2,camera.viewMatrix);


    
  const modelMatrix = mat4.create();
    // Now move the drawing position a bit to where we want to
    // start drawing the square.
  
    mat4.translate(modelMatrix,     // destination matrix
                   modelMatrix,     // matrix to translate
                   [cube.getXPos(), cube.getYPos(), cube.getZPos()]);  // amount to translate
    mat4.rotate(modelMatrix,  // destination matrix
                modelMatrix,  // matrix to rotate
                cube.getRotation(),     // amount to rotate in radians
                [0, 0, 1]);       // axis to rotate around (Z)
    mat4.rotate(modelMatrix,  // destination matrix
                modelMatrix,  // matrix to rotate
                cube.getRotation() * .7,// amount to rotate in radians
                [0, 1, 0]);       // axis to rotate around (X)
  
      cube.Render(gl, programInfo, camera.projectionMatrix, modelMatrix, camera.viewMatrix);
  
      const enemyModelMatrix = mat4.create();
  
      // Now move the drawing position a bit to where we want to
      // start drawing the square.
  
      mat4.translate(enemyModelMatrix,     // destination matrix
          enemyModelMatrix,     // matrix to translate
          [enemy1.getXPos(), enemy1.getYPos(), enemy1.getZPos()]);  // amount to translate
      mat4.rotate(enemyModelMatrix,  // destination matrix
          enemyModelMatrix,  // matrix to rotate
          enemy1.getRotation(),     // amount to rotate in radians
          [0, 0, 1]);       // axis to rotate around (Z)
      mat4.rotate(enemyModelMatrix,  // destination matrix
          enemyModelMatrix,  // matrix to rotate
          enemy1.getRotation() * .7,// amount to rotate in radians
          [0, 1, 0]);       // axis to rotate around (X)
  
      enemy1.Render(gl, programInfo, camera.projectionMatrix, enemyModelMatrix, camera.viewMatrix);

      for (let i = 0; i < enemies.length; i++) {
          const enemiesModelMatrix = mat4.create();
          mat4.translate(enemiesModelMatrix,     // destination matrix
              enemiesModelMatrix,     // matrix to translate
              [enemies[i].getXPos(), enemies[i].getYPos(), enemies[i].getZPos()]);  // amount to translate
          mat4.rotate(enemiesModelMatrix,  // destination matrix
              enemiesModelMatrix,  // matrix to rotate
              enemies[i].getRotation(),     // amount to rotate in radians
              [0, 0, 1]);       // axis to rotate around (Z)
          mat4.rotate(enemiesModelMatrix,  // destination matrix
              enemiesModelMatrix,  // matrix to rotate
              enemies[i].getRotation() * .7,// amount to rotate in radians
              [0, 1, 0]);       // axis to rotate around (X)
          enemies[i].Render(gl, programInfo, camera.projectionMatrix, enemiesModelMatrix, camera.viewMatrix);
      }
          for(let i = 0; i < platforms.length; i++)
          {
              const platformModelMatrix = mat4.create();
              mat4.translate(platformModelMatrix,     // destination matrix
              platformModelMatrix,     // matrix to translate
              [platforms[i].getXPos(), platforms[i].getYPos(), platforms[i].getZPos()]);  // amount to translate
              mat4.rotate(platformModelMatrix,  // destination matrix
              platformModelMatrix,  // matrix to rotate
              platforms[i].getRotation(),     // amount to rotate in radians
              [0, 0, 1]);       // axis to rotate around (Z)
              mat4.rotate(platformModelMatrix,  // destination matrix
              platformModelMatrix,  // matrix to rotate
              platforms[i].getRotation() * .7,// amount to rotate in radians
              [0, 1, 0]);       // axis to rotate around (X)
              platforms[i].Render(gl, programInfo, camera.projectionMatrix, platformModelMatrix, camera.viewMatrix);
          }
      for(let i = 0; i < numCubes; i++)
      {
          const matrices = mat4.create();
          mat4.translate(matrices,     // destination matrix
          matrices,     // matrix to translate
          [cubes[i].getXPos(), cubes[i].getYPos(), cubes[i].getZPos()]);  // amount to translate
          mat4.rotate(matrices,  // destination matrix
          matrices,  // matrix to rotate
          cubes[i].getRotation(),     // amount to rotate in radians
          [0, 0, 1]);       // axis to rotate around (Z)
          mat4.rotate(matrices,  // destination matrix
          matrices,  // matrix to rotate
          cubes[i].getRotation() * .7,// amount to rotate in radians
          [0, 1, 0]);       // axis to rotate around (X)
          cubes[i].Render(gl, programInfo, camera.projectionMatrix, matrices, camera.viewMatrix);
      }
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
  
  function Vector(components) {
    // TODO: Finish the Vector class.
    this.arr = components;
    this.add = add;
  }
  
