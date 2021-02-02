let canvas = document.querySelector('canvas');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
canvas.style.cursor = 'none';

let c = canvas.getContext('2d');

const backgroundColor = '#06091a';
// const backgroundColor = '#8e8e8e';;
const π = Math.PI;
const π2 = π * 2;
const maxStars = 200;
let keys = []; // keeps track of keys that are pressed
let mouse = {
    x: 0,
    y: 0
}; // keeps track of mouse position
let speed = 0.1; // background star speed

// for debugging
let debug = false;
let debugSprite = undefined;
let debugInc = 5;

// Helper Functions
function randomInt(min, max) {
    return Math.floor(randomNum(min, max));
}
function randomNum(min, max) {
    return Math.random() * (max - min + 1) + min;
}
Number.prototype.map = function (in_min, in_max, out_min, out_max) {
    return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};
Number.prototype.bound = function (min, max) {
    return Math.max(min, Math.min(max, this));
};
Number.prototype.between = function (min, max) {
    return this >= min && this <= max;
};
Object.prototype.get = function(key, def) {
    return this.hasOwnProperty(key) ? this[key] : def;
};

// Event Listeners
window.addEventListener('mousemove', function (event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    // ship.move(event);
});
// window.addEventListener('mousedown', function(event) {
//     ship.fire(event);
// });
window.addEventListener('keydown', function(event) {
    event.preventDefault();
    keys[event.code] = true;

    if (event.key === 'q') {
        if (ship.weapon === 'short') ship.switchWeapon('long');
        else ship.switchWeapon('short');
    }
    if (event.key === 'e') {
        speed += 0.1;
    }

    Debug(event);
});
window.addEventListener('keyup', function(event) {
    event.preventDefault();
    keys[event.code] = false;
});
window.addEventListener('resize', function() {
    // canvas.height = window.innerHeight;
    // canvas.width = window.innerWidth;
    //
    // init();
});

let Debug = function(event) {
    if (event.key === 'p' && event.ctrlKey) {
        debug = !debug;
    }
    // if (debug && debugSprite === undefined) {
    //     debugSprite = new Sprite;
    //     debugSprite.draw();
    // } else if (!debug) {
    //     debugSprite = undefined;
    //     return;
    // }

    // if (event.key === 'w') {
    //     if (event.ctrlKey) debugSprite.sh -= debugInc;
    //     else debugSprite.sy -= debugInc;
    // }
    // if (event.key === 's') {
    //     if (event.ctrlKey) debugSprite.sh += debugInc;
    //     else debugSprite.sy += debugInc;
    // }
    // if (event.key === 'a') {
    //     if (event.ctrlKey) debugSprite.sw -= debugInc;
    //     else debugSprite.sx -= debugInc;
    // }
    // if (event.key === 'd') {
    //     if (event.ctrlKey) debugSprite.sw += debugInc;
    //     else debugSprite.sx += debugInc;
    // }
    // if (event.key === 'W') {
    //     debugSprite.dh = debugSprite.sh -= debugInc;
    // }
    // if (event.key === 'S') {
    //     debugSprite.dh = debugSprite.sh += debugInc;
    // }
    // if (event.key === 'A') {
    //     debugSprite.dw = debugSprite.sw -= debugInc;
    // }
    // if (event.key === 'D') {
    //     debugSprite.dw = debugSprite.sw += debugInc;
    // }
    // if (event.key === '[') {
    //     if (event.ctrlKey) debugInc -= 1;
    //     else if (event.shiftKey) debugInc -= 100;
    //     else debugInc -= 10;
    // }
    // if (event.key === ']') {
    //     if (event.ctrlKey) debugInc += 1;
    //     else if (event.shiftKey) debugInc -= 100;
    //     else debugInc += 10;
    // }
    // // debugInc.bound(1, Math.min(img.width, img.height));
    // console.log(debugInc, debugSprite);
};

