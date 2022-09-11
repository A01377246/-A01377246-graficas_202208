class Pacman
{
    constructor(xPos, yPos, radius, angle)
    {
        this.xPos = xPos;
        this.yPos = yPos;
        this.radius = radius;
        this.angle = d2r(45);
    }

    draw(ctx)
    {
        ctx.fillStyle = "yellow"
        ctx.beginPath();
        ctx.lineTo(this.xPos, this.yPos);
        ctx.arc(this.xPos, this.yPos, this.radius, d2r(this.angle), -d2r(180));
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.lineTo(this.xPos, this.yPos);
        ctx.arc(this.xPos, this.yPos, this.radius, -d2r(this.angle), d2r(180), true); //upper
        
        ctx.fill();
        ctx.stroke();
        //ctx.closePath()
        /*ctx.fillStyle = "white"
        ctx.beginPath();
        ctx.arc(this.xPos, this.yPos, this.radius, 0, -d2r(40), true) //upper mouth portion
        ctx.lineTo(this.xPos, this.yPos)
        ctx.arc(this.xPos, this.yPos, this.radius, d2r(40), d2r(1), true) //lower mouth portion
        ctx.closePath()
        ctx.fill()*/
    }

    update(ctx, w, h)
    {
        if(this.xPos - this.radius <= w){
            this.xPos += 1;
        }else{
            this.xPos = 0;
        }
        
        if(this.angle >= d2r(3000)) this.angle = 0;

        for(let angle = d2r(1); angle <= d2r(45); angle += d2r(1)){
           
            this.angle += d2r(angle);  
            console.log(this.angle)          
        }

        



    }
}
function d2r(degrees){
    return degrees * (Math.PI/180)

}
function update(ctx, pacman, canvas){
    requestAnimationFrame(()=>update(ctx, pacman, canvas));
    ctx.clearRect(0,0, canvas.width, canvas.height);
    pacman.draw(ctx)
    pacman.update(ctx, canvas.clientWidth, canvas.clientHeight)
   

}
function main()
{
    const canvas = document.getElementById("2dCanvas")
    const ctx = canvas.getContext("2d")

    const pacman = new Pacman(300, 150, 50, 0)

    update(ctx, pacman, canvas)
    
}

main()