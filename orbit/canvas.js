let canvas = document.querySelector('canvas');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let config = {
    is2d: true,
    numParticles: 400,
    minRadius: 40,
    maxRadius: 120
};

let c = canvas.getContext('2d');

const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2
};

const colors = [
    '#00bdff',
    '#4d39ce',
    '#088eff'
];


addEventListener('mousemove', event => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function pickRadius() {
    return randomIntFromRange(config.minRadius, config.maxRadius);
}

function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
}
Number.prototype.map = function (in_min, in_max, out_min, out_max) {
    return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};

function Particle(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.radians = Math.random() * Math.PI * 2;

    const staticDistance = pickRadius();
    this.distanceFromCenter = {
        x: config.is2d ? staticDistance : pickRadius(),
        y: config.is2d ? staticDistance : pickRadius()
    };
    this.velocity = Math.random() * 0.05 * staticDistance.map(config.maxRadius, config.minRadius, 0.03, 1.2);
    this.lastMouse = {
        x: x,
        y: y
    };

    this.update = () => {
        const lastPoint = {
            x: this.x,
            y: this.y
        };
        this.radians += this.velocity;
        this.lastMouse.x += (mouse.x - this.lastMouse.x) * 0.05;
        this.lastMouse.y += (mouse.y - this.lastMouse.y) * 0.05;
        this.x = this.lastMouse.x + Math.cos(this.radians) * this.distanceFromCenter.x;
        this.y = this.lastMouse.y + Math.sin(this.radians) * this.distanceFromCenter.y;
        this.draw(lastPoint);
    };

    this.draw = lastPoint => {
        c.beginPath();
        c.strokeStyle = this.color;
        c.lineWidth = this.radius;
        c.moveTo(lastPoint.x, lastPoint.y);
        c.lineTo(this.x, this.y);
        c.stroke();
        // c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        // c.fillStyle = this.color;
        // c.fill();
        c.closePath();
    };

}

let particles;
function init() {
    particles = [];

    for (let i = 0; i < config.numParticles; i++) {
        const radius = (Math.random() * 2) + 1;
        particles.push(new Particle(canvas.width / 2, canvas.height / 2, radius, randomColor(colors)));
    }
}
init();

function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = 'rgba(0, 0, 0, 0.03)';
    c.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.update();
    });
}
animate();