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
function chooseColorPallete(index) {
    if (typeof index === 'undefined') {
        index = Math.floor(Math.random() * colorPallets.length);
    }
    colorArray = colorPallets[index];
    canvas.backgroundColor = colorArray[colorArray.length - 1];

    if (!circleArray.length) return;

    for (let i = 0; i < circleArray.length; i++) circleArray[i].updateColor();
}
chooseColorPallete();

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});
window.addEventListener('resize', function() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
});
window.addEventListener('keypress', function(event) {
    if (!['1','2','3','4','5','6'].includes(event.key)) return;

    chooseColorPallete(parseInt(event.key) - 1);
});

function Circle() {
    this.radius = this.originalRadius = (Math.random() * 5) + 5;
    this.x = Math.random() * (innerWidth - this.radius * 2);
    this.y = Math.random() * (innerHeight - this.radius * 2);
    this.dx = ((Math.random() * 1) + 1) * (Math.random() < 0.5 ? -1 : 1) / 2;
    this.dy = ((Math.random() * 1) + 1) * (Math.random() < 0.5 ? -1 : 1) /2;
    this.r = Math.random() * 255;
    this.b = Math.random() * 255;
    this.g = Math.random() * 255;
    // this.color = this.originalColor = `rgb(${this.r}, ${this.g}, ${this.b})`;

    this.draw = function() {
        // console.log('hi');
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        // c.fillStyle=`rgb(${this.r}, ${this.g}, ${this.b})`;
        c.fillStyle = this.color;
        c.fill();
    };

    this.update = function() {
        if (this.x > innerWidth - this.radius || this.x < this.radius) this.dx = -this.dx;
        if (this.y > innerHeight - this.radius || this.y < this.radius) this.dy = -this.dy;

        this.x += this.dx;
        this.y += this.dy;

        if (Math.abs(mouse.x - this.x) < 60 && Math.abs(mouse.y - this.y) < 60) {
            this.radius += this.radius < (this.originalRadius + 30) ? .5 : 0;

        } else {
            this.radius -= this.radius > this.originalRadius ? .5 : 0;
        }

        this.draw();
    };

    this.updateColor = function() {
        this.color = colorArray[Math.floor(Math.random() * (colorArray.length - 1))];
    };
    this.updateColor();
}

for (let i = 0; i < 500; i++) {
    let c = new Circle();
    c.draw();
    circleArray.push(c);
}

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0,0,innerWidth, innerHeight);
    c.fillStyle = colorArray[colorArray.length - 1];
    c.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < circleArray.length; i ++) {
        circleArray[i].update();
    }
}
animate();