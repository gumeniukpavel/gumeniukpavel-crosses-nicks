var canvas = document.getElementById('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var context = canvas.getContext('2d');

var mouse = {
    x: undefined,
    y: undefined
}

var maxRadius = 50;

var colorArray = [
    '#ADC8FF',
    '#9EC9E8',
    '#B9F5FF',
    '#9EE8DF',
    '#ADFFDE'
];

window.addEventListener('mousemove', function(event){
    mouse.x = event.x;
    mouse.y = event.y;
})

window.addEventListener('resize', function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})

class Circle{
    constructor(x, y, dx, dy, radius){
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = radius;
        this.minRadius = radius;
        this.color = colorArray[Math.floor(Math.random() * colorArray.length)];
    }

    draw(){
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        // context.fillStyle = this.color;
        context.lineWidth = 3;
        context.strokeStyle = this.color;
        // context.fill();
        context.stroke();
    }

    update(){
        if( this.x + this.radius > innerWidth || this.x - this.radius < 0){
            this.dx = -this.dx;
        }

        if( this.y + this.radius > innerHeight || this.y - this.radius < 0){
            this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;

        if( mouse.x - this.x < 50 && mouse.x - this.x > -50
            && mouse.y - this.y < 50 && mouse.y - this.y > -50){
                if( this.radius < maxRadius ){
                    this.radius += 1;
                }
            }else if ( this.radius > this.minRadius ){
                this.radius -= 1;
            }

        this.draw();
    }

}

var circleArray = [];

for (let i = 0; i < 200; i++) {
    var radius = Math.random() * 15 + 1;
    var x = Math.random() * (innerWidth - radius * 2 ) + radius;
    var y = Math.random() * (innerHeight - radius * 2 ) + radius;
    var dx = (Math.random() - 0.5) * 2;
    var dy = (Math.random() - 0.5) * 2;
    circleArray.push(new Circle(x, y, dx, dy, radius));
}

function animate(){
    requestAnimationFrame(animate);
    context.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < circleArray.length; i++) {
        circleArray[i].update();

    }
}

// animate();
