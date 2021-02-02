let canvas = document.querySelector('canvas');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let c = canvas.getContext('2d');

let config = {
    dots: [
        {
            color: '#aeaeae',
            count: 100,
            radius: [3, 10],
            speed: 1
        },
        {
            color: '#a60909',
            count: 3,
            radius: [2, 5],
            speed: 2
        },
        {
            color: '#c1c100',
            count: 5,
            radius: [3, 8],
            speed: 5
        }
    ],
    backgroundColor: '#202020'
};
let mouse = {
    x: undefined,
    y: undefined
};
let colorArray = [];
let circleArray = [];
function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
}
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

class Point {
    constructor(x, y) {
        this.x = typeof x !== 'undefined' ? x : this.randomX();
        this.y = typeof y !== 'undefined' ? y : this.randomY();
    }

    randomX() {
        return randomIntFromRange(0, canvas.width);
    }
    randomY() {
        return randomIntFromRange(0, canvas.height);
    }

    distanceTo(p) {
        return Math.hypot(this.x - p.x, this.y - p.y);
    }
    vectorTo(p) {
        return Math.atan2(this.y - p.y, this.x - p.x);
    }
}
class Dot {
    radiusRange = [2, 10];
    colors = ['#ffffff', '#9effca', '#ffffa8'];
    speed = 1;

    constructor(p) {
        this.point = p instanceof Point ? p : new Point;

        this.setRadius();
        this.setColor();
        this.setSpeed();
    }

    setRadius() {
        this.radius = randomIntFromRange(this.radiusRange[0], this.radiusRange[1]);
    }
    setColor() {
        this.color = randomColor(this.colors);
    }
    setSpeed() {
        this.dx = (Math.random() - 0.5) * this.speed;
        this.dy = (Math.random() - 0.5) * this.speed;
    }

    get point() {
        return this.p;
    }
    set point(p) {
        this.p = p;
    }
    distanceTo(p) {
        return this.p.distanceTo(p);
    }

    draw() {
        c.beginPath();
        c.arc(this.point.x, this.point.y, this.radius, 0, Math.PI*2, false);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
    }

    update() {
        if (Math.random() > 0.995) this.changeDirection();

        if (this.point.x > innerWidth - this.radius || this.point.x < this.radius) this.dx = -this.dx;
        if (this.point.y > innerHeight - this.radius || this.point.y < this.radius) this.dy = -this.dy;

        this.point.x += this.dx;
        this.point.y += this.dy;

        this.draw();
    }

    changeDirection() {
        this.dx = (Math.random() - 0.5) * this.speed;
        this.dy = (Math.random() - 0.5) * this.speed;
    }
}
class SuperDot extends Dot {
    radiusRange = [6, 20];
    colors = ['#dd0909', '#0709bc'];
    speed = 8;

    constructor(p) {
        super(p);
        super.setRadius();
        super.setColor();
        super.setSpeed();
    }
}
class BadDot extends Dot {
    radiusRange = [20, 30];
    colors = ['#000000'];
    speed = 0.5;

    constructor(p) {
        super(p);
        super.setRadius();
        super.setColor();
        super.setSpeed();
    }

    update() {
        let distance = this.distanceTo(circleArray[0].point);
        if (distance < 50) {

            console.log(this.distanceTo(circleArray[0].point));
        }

        // for (let i = 0; i < circleArray.length; i ++) {
            // if (this.distanceTo(circleArray[i].point) < 5) {
            //     console.log('close to ' + circleArray[i]);
            // }
        // }

        super.draw();
        // circleArray.forEach(function(dot) {
        //     if (this.distanceTo(dot.point) < 50) {
        //         console.log('close to ' + dot);
        //     }
        // })
    }

    // distanceTo(p) {
    //     super.distanceTo(p);
    // }
}

function Circle(radius, color, speed) {
    this.radius = radius;
    this.x = Math.random() * (innerWidth - this.radius * 2);
    this.y = Math.random() * (innerHeight - this.radius * 2);
    // this.dx = ((Math.random() * 1) + 1) * (Math.random() < 0.5 ? -1 : 1) / 2;
    // this.dy = ((Math.random() * 1) + 1) * (Math.random() < 0.5 ? -1 : 1) /2;
    // this.changeDirection()
    // this.r = Math.random() * 255;
    // this.b = Math.random() * 255;
    // this.g = Math.random() * 255;
    this.color = color;
    this.speed = speed;

    this.init = function() {
        this.changeDirection();
        // this.updateColor();
    };
    this.changeDirection = function() {
        if (Math.random() < 0.5) {

        }
        this.dx = (Math.random() - 0.5) * this.speed;
        this.dy = (Math.random() - 0.5) * this.speed;
    };

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

        if (Math.random() > 0.995) this.changeDirection();

        // if (Math.abs(mouse.x - this.x) < 60 && Math.abs(mouse.y - this.y) < 60) {
        //     this.radius += this.radius < (this.originalRadius + 30) ? .5 : 0;
        //
        // } else {
        //     this.radius -= this.radius > this.originalRadius ? .5 : 0;
        // }

        this.draw();
    };

    this.updateColor = function() {
        this.color = config.colorPalette[Math.floor(Math.random() * config.colorPalette.length)][0];
    };
    this.init();
}

// for (let i = 0; i < 10; i ++) {
//     circleArray.push(new Dot);
// }
// for (let i = 0; i < 4; i ++) {
//     circleArray.push(new SuperDot);
// }
circleArray.push(new Dot);
circleArray.push(new BadDot);
console.log(circleArray);

// config.dots.forEach(function(dot) {
//     console.log(dot.count);
//     for (let i = 0; i < dot.count; i ++) {
//         let radius = randomIntFromRange(dot.radius[0], dot.radius[1]);
//         circleArray.push(new Circle(radius, dot.color, dot.speed));
//     }
// });

// for (let i = 0; i < config.dotCount; i++) {
//     let c = new Circle();
//     c.draw();
//     circleArray.push(c);
// }

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0,0,innerWidth, innerHeight);
    c.fillStyle = config.backgroundColor;
    c.fillRect(0, 0, canvas.width, canvas.height);

    circleArray.forEach(function(dot) {
        dot.update();
    });
    // for (let i = 0; i < circleArray.length; i ++) {
    //     circleArray[i].update();
    // }
}

function init() {
    canvas.backgroundColor = config.backgroundColor;
    // animate();
}
init();
animate();