let GameArea = function() {
    // this.box = {};
    // this.box.w = 640;
    // this.box.h = 740;
    // this.box.x = (canvas.width / 2) - (this.box.w / 2);
    // this.box.y = 10;
    this.w = 640;
    this.h = 740;
    this.x = (canvas.width / 2) - (this.w / 2);
    this.y = 10;


    this.draw = function () {
        // draw playing area
        c.beginPath();
        c.rect(this.x, this.y, this.w, this.h);
        c.strokeStyle = '#6e6e6e';
        c.lineWidth = 1;
        c.stroke();
        c.fillStyle = backgroundColor;
        c.fill();
        c.closePath();
    };

    this.update = function () {
        // if (mouse.x.between(gameArea.x, gameArea.x + gameArea.w) &&
        //     mouse.y.between(gameArea.y, gameArea.h)) {
        //     canvas.style.cursor = 'none';
        // } else {
            canvas.style.cursor = 'default';
        // }

        // this.x = (canvas.width / 2) - (this.w / 2);
        this.draw();
    };

    this.drawGUI = function() {
        // draw gui
        c.beginPath();
        c.fillStyle = '#2a2941';
        c.rect(0, 0, this.x, canvas.height);
        c.fill();
        c.rect(0, 0, canvas.width, this.y);
        c.fill();
        c.rect(this.x + this.w, 0, canvas.width, canvas.height);
        c.fill();
        c.rect(0, this.y + this.h, canvas.width, canvas.height);
        c.fill();

        c.closePath();
    };

    this.bound = function(coords) {
        let x = coords.get('x');
        let y = coords.get('y');
        let w = coords.get('w', 0);
        let h = coords.get('h', 0);
        return {
            x: x.bound(this.x + 1, this.x + this.w - w - 1),
            y: y.bound(this.y + this.h - 200, this.y + this.h - h - 1)
        };
        // ship.box.y = mouse.y.bound(boxH - 200, boxH - h - 1)
    };
};

let Ship = function() {
    this.sprite = new Sprite('ship1');

    this.dx = gameArea.x + (gameArea.w / 2);
    this.dy = gameArea.y + gameArea.h - 50;

    this.weapon = 'short';
    this.numGuns = 1;
    this.rateOfFire = 5; // rounds per second
    this.bonusRate = 1.0; // percentage bonus
    this.timeSinceLastFire = 0.0;
    this.gun = 1;
    this.gunStyle = 'alternate';
    // this.gunStyle = 'same';
    // this.gunStyle = 'spread';
    this.angle = 0;

    this.draw = function () {
        this.sprite.draw(this.dx, this.dy, this.angle);
        // if (debug) {
        //     c.beginPath();
        //     c.strokeStyle = 'white';
        //     c.strokeRect(this.dx - this.sprite.dw / 2, this.dy - this.sprite.dh / 2,
        //         this.sprite.dw, this.sprite.dh);
        //     c.stroke();
        //     c.closePath();
        // }
    };

    this.update = function (dt) {
        this.draw();

        this.timeSinceLastFire += dt;
        this.speed = keys['ShiftLeft'] ? 8 : 4;

        // console.log(keys);
        if (keys['KeyA']) this.dx -= this.speed;
        if (keys['KeyD']) this.dx += this.speed;
        if (keys['KeyW']) this.dy -= this.speed;
        if (keys['KeyS']) this.dy += this.speed;
        // if (keys['ArrowLeft']) this.angle -= 0.1;
        // if (keys['ArrowRight']) this.angle += 0.1;
        if (keys['Space']) this.fire(dt);

        let {x, y} = gameArea.bound({
            x: this.dx,
            y: this.dy,
            w: this.sprite.dw,
            h: this.sprite.dh
        });
        this.dx = x;
        this.dy = y;

        // let boxX = gameArea.box.x;
        // let boxY = gameArea.box.y;
        // let boxW = boxX + gameArea.box.w;
        // let boxH = boxY + gameArea.box.h;
        // let w = ship.box.w;
        // let h = ship.box.h;
        // ship.box.x = mouse.x.bound(boxX + 1, boxW - w - 1);
        // ship.box.y = mouse.y.bound(boxH - 200, boxH - h - 1)
    };

    this.switchWeapon = function (name) {
        this.weapon = name;
        console.log(this.weapon);
    };

    this.fire = function (dt) {
        if (this.timeSinceLastFire < 1 / (this.rateOfFire * this.bonusRate)) return;
        this.timeSinceLastFire = 0;

        if (this.gunStyle === 'alternate') {
            let x = this.sprite.dw / (this.numGuns + 1) * this.gun;
            projectiles.push(new Projectile({x: this.dx + x, y: this.dy, style: this.weapon}));

            this.gun += 1;
            if (this.gun > this.numGuns) this.gun = 1;
        }
        if (this.gunStyle === 'same') {
            for (let i = 1; i <= this.numGuns; i++) {
                let x = this.sprite.dw / (this.numGuns + 1) * i;
                projectiles.push(new Projectile({x: this.dx + x, y: this.dy, style: this.weapon}));
            }
        }
        if (this.gunStyle === 'spread') {
            for (let i = 1; i <= this.numGuns; i++) {
                let x = this.sprite.dw / (this.numGuns + 1) * i;
                let direction = i.map(1, this.numGuns, (π / 2) - 0.5, (π / 2) + 0.5);
                projectiles.push(new Projectile({x: this.dx + x, y: this.dy, style: this.weapon, direction: direction}));
            }
        }
    };
};

