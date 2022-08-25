let ctx = null, canvas = null, rightScore = 0, leftScore = 0;
class bar{
    constructor(xPos, yPos, color, width, height){

        this.xPos = xPos;
        this.yPos = yPos;
        this.color = color;
        this.width = width;
        this.height = height;
        this.up = null;
        this.speed = 2;

    }

    draw()
    {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.xPos,this.yPos,this.width,this.height)
    }


}

//This function updates the score whenever a side scores
function updateScore(side){
    
    side == "Right" ? rightScore += 1 : (side == "Left" ? leftScore += 1 : 0);

}

// This function draws the score, function is invoked whenever the ball touches the left or right edge of the screen
function drawScore(){

    ctx.fillStyle = "white";
    ctx.font = "48px serif";
    ctx.fillText(rightScore, canvas.width/3, 50);
    ctx.fillText(leftScore, (canvas.width * 2)/3, 50)

    
   
}



class ball
{
    constructor(xPos, yPos, radius, color)
    {
        this.color = color;
        this.xPos = xPos;
        this.yPos = yPos;
        this.radius = radius;

        this.up = false;
        this.right = true;

        this.speed = 1;
    }



    draw()
    {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.xPos, this.yPos, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    //This method requires the bars object for detecting collisions with the left or the right Bar
    update(xMin, xMax, yMin, yMax, bars)
    {
        let leftBar = bars[0]
        let rightBar = bars[1]



        if((this.xPos < (leftBar.xPos + this.radius + leftBar.width) && this.xPos> leftBar.xPos) && (this.yPos >= leftBar.yPos && this.yPos <= leftBar.yPos + leftBar.height)) this.right = true;
        if((this.xPos > (rightBar.xPos - this.radius) && this.xPos < rightBar.xPos)&& this.yPos >= rightBar.yPos && (this.yPos < rightBar.yPos + rightBar.height)) this.right = false;

        if (this.xPos < (xMin + this.radius)){
            this.right = true;
            updateScore("Left"); // Add a point to the left bar
        }

        if (this.xPos > (xMax - this.radius)){
            this.right= false
            updateScore("Right"); //Add a point to the right bar
        }
        
        if(this.yPos > (yMax - this.radius)) this.up = true;
        if(this.yPos < (yMin + this.radius)) this.up = false;

        if(this.right)
            this.xPos += this.speed;
        else
            this.xPos -= this.speed;

        if(this.up)
            this.yPos -= this.speed;
        else    
            this.yPos += this.speed;

    }
}

function update(sphere, bars)
{
    requestAnimationFrame(()=>update(sphere, bars));

    ctx.clearRect(0,0, canvas.width, canvas.height);
    
   sphere.draw();
        sphere.update(0, canvas.width, 0, canvas.height, bars);
   

    bars.forEach(bar =>{
        bar.draw();
    })


    drawScore();
}

function inputHandler(leftBar, rightBar){
    document.addEventListener('keydown', event=>{
        if (!(leftBar.yPos <= 0)){
            if(event.key == 'q') leftBar.yPos -= 10;
            
        }

        if(!(leftBar.yPos + leftBar.height >= canvas.height)){
        
            if(event.key =='a') leftBar.yPos += 10;

        }
       

        
        if(!(rightBar.yPos <=0)){
            if (event.key == 'o') rightBar.yPos -= 10;

          
        }


        if(!(rightBar.yPos + rightBar.height >= canvas.height)){
            if (event.key == 'l') rightBar.yPos += 10;
        }
    })
}

function main()
{
    canvas = document.getElementById("animationCanvas");
    ctx = canvas.getContext("2d");

    let barHeight = 50;
    let barWidth = 20;


    let sphere1 = new ball(Math.random() * canvas.width, Math.random() * canvas.height, 10, 'white');
    //let sphere2 = new ball(Math.random() * canvas.width, Math.random() * canvas.height, 10, 'white');
    //let sphere3 = new ball(Math.random() * canvas.width, Math.random() * canvas.height, 10, 'white');

    let bar1 = new bar(10, 30, 'green', barWidth, barHeight);
    let bar2 = new bar(canvas.width - 30, 30, 'green', barWidth, barHeight);

    inputHandler(bar1, bar2);

    update(sphere1, [bar1, bar2]);
}