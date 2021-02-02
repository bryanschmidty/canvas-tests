let canvas = document.querySelector('canvas');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let c = canvas.getContext('2d');


let catArray = [];
let mouseArray = [];

let mouse = {
    x: undefined,
    y: undefined
};
let images;


Number.prototype.map = function (in_min, in_max, out_min, out_max) {
    return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};
window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
    // circleArray[0].targetX = mouse.x;
    // circleArray[0].targetY = mouse.y;
});
window.addEventListener('mouseup', function(event) {
    spawnMouse(event.x, event.y);
    // circleArray.push(new Circle(event.x, event.y, undefined, 1));
    // circleArray[0].addTarget(circleArray.length - 1);
});
window.addEventListener('resize', function() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
});


function Circle(x, y, radius, type) {
    this.radius = typeof radius !== 'undefined' ? radius : this.originalRadius = (Math.random() * 15) + 5;
    this.x = typeof x !== 'undefined' ? x : Math.random() * (innerWidth - this.radius * 2);
    this.y = typeof y !== 'undefined' ? y : Math.random() * (innerHeight - this.radius * 2);
    this.direction = Math.random() * 2 * Math.PI;
    this.speed = this.originalSpeed = (Math.random() * 2) + 1;
    this.turnRadius = 0.3;
    this.turnFrequency = 0.3;
    this.r = Math.random() * 255;
    this.b = Math.random() * 255;
    this.g = Math.random() * 255;
    this.color = this.originalColor = `rgb(${this.r}, ${this.g}, ${this.b})`;
    this.target;
    this.targetX;// = canvas.width / 2;
    this.targetY;// = canvas.height / 2;
    this.type = typeof type !== 'undefined' ? type : 0;
    this.sleeping = false;

    this.draw = function() {
        // c.beginPath();
        // c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        // c.fillStyle = this.color;
        // c.fill();

        c.drawImage(images[this.type], this.x, this.y, this.radius * 2, this.radius * 2);

        //draw vector line
        // c.beginPath();
        // c.moveTo(this.x, this.y);
        // c.lineTo(this.x + (this.dx * 15), this.y + (this.dy * 15));
        // c.strokeStyle = '#535353';
        // c.stroke();
    };

    this.update = function() {
        console.log(this.sleeping, this.speed);
        if (this.x > innerWidth - this.radius || this.x < this.radius) {
            this.direction = Math.PI - this.direction;
        }
        if (this.y > innerHeight - this.radius || this.y < this.radius) {
            this.direction = (Math.PI * 2) - this.direction;
        }
        // console.log(this.dy, this.dx, Math.atan2(this.dy, this.dx));
        // this.calculateVector();
        if (this.type === 0) {
            if (this.sleeping && mouseArray.length < 3) {
                // do nothing
            } else
            if (!this.hasTarget() && mouseArray.length >= 1) {
                this.addTarget(0);
            } else
            if (this.hasTarget()) {
                // console.log('has target');
                this.targetX = mouseArray[this.target].x;

                this.targetY = mouseArray[this.target].y;
                if (Math.hypot(this.x - this.targetX, this.y - this.targetY) < 10) {
                    this.target = this.targetX = this.targetY = undefined;
                    mouseArray.shift();
                } else {
                    this.direction = Math.atan2(this.targetY - this.y, this.targetX - this.x);
                    this.speed = this.originalSpeed * 4;
                }
            } else if (Math.random() < this.turnFrequency && !this.hasTarget()) {
                this.direction += (Math.random() * this.turnRadius * (Math.random() < 0.5 ? -1 : 1));
                this.speed = this.originalSpeed;
            } else if (Math.random() < 0.1) {
                this.sleeping = true;
                this.speed = 0;
            }
        }
        this.calculateVector();

        this.x += this.dx;
        this.y += this.dy;

        this.draw();
    };

    this.addTarget = function(index) {
        this.target = index;
        this.sleeping = false;
        this.speed = this.originalSpeed;
    };

    this.hasTarget = function() {
        return typeof this.target !== 'undefined';
        // return typeof this.targetX !== "undefined" && typeof this.targetY !== "undefined";
    };

    this.calculateVector = function() {
        this.dx = this.speed * Math.cos(this.direction);
        this.dy = this.speed * Math.sin(this.direction);
    };

    this.calculateVector();
}

function spawnMouse(x, y) {
    mouseArray.push(new Circle(x, y, 15, 1));
}
function spawnCat() {
    catArray.push(new Circle(undefined, undefined, 40));
}

// for (let i = 0; i < 100; i++) {
//     let c = new Circle();
//     c.draw();
//     circleArray.push(c);
// }
// circleArray.push(new Circle(undefined, undefined, 40));
function init() {

    images = [
        resources.get('images/cat.png'),
        resources.get('images/mouse.png')
    ];
    spawnCat();
    for (let i = 0; i < 5; i ++) {
        spawnMouse();
    }
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0,0,innerWidth, innerHeight);
    c.fillStyle = '#202020';
    c.fillRect(0, 0, canvas.width, canvas.height);

    catArray.forEach(function(cat) {
        cat.update();
    });
    mouseArray.forEach(function(mouse) {
        mouse.update();
    });

    if (Math.random() < mouseArray.length.map(0, 10, 0.01, 0.001)) {
        spawnMouse();
    }
}
// animate();

var resourceCache = {};
var loading = [];
var readyCallbacks = [];

// Load an image url or an array of image urls
function load(urlOrArr) {
    if(urlOrArr instanceof Array) {
        urlOrArr.forEach(function(url) {
            _load(url);
        });
    }
    else {
        _load(urlOrArr);
    }
}

function _load(url) {
    if(resourceCache[url]) {
        return resourceCache[url];
    }
    else {
        var img = new Image();
        img.onload = function() {
            resourceCache[url] = img;

            if(isReady()) {
                readyCallbacks.forEach(function(func) { func(); });
            }
        };
        resourceCache[url] = false;
        img.src = url;
    }
}

function get(url) {
    return resourceCache[url];
}

function isReady() {
    var ready = true;
    for(var k in resourceCache) {
        if(resourceCache.hasOwnProperty(k) &&
            !resourceCache[k]) {
            ready = false;
        }
    }
    return ready;
}

function onReady(func) {
    readyCallbacks.push(func);
}

window.resources = {
    load: load,
    get: get,
    onReady: onReady,
    isReady: isReady
};
resources.load([
    'images/cat.png',
    'images/mouse.png'
]);
resources.onReady(init);