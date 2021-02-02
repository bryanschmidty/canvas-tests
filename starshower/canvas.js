let canvas = document.querySelector('canvas');
backgroundColor = '#060b2c';
const π = Math.PI;
const π2 = π * 2;

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
canvas.backgroundColor = backgroundColor;

let c = canvas.getContext('2d');

colors = [
    '#2185C5',
    '#7ecefd',
    '#fff6e5',
    '#ff7f66'
];

function randomInt(min, max) {
    return Math.floor(randomNum(min, max));
}

function randomNum(min, max) {
    return Math.random() * (max - min + 1) + min;
}

Number.prototype.map = function (in_min, in_max, out_min, out_max) {
    return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};
window.addEventListener('resize', function() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    init();
});

function Star() {
    this.radius = randomInt(10, 30);
    this.x = randomInt(this.radius, canvas.width - this.radius);
    this.y = randomInt(-200, 0);
    this.velocity = {
        x: Math.sign(randomNum(-1, 1)) * randomNum(1, 3),
        y: randomNum(5, 5)
    };
    this.friction = 0.8;
    this.gravity = 0.5;
    this.color = '#e3eaef';//colors[Math.floor(Math.random() * colors.length)];
    this.breakage = 0.7;

    this.draw = function() {
        c.save();
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, π2, false);
        c.fillStyle = this.color;
        c.shadowColor = '#e3eaef';
        c.shadowBlur = 20;
        c.fill();
        c.closePath();
        c.restore();
    };

    this.update = function() {
        this.draw();

        if (this.y + this.radius + this.velocity.y > canvas.height) {
            this.velocity.y = -this.velocity.y * this.friction;
            this.shatter();
        } else {
            this.velocity.y += this.gravity;
        }
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    };

    this.shatter = function() {
        this.radius *= this.breakage;
        for (let i = 0; i < 8; i ++) {
            particles.push(new Particle(this.x, this.y));
        }
    }
}

function StaticStar() {
    Star.call(this);
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = randomInt(1, 3);
    this.velocity = {
        x: 0,
        y: 0
    };
    this.gravity = 0;
    this.color = '#86a8b4';
}

function Particle(x, y) {
    Star.call(this);
    this.x = x;
    this.y = y;
    this.radius = 2;
    this.velocity = {
        x: randomInt(-5, 5),
        y: randomInt(-10, 5)
    };
    this.friction = 0.5;
    this.gravity = 0.1;
    this.ttl = 100;

    this.draw = function() {
        c.save();
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, π2, false);
        c.fillStyle = `rgba(227, 234, 239, ${this.ttl.map(100, 0, 1, 0)}`;
        c.shadowColor = '#e3eaef';
        c.shadowBlur = 20;
        c.fill();
        c.closePath();
        c.restore();
    };

    this.update = function() {
        this.draw();

        if (this.y + this.radius + this.velocity.y > canvas.height || this.y < this.radius) {
            this.velocity.y = -this.velocity.y * this.friction;
        } else {
            this.velocity.y += this.gravity;
        }
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.ttl -= 1;
    };
}


function createMountainRange(num, height, color) {
    for (let i = 0; i < num; i ++) {
        const width = canvas.width / num;
        c.beginPath();
        c.moveTo(i * width, canvas.height);
        c.lineTo(i * width + width + 325, canvas.height);
        c.lineTo(i * width + width / 2, canvas.height - height);
        c.lineTo(i * width - 325, canvas.height);
        c.fillStyle = color;
        c.fill();
        c.closePath();
    }
}



const backgroundGradient = c.createLinearGradient(0, 0, 0, canvas.height);
backgroundGradient.addColorStop(0, '#0c1b31');
backgroundGradient.addColorStop(1, '#3f586b');

let stars;
let particles;
let backgroundStars;
function init() {
    stars = [];
    particles = [];
    backgroundStars = [];

    for (let i = 0; i < 1; i++) {
        stars.push(new Star);
    }
    for (let i = 0; i < 150; i++) {
        backgroundStars.push(new StaticStar);
    }
    animate();
}

let ticker = 0.0;
let spawnRate = randomInt(1,5);
function update(dt) {
    ticker = ticker + dt;
    c.fillStyle = backgroundGradient;
    c.fillRect(0, 0, canvas.width, canvas.height);

    backgroundStars.forEach(star => {
        star.update();
    });
    createMountainRange(1, canvas.height - 50, '#384551');
    createMountainRange(2, canvas.height - 200, '#283843');
    createMountainRange(3, canvas.height - 300, '#26333e');

    stars.forEach((star, index) => {
        star.update();
        if (star.radius < 5) {
            stars.splice(index, 1);
        }
    });
    particles.forEach((particle, index) => {
        particle.update();
        if (particle.ttl < 1) {
            particles.splice(index, 1);
        }
    });

    if (ticker > spawnRate) {
        ticker = 0.0;
        stars.push(new Star);
        spawnRate = randomInt(1, 5);
    }
}

let lastTime = Date.now();
function animate() {
    let now = Date.now();
    let dt = (now - lastTime) / 1000.0;

    update(dt);

    lastTime = now;
    requestAnimationFrame(animate);
}
init();