let Collidable = function(opt) {
    opt = opt || {};
    this.type = opt.get('type');
    this.x = opt.get('x');
    this.y = opt.get('y');
    this.object;

    switch (this.type) {
        case 'ship': this.object = new Ship; break;
        case 'asteroid': this.object = new Asteroid; break;
        case 'projectile': this.object = new Projectile(opt); break;
    }

    this.draw = function() {
        this.object.draw();
    };

    this.update = function(dt) {
        this.object.update(dt);
    }
};

let Projectile = function (opt) {
    this.type = 'Projectile';
    opt = opt || {};
    this.x = opt.get('x');
    this.y = opt.get('y');
    this.dx = 0;
    this.dy = 0;
    this.style = opt.get('style');
    this.direction = opt.get('direction', π / 2);
    this.speed = 0;

    this.projectileTypes = {};
    this.projectileTypes['short'] = {
        sprite: {
            x: 299,
            y: 334,
            w: 6,
            h: 11
        },
        box: {
            x: this.x,
            y: this.y,
            w: 8,
            h: 12
        },
        speed: -2
    };
    this.projectileTypes['long'] = {
        sprite: {
            x: 291,
            y: 333,
            w: 6,
            h: 15
        },
        box: {
            x: this.x,
            y: this.y,
            w: 9,
            h: 21
        },
        speed: -5
    };
    this.spriteData = this.projectileTypes[this.style].sprite;
    this.sprite = new Sprite({
        sx: this.spriteData.x,
        sy: this.spriteData.y,
        sw: this.spriteData.w,
        sh: this.spriteData.h
    });
    this.box = this.projectileTypes[this.style].box;
    this.speed = this.projectileTypes[this.style].speed;
    this.box.x -= this.box.w / 2;
    this.w = this.sprite.sw;
    this.h = this.sprite.sh;

    this.draw = function () {
        this.sprite.draw(this.x, this.y);
        // c.drawImage(img,
        //     this.sprite.x, this.sprite.y, this.sprite.w, this.sprite.h,
        //     this.box.x, this.box.y, this.box.w, this.box.h);
    };

    this.update = function(dt) {
        this.draw();

        this.dx = this.speed * Math.cos(this.direction);
        this.dy = this.speed * Math.sin(this.direction);
        this.x = this.box.x += this.dx;
        this.y = this.box.y += this.dy;
    };
};

let Star = function() {
    this.radius = randomNum(0.01, 0.5);
    this.x = randomInt(gameArea.x, gameArea.x + gameArea.w);
    this.y = gameArea.y;
    this.z = randomInt(1, 5);
    this.color = 'rgba(255, 255, 255, 0.5)';

    this.draw = function () {
        c.save();
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, π2, false);
        c.fillStyle = this.color;
        // c.shadowColor = this.color;
        // c.shadowBlur = this.radius * 5;
        c.fill();
        c.closePath();
        c.restore();
    };
    this.update = function () {
        this.draw();

        this.y += this.z * speed;
    };
};

