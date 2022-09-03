let ctx = null, canvas = null, slider= null; counter = null;


/*class Triangle{
    constructor(sideLength, xPosition, yPosition, color){
        this.sideLength = sideLength;
        this.color = color;
        this.xPosition = xPosition;
        this.yPosition = yPosition
    }
*/

function drawSierpinskiTriangle(position, sideLength, numberOfSteps){
    const innerTriangleSidelength = sideLength / 2; //At each step the outer triangle is divided by 2 for obtaining the length of the inner triangle or triangles
    const innerTrianglesPositions = [
      position,
      [ position[0] + innerTriangleSidelength, position[1] ],
      [ position[0] + innerTriangleSidelength / 2, position[1] - Math.sin(Math.PI/3) * innerTriangleSidelength]
    ]; 

    if(numberOfSteps == 0) { //base case 
      innerTrianglesPositions.forEach((trianglePosition) => {
        drawTriangle(trianglePosition, innerTriangleSidelength);
      });
    } else {
      innerTrianglesPositions.forEach((trianglePosition) => {
       drawSierpinskiTriangle(trianglePosition, innerTriangleSidelength, numberOfSteps - 1);
      });
    }

    

}

function drawTriangle(position, sideLength){
    ctx.beginPath();
    ctx.moveTo(...position);// Spread operator for receiving x,y 
    ctx.fillStyle = "white";

    //Top vertex's position is calculation using a trigonometric ratio
    
    ctx.lineTo(position[0] + sideLength / 2, position[1] - sideLength * Math.sin(Math.PI/3)); //initial position + half of the length on x; move up on the canvas by substracting the hypotenuse from the y initial position
    ctx.lineTo(position[0] + sideLength, position[1]); // Move down to the right vertex 
    ctx.lineTo(...position); // Go back to the left
    ctx.closePath();
    ctx.fill(); // fill triangle

}

function updateSlider(){

}

function main(){
    canvas = document.getElementById("animationCanvas");
    ctx = canvas.getContext("2d");
    slider = document.getElementById("slider")
    counter = document.getElementById("sliderVal")
   
    slider.oninput = function(){  //Update Slider Value
      counter.innerHTML = slider.value; //
      console.log(slider.value)
      ctx.clearRect(0,0, canvas.width, canvas.height); // Every time the slider is dragged, clear the canvas
      drawSierpinskiTriangle([150, 290], 300, slider.value);// Draw a Sierpinski Triangle with as much steps as the slider Value
    }

    drawSierpinskiTriangle([150, 290], 300, slider.value); // Draw the initial triangle

    

   

}