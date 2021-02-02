let canvas = document.querySelector('canvas');
backgroundColor = '#060b2c';

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
canvas.backgroundColor = backgroundColor;

window.addEventListener('resize', function() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
});

let c = canvas.getContext('2d');

const π = Math.PI;
const π2 = π * 2;
let dotArray = [];
let numEaten = 0;
let speedModifier = 0.1;
let numDots = 190;

let color = {
    powerUp: 'green',
    curse: 'red'
};


Number.prototype.map = function (in_min, in_max, out_min, out_max) {
    return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};

Number.prototype.bound = function (min, max) {
    return Math.max(min, Math.min(max, this));
};
function fixRadian(radian) {
    if (typeof radian === 'Number') {
        if (this > π2) return parseFloat(radian - π2);
        if (this < 0) return parseFloat(radian + π2);
        return parseFloat(radian);
    }
    return undefined;
}
Number.prototype.fixRadian = function() {
    if (this > π2) return parseFloat(this - π2);
    if (this < 0) return parseFloat(this + π2);
    return parseFloat(this);
};
function PacMan() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.radius = 30;
    this.pctOpen = 100;
    this.mouthDir = -5;
    this.direction = Math.random() * 2 * π;
    this.target;
    this.targetDirection;

    this.speed = 1 * speedModifier;
    this.trackingSpeed = 0 * speedModifier;
    this.chasingSpeed = 6 * speedModifier;
    this.viewDistance = 60;

    this.turnRadius = 0.2;
    this.turnFrequency = 0.1;

    this.draw = function(dt) {
        this.effectTimer -= dt;
        if (this.effectTimer < 0) this.effectTimer = this.effect = undefined;

        let angle = this.pctOpen / 100 * 0.2;
        let startAngle = angle * π;
        let endAngle = (2 - angle) * π;
        c.beginPath();
        c.arc(this.x, this.y, this.radius, startAngle + this.direction, endAngle + this.direction);
        c.lineTo(this.x, this.y);
        c.closePath();
        c.fillStyle = 'yellow';
        if (this.effect === 'curse') c.fillStyle = color.curse;
        if (this.effect === 'powerup') c.fillStyle = color.powerUp;
        c.fill();
    };

    this.update = function(dt) {
        this.findNearestDot();
        this.checkTarget();
        this.calculateVector();
        this.moveForward();
        this.updateMouth();
        this.draw(dt);
    };

    this.addEffect = function(effect) {
        this.effect = effect;
        this.effectTimer = 15;
    };

    this.checkTarget = function() {
        if (typeof this.target === 'undefined') return;

        let target = dotArray[this.target];
        let distance = Math.hypot(this.x - target.x, this.y - target.y);
        if (distance < this.radius) {//} && this.pctOpen <= 100) {
            this.dotCaptured(this.target);
            return;
        }

        if (distance > this.viewDistance || !isInBounds(target.x, target.y, this.radius)) {
            this.target = undefined;
            return;
        }

        let t = this.targetDirection = Math.atan2(target.y - this.y, target.x - this.x);
        if (t !== this.direction) {
            let c = this.direction;
            let d = t - c;
            let change = (d > π ? t - (π * 2) : t) - (d < -π ? c - (π * 2) : c);
            if (Math.abs(change) > this.turnRadius) {
                this.direction += Math.sign(change) * this.turnRadius;
            } else {
                this.direction += change;
            }
        }
    };
    this.dotCaptured = function(index) {
        let target = dotArray[index];

        // add effects
        if (target.color === color.curse) this.addEffect('curse');
        if (target.color === color.powerUp) this.addEffect('powerup');

        // remove dot;
        dotArray.splice(this.target, 1);
        this.target = undefined;

        this.score = numEaten += 1;
    };
    this.findNearestDot = function() {
        if (!this.hasTarget()) {
            let nearestDistance = this.viewDistance;
            let nearestDotIndex;
            for (let i = 0; i < dotArray.length; i++) {
                let dot = dotArray[i];
                if (isInBounds(dot.x, dot.y, this.radius)) {
                    let distance = Math.hypot(this.x - dot.x, this.y - dot.y);
                    if (distance < nearestDistance) {
                        nearestDistance = distance;
                        nearestDotIndex = i;
                    }
                }
            }
            this.target = nearestDotIndex;
        }
    };

    this.calculateVector = function() {
        let speed = this.speed;
        if (this.hasTarget() && this.facingTarget()) {
            speed = this.chasingSpeed;
        } else if (this.hasTarget()) {
            speed = this.trackingSpeed;
        }
        if (this.effect === 'curse') speed *= 0.3;
        if (this.effect === 'powerup') speed = this.chasingSpeed * 1.5;

        this.dx = speed * Math.cos(this.direction);
        this.dy = speed * Math.sin(this.direction);

    };
    this.facingTarget = function() {
        let c = this.direction.fixRadian();
        let t = this.direction.fixRadian();
        let diff = Math.abs(c - t);
        return (diff < this.turnRadius);
    };

    this.moveForward = function() {
        this.x += this.dx;
        this.y += this.dy;

        if (this.hasTarget()) return;

        if (this.x > canvas.width - this.radius || this.x < this.radius) {
            this.direction = π - this.direction;
        }
        if (this.y > canvas.height - this.radius || this.y < this.radius) {
            this.direction = π2 - this.direction;
        }

        if (Math.random() < this.turnFrequency) {
            this.direction += (Math.random() * this.turnRadius * (Math.random() < 0.5 ? -1 : 1));
        }
    };

    this.hasTarget = function() {
        return typeof this.target === 'number';
    };

    this.updateMouth = function() {
        if (!this.hasTarget() && this.pctOpen === 0) return;

        this.pctOpen = (this.pctOpen + this.mouthDir).bound(0, 100);
        if (this.pctOpen === 100 || this.pctOpen === 0) this.mouthDir = -this.mouthDir;
    };
}