let Asteroid = function(opt) {
    opt = opt || {};
    this.type = 'Asteroid';
    this.size = opt.get('size', randomInt(0,3));
    this.data = asteroidData[this.size][randomInt(0,asteroidData[this.size].length - 1)];
    this.sprite = new Sprite({
        sx: this.data[0],
        sy: this.data[1],
        sw: this.data[2],
        sh: this.data[3]
    });
    this.x = opt.get('x', randomInt(gameArea.x, gameArea.x + gameArea.w));
    this.y = opt.get('y', gameArea.y - 50);
    this.angle = 0;//randomNum(0, π2);
    this.rotation = Math.sign(Math.random() - 0.5) * randomNum(0, 0.01);
    this.life = 0.0;
    this.direction = opt.get('direction', π / 2);

    this.draw = function() {
        this.sprite.draw(this.x, this.y, this.angle);
    };

    this.update = function(dt) {
        this.draw();

        if (this.y > gameArea.y + gameArea.h) {
            this.remove = true;
            return;
        }

        this.life += dt;

        this.angle = this.rotation * this.life;

        this.speed = 5 * speed;
        this.dx = this.speed * Math.cos(this.direction);
        this.dy = this.speed * Math.sin(this.direction);
        this.x += this.dx;
        this.y += this.dy;
    };

    this.doRemove = function(projectile) {
        this.remove = true;
        if (this.size > 2) {
            let direction = randomNum(0, π2);
            asteroids.push(new Asteroid({
                x: this.x,
                y: this.y,
                size: this.size - 1,
                direction: direction
            }));
            asteroids.push(new Asteroid({
                x: this.x,
                y: this.y,
                size: this.size - 1,
                direction: direction + π
            }));
        }
    };

    this.contains = function (x, y, w, h) {
        let doesContain = false;
        c.save();
        c.translate(this.sprite.dx, this.sprite.dy);
        c.rotate(this.sprite.angle);
        c.translate(-this.sprite.dx - (this.sprite.dw / 2), -this.sprite.dy - (this.sprite.dh / 2));
        c.strokeStyle = '#777';
        // c.stroke(this.sprite.path);
        if (c.isPointInStroke(this.sprite.path, x, y) ||
            c.isPointInStroke(this.sprite.path, x + w, y) ||
            c.isPointInStroke(this.sprite.path, x + w, y + h) ||
            c.isPointInStroke(this.sprite.path, x, y + h)) {
            doesContain = true;
        }
        c.restore();

        return doesContain;
    };
};

let Sprite = function(opt) {
    opt = opt || {};
    if (typeof opt === 'string') {
        opt = spriteData[opt];
    }
    this.image = opt.get('image', img);
    this.sx = opt.get('sx', 0);
    this.sy = opt.get('sy', 0);
    this.sw = opt.get('sw', 300);
    this.sh = opt.get('sh', 300);
    this.dx = opt.get('dx', 10);
    this.dy = opt.get('dy', 10);
    this.dw = opt.get('dw', this.sw);
    this.dh = opt.get('dh', this.sh);
    this.mx = this.dx + (this.dw / 2);
    this.my = this.dy + (this.dh / 2);
    this.angle = 0;
    this.path = new Path2D;

    this.draw = function (dx, dy, angle) {
        this.dx = typeof dx === 'undefined' ? this.dx : dx;
        this.dy = typeof dy === 'undefined' ? this.dy : dy;
        this.angle = typeof angle === 'undefined' ? this.angle : angle;
        // ctx.save();
        // ctx.translate(x,y);
        // ctx.rotate(-this.angle + Math.PI/2.0);
        // ctx.translate(-x, -y);
        // ctx.drawImage(this.daggerImage,x,y,20,20);
        // ctx.restore();
        c.save();
        this.path = new Path2D;
        c.translate(this.dx, this.dy);
        c.rotate(this.angle);
        c.translate(-this.dx - (this.dw / 2), -this.dy - (this.dh / 2));
        // if (debug) {
        // c.strokeStyle = 'rgb(255,185,185)';  // some color/style
        // c.lineWidth = 2;         // thickness
        this.path.rect(this.dx, this.dy, this.dw, this.dh);
        this.path.closePath();
        if (debug) {
            c.strokeStyle = 'rgb(255,185,185)';  // some color/style
            c.lineWidth = 2;
            c.stroke(this.path);
        }
        // }
        c.drawImage(this.image, this.sx, this.sy, this.sw, this.sh, this.dx, this.dy, this.dw, this.dh);
        // c.translate(-this.dw / 2, -this.dh / 2);
        // c.rotate(-this.angle);
        c.restore();

    };
};

