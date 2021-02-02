let canvas = document.querySelector('canvas');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let c = canvas.getContext('2d');

let mouse = {
    x: undefined,
    y: undefined
};

let colorPallets = [
    [
        '#CBFF8C',
        '#E3E36A',
        '#C16200',
        '#881600',
        '#4E0110'
    ],
    [
        '#5BC0EB',
        '#FDE74C',
        '#9BC53D',
        '#C3423F',
        '#404E4D'
    ],
    [
        '#67BF9E',
        '#458069',
        '#8AFFD2',
        '#7CE6BD',
        '#224035'
    ],
    [
        '#803961',
        '#BF5692',
        '#CC5C9B',
        '#A64B7E',
        '#401D31'
    ],
    [
        '#f1f3f4',
        '#79bac1',
        '#2a7886',
        '#512b58'
    ],
    [
        '#ffc2c2',
        '#ff9d9d',
        '#ff2e63',
        '#010a43'
    ]
];

let colorArray = [];
let circleArray = [];

function random(min, max) {
    return Math.random() * (max - min + 1) + min;
}
// window.addEventListener('mousemove', function(event) {
//     mouse.x = event.x;
//     mouse.y = event.y;
// });
window.addEventListener('resize', function() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
});

function Circle() {
    this.radius = random(2, 4);//this.originalRadius = (Math.random() * 5) + 5;
    this.x = Math.random() * (innerWidth - this.radius * 2);
    this.y = -10;
    this.dx = random(0.0001, 0.002);
    this.dy = 1;//((Math.random() * 1) + 1) * (Math.random() < 0.5 ? -1 : 1) /2;
    this.r = Math.random() * 255;
    this.b = Math.random() * 255;
    this.g = Math.random() * 255;
    this.color = 'white';//this.originalColor = `rgb(${this.r}, ${this.g}, ${this.b})`;
    this.t = random(0, 20);

    this.draw = function() {
        // console.log('hi');
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        // c.fillStyle=`rgb(${this.r}, ${this.g}, ${this.b})`;
        c.fillStyle = this.color;
        c.fill();
    };

    this.update = function(dt) {
        this.t += dt;

        this.x += this.dx * Math.cos(this.t);
        this.y += this.dy;

        if (Math.abs(mouse.x - this.x) < 60 && Math.abs(mouse.y - this.y) < 60) {
            this.radius += this.radius < (this.originalRadius + 30) ? .5 : 0;

        } else {
            this.radius -= this.radius > this.originalRadius ? .5 : 0;
        }

        this.draw();
    };
}

function addCircle() {
    let c = new Circle();
    c.draw();
    circleArray.push(c);
}
for (let i = 0; i < 201; i++) {
    addCircle();
    circleArray[i].y = Math.random() * (innerHeight - circleArray[i].radius * 2) - innerHeight;
}

function update(dt) {

    // c.fillStyle = 'black';
    c.clearRect(0,0,innerWidth, innerHeight);
    // c.fillStyle = colorArray[colorArray.length - 1];
    // c.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = circleArray.length - 1; i >= 0; i --) {
        if (circleArray[i].y > innerHeight) {
            circleArray.splice(i, 1);
            addCircle();
        }
    }

    for (let i = 0; i < circleArray.length; i ++) {
        if (circleArray[i].y > innerHeight) {
            circleArray[i] = new Circle();
        }
        circleArray[i].update(dt);
    }
}

let lastTime = Date.now();
function animate() {
    requestAnimationFrame(animate);
    let now = Date.now();
    let dt = (now - lastTime) / 1000.0;

    update(dt);

    lastTime = now;
}
animate();