"use strict";

import * as shaderUtils from './shaderUtils.js';

// https://glmatrix.net/docs/module-mat4.html
const mat4 = glMatrix.mat4;

let projectionMatrix, modelViewMatrix;

let shaderVertexPositionAttribute, shaderProjectionMatrixUniform, shaderModelViewMatrixUniform;

const vertexShaderSource = `#version 300 es

        in vec3 vertexPos;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;

        void main(void) {
    	
            gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPos, 1.0);
        }`;

const fragmentShaderSource = `#version 300 es

        precision mediump float;
        out vec4 fragColor;

        void main(void) {
        fragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }`;

function update(gl, shaderProgram, Star)
{
    requestAnimationFrame(()=>update(gl, shaderProgram, Star))
    mat4.rotate(modelViewMatrix, modelViewMatrix, 0.01, [0,0,1]);
    draw(gl, shaderProgram, Star);
}

function createStar(gl) 
{
    let vertexBuffer;
    vertexBuffer =  gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    let verts = [


         0.0, 0.5, 0, 
        -0.2, 0, 0,
         0.2,0,0,
         0.9,0,0,
         -0.9,0,0,
         0.2,-0.6,0,
         0.7,-0.9,0,
         -0.7,0,0,
         0.3,0,0,
         0,-0.9,0

         

         
         
         
         
    ];
    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    let Star = {buffer:vertexBuffer, vertSize:3, nVerts:11, primtype:gl.TRIANGLE_STRIP};

    return Star;
}



function main() 
{
    let canvas = document.getElementById("webGLCanvas");
    
    let gl = initWebGL(canvas);
    initGL(gl, canvas);
    initViewport(gl, canvas);

    const shaderProgram = shaderUtils.initShader(gl, vertexShaderSource, fragmentShaderSource);

    let Star = createStar(gl);

    mat4.identity(modelViewMatrix);
    
    mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -3.333]);

    bindShaderAttributes(gl, shaderProgram);
    
    draw(gl,shaderProgram,Star)

    update(gl, shaderProgram, Star)
}

function initWebGL(canvas) 
{
    let gl = null;
    let msg = "Your browser does not support WebGL, or it is not enabled by default.";

    try 
    {
        gl = canvas.getContext("webgl2");
    } 
    catch (e)
    {
        msg = "Error creating WebGL Context!: " + e.toString();
    }

    if (!gl)
    {
        throw new Error(msg);
    }

    return gl;        
}

function initViewport(gl, canvas)
{
    gl.viewport(0, 0, canvas.width, canvas.height);
}

function initGL(gl, canvas)
{
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    modelViewMatrix = mat4.create();
    mat4.identity(modelViewMatrix);

    projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 1, 10);
}

function bindShaderAttributes(gl, shaderProgram)
{
    shaderVertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPos");
    gl.enableVertexAttribArray(shaderVertexPositionAttribute);

    shaderProjectionMatrixUniform = gl.getUniformLocation(shaderProgram, "projectionMatrix");
    shaderModelViewMatrixUniform = gl.getUniformLocation(shaderProgram, "modelViewMatrix");
}

function draw(gl, shaderProgram, obj) 
{
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(shaderProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);

    gl.vertexAttribPointer(shaderVertexPositionAttribute, obj.vertSize, gl.FLOAT, false, 0, 0);

    gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix);
    gl.uniformMatrix4fv(shaderModelViewMatrixUniform, false, modelViewMatrix);

    gl.drawArrays(obj.primtype, 0, obj.nVerts);
}

main();