let Enemy = function(opt) {
    opt = opt || {};
    this.sprite = opt.get('sprite');

    this.draw = () => this.sprite.draw();
};

let Animation = function(opt) {
    opt = opt || {};
    this.sprites = opt.get('sprites');
    this.fps = opt.get('fps', 10);
    this.dx = opt.get('dx');
    this.dy = opt.get('dy');
    this.term = opt.get('term', false);
    this.currentFrame = 0;
    this.prevFrame = 0;
    this.time = 0.0;
    this.remove = false;

    this.draw = function() {
        this.sprites[this.currentFrame].draw(this.dx, this.dy);
    };

    this.update = function(dt) {
        this.time += dt;
        this.prevFrame = this.currentFrame;
        this.currentFrame = Math.floor(this.time * this.fps) % this.sprites.length;
        if (this.remove || (this.prevFrame > 0 && this.currentFrame == 0 && this.term)) {
            this.remove = true;
            return;
        }

        this.draw();
    };
};

let spriteData = {};

let animationData = {};
let stars;
let ship;
let gameArea;
let projectiles = [];
let enemies = [];
let animations = [];
let asteroids;
let asteroidData = {};
let collidables = [];
let maxAsteroids = 200;
let asteroidSpawnRate = 0.5;

function initSprites() {
    spriteData['ship1'] = {sx: 341, sy: 345, sw: 21, sh: 27, dw: 31, dh: 40};

    spriteData['enemy1'] = {sx: 237, sy: 341, sw: 29, sh: 23};
    spriteData['energyBall'] = {sx: 294, sy: 319, sw: 8, sh: 9};

    spriteData['explosionSmall0'] = {sx: 320, sy: 150, sw: 20, sh: 25};
    spriteData['explosionSmall1'] = {sx: 345, sy: 150, sw: 20, sh: 25};
    spriteData['explosionSmall2'] = {sx: 370, sy: 150, sw: 20, sh: 25};
    spriteData['explosionSmall3'] = {sx: 395, sy: 150, sw: 20, sh: 25};
    spriteData['explosionSmall4'] = {sx: 420, sy: 150, sw: 20, sh: 25};
    animationData['explosionSmall'] = [
        new Sprite('explosionSmall0'),
        new Sprite('explosionSmall1'),
        new Sprite('explosionSmall2'),
        new Sprite('explosionSmall3'),
        new Sprite('explosionSmall4'),
    ];

    addSprite('asteroidLarge1', 369, 475, 31, 28);
    addSprite('asteroidLarge2', 369, 508, 31, 28);
    addSprite('asteroidLarge3', 369, 541, 34, 25);


    asteroidData[0] = [];
    asteroidData[0][0] = [307, 488, 7, 8];
    asteroidData[0][1] = [306, 502, 9, 10];
    asteroidData[0][2] = [308, 516, 7, 8];
    asteroidData[0][3] = [307, 528, 7, 8];
    asteroidData[1] = [];
    asteroidData[1][0] = [318, 484, 13, 12];
    asteroidData[1][1] = [318, 500, 13, 12];
    asteroidData[1][2] = [320, 515, 13, 12];
    asteroidData[1][3] = [319, 533, 13, 12];
    asteroidData[2] = [];
    asteroidData[2][0] = [338, 481, 24, 14];
    asteroidData[2][1] = [338, 498, 18, 19];
    asteroidData[2][2] = [338, 520, 20, 18];
    asteroidData[2][3] = [338, 541, 20, 18];
    asteroidData[3] = [];
    asteroidData[3][0] = [369, 475, 31, 28];
    asteroidData[3][1] = [369, 508, 31, 28];
    asteroidData[3][2] = [369, 541, 34, 25];

}