function isInBounds(x, y, radius) {
    return x > radius && x < canvas.width - radius &&
        y > radius && y < canvas.height - radius;
}
function random(min, max) {
    return Math.random() * (max - min + 1) + min;
}
function randomColor() {
    if (Math.random() < 0.007) return color.curse;
    if (Math.random() < 0.005) return color.powerUp;
    //return 'white';
    let r = random(0,100);
    let g = random(0,100);
    let b = random(255,255);
    let a = random(0.2, 1.0)
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}
function Dot() {
    this.radius = 10;//random(5, 10);
    this.x = random(this.radius, canvas.width - this.radius);
    this.y = random(this.radius, canvas.height - this.radius);
    this.direction = random(0, π2);

    this.color = randomColor();
    this.speed = this.originalSpeed = random(0.5, 1.5) * speedModifier;
    this.turnRadius = 0.3;
    this.turnFrequency = 0.3;

    this.draw = function() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, π2, false);
        c.strokeStyle = this.color;
        c.lineWidth = 3;
        c.stroke();
        c.save();
        c.globalAlpha = 0.7;
        c.fillStyle = this.color;
        c.fill();
        c.restore();
        c.closePath();
    };

    this.update = function() {
        if (this.x > canvas.width - this.radius || this.x < this.radius) {
            this.direction = Math.PI - this.direction;
        }
        if (this.y > canvas.height - this.radius || this.y < this.radius) {
            this.direction = (Math.PI * 2) - this.direction;
        }

        this.dx = this.speed * Math.cos(this.direction);
        this.dy = this.speed * Math.sin(this.direction);

        this.x += this.dx;
        this.y += this.dy;

        this.draw();
    };
}

p = new PacMan();
function spawnMoreDots(n) {
    for (let i = 0; i < n; i ++) {
        dotArray.push(new Dot());
    }
}
spawnMoreDots(numDots);

function update(dt) {
    c.fillStyle = backgroundColor;
    c.clearRect(0,0,innerWidth, innerHeight);
    c.fillRect(0, 0, canvas.width, canvas.height);

    let spawnRate = dotArray.length.map(0, 200, 0.05, 0.0);
    if (Math.random() < spawnRate) dotArray.push(new Dot);

    dotArray.forEach(function(dot) {
        dot.update();
    });
    p.update(dt);

    // c.font = "30px Arial";
    // c.fillStyle = '#f0f0f0';
    // c.fillText("Num. Dots", 10, 50);
    // c.fillText(dotArray.length, 10, 80);
    // c.fillText('Score', canvas.width - 150, 50);
    // c.fillText(numEaten, canvas.width - 120, 80);
}

let lastTime;
function animate() {
    let now = Date.now();
    let dt = (now - lastTime) / 1000.0;

    update(dt);

    lastTime = now;
    requestAnimationFrame(animate);
}
animate();