function addSprite(name, sx, sy, sw, sh, dw, dh) {
    spriteData[name] = {
        sx: sx, sy: sy,
        sw: sw, sh: sh,
        dw: typeof dw === 'undefined' ? sw : dw,
        dh: typeof dh === 'undefined' ? sh : dh
    };
}

function spawnAsteroid() {
    asteroids.push(new Asteroid);
}
function createCollidable(type) {
    switch (type) {
        case 'Asteroid':
            return new Asteroid;
    }
}

function init() {
    stars = [];
    asteroids = [];

    initSprites();

    gameArea = new GameArea(); // Create game area

    // Create Stars
    for (let i = 0; i < maxStars; i++) {
        let star = new Star;
        star.y = randomInt(0, canvas.height);
        stars.push(star);
    }

    // Create asteroids
    for (let i = 0; i < maxAsteroids; i++) {
        let asteroid = new Asteroid;
        asteroid.y = randomInt(gameArea.y, gameArea.y - gameArea.h);
        asteroids.push(asteroid);
    }

    ship = new Ship;

    // for (let i = 1; i <= 10; i ++) {
    //     let coords = {
    //         dx: gameArea.box.x + (30 * i),
    //         dy: 50
    //     };
    //     enemies.push(new Enemy({sprite: new Sprite({...spriteData['enemy1'], ...coords})}));
    // }


    // animations.push(new Animation({sprites: animationData['explosionSmall'], dx: 200, dy: 200, fps: 7, term: true}));
    animate();
}

function update(dt) {
    // c.fillStyle = '#171068';
    // c.fillRect(0, 0, canvas.width, canvas.height);

    gameArea.update();

    stars.forEach((star, index) => {
        star.update();
        if (star.y > gameArea.y + gameArea.h) {
            stars.splice(index, 1);
            stars.push(new Star);
        }
    });

    for (let i = 0; i < asteroids.length; i++) {
        if (asteroids[i].remove) {
            asteroids.splice(i, 1);
            i -= 1;
            continue;
        }
        // if (asteroids[i].contains(mouse.x, mouse.y)) {
        //     asteroids[i].doRemove();
        // }

        asteroids[i].update(dt);
    }
    if (asteroids.length < maxAsteroids && Math.random() < asteroidSpawnRate) spawnAsteroid();

    // asteroids.forEach((asteroid, index) => {
    //     asteroid.update(dt);
    //     if (asteroid.y > gameArea.y + gameArea.h + 30) {
    //         asteroids.splice(index, 1);
    //         asteroids.push(new Asteroid);
    //     }
    // });

    ship.update(dt);
    enemies.forEach(enemy => enemy.draw());

    projectiles.forEach((projectile, index) => {
        if (projectile.remove) {
            projectiles.splice(index, 1);
            return;
        }
        projectile.update();
        if (projectile.y < 0 || !projectile.x.between(gameArea.x - 10, gameArea.x + gameArea.w + 10)) {
            // animations.push(new Animation({sprites: animationData['explosionSmall'], dx: projectile.box.x, dy: projectile.box.y, fps: 7, term: true}));
            projectiles.splice(index, 1);
        }

        for (let i = 0; i < asteroids.length; i++) {
            if (asteroids[i].contains(projectile.x, projectile.y, projectile.w, projectile.h)) {
                animations.push(new Animation({sprites: animationData['explosionSmall'], dx: projectile.x, dy: projectile.y, fps: 7, term: true}));
                projectile.remove = true;
                asteroids[i].doRemove();
                break;
            }
        }
    });

    animations.forEach((animation, index) => {
        if (animation.remove) {
            animations.splice(index, 1);
        } else {
            animation.update(dt);
        }
    });

    // check for collisions


    gameArea.drawGUI();

    // if (debug) {
    //     debugSprite.draw();
    // }
    // c.drawImage(img, sprite.x, sprite.y, sprite.w, sprite.h, 0, 0, 50, 50);
}

let lastTime = Date.now();
function animate() {
    let now = Date.now();
    let dt = (now - lastTime) / 1000.0;

    update(dt);

    lastTime = now;
    requestAnimationFrame(animate);
}

let img = new Image();
img.src = 'images/sprites2.png';
img.onload = function() {
    init();
};