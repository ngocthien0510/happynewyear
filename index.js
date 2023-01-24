let chars, particles=[], canvas, ctx, w, h, current,
stageWidth, stageHeight,
    mouseX = 0,
    mouseY = 0,
    lastX = 0,
    lastY = 0,
    active = false;
let duration = 5000;
var MAX_PARTICLES = 1500,
    MIN_ALPHA = 0.01,
    FPS = 30;
let str = ['Happy', 'New', 'Year' , '2023'];

init();
resize();
requestAnimationFrame(render);
addEventListener('resize', resize);

function makeChar(c){
    let tmp = document.createElement('canvas');
    let size = tmp.width = tmp.height = w<400?200:300;
    let tmpCtx = tmp.getContext('2d');
    tmpCtx.font = 'bold '+size+'px Arial';
    tmpCtx.fillStyle = 'white';
    tmpCtx.textBaseline = "middle";
    tmpCtx.textAlign = "center";
    tmpCtx.fillText(c, size/2, size/2);
    let char2 = tmpCtx.getImageData(0,0,size,size);
    let char2particles = [];
    for(var i=0; char2particles.length< particles; i++){
        let x = size*Math.random();
        let y = size*Math.random();
        let offset = parseInt(y)*size*4 + parseInt(x)*4;
        if(char2.data[offset])
            char2particles.push([x-size/2,y-size/2])
    }
    return char2particles;
}

function init() {
    canvas = document.createElement('canvas');
    document.body.append(canvas);
    document.body.style.margin = 0;
    document.body.style.overflow = 'hidden'
    document.body.style.background = 'black'
    ctx = canvas.getContext('2d');

    mouseX = stageWidth * 0.5;
    mouseY = stageHeight * 0.5;
    idleBurst();

    $(window).resize(resize);
    $(window).mousemove(function(event) {
      if(!active) {
   $('.start').fadeOut(700);
      }
      active = true;
      lastX = mouseX;
      lastY = mouseY;
          mouseX = event.pageX;
          mouseY = event.pageY;
          if(particles.length < MAX_PARTICLES) createParticle();
      });
      $(window).mousedown(function(event) {
          createBurst();
      });

      setInterval(onEnterFrame, 2000 / FPS);
}
function idleBurst() {
    if(!active) {
        createBurst();
        setTimeout(idleBurst, 2200);
    }
}
function createBurst() {
    var i = 50;
    while(--i > -1 && particles.length < MAX_PARTICLES) {
        createParticle(true);
}
}
function createParticle(burst) {
    var particle = {
        size: 3 + (Math.random() * 7),
        bounce: Math.random(),
        color: "#"+((1<<24)*Math.random()|0).toString(16),
        alpha: 1,
        fade: 0.93 + (Math.random() * 0.05),
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        rotate: Math.random() * 360,
        rotateDir: (Math.random > 0.5) ? 7 : -7
    };
particle.x = mouseX;
    particle.y = mouseY;
    particle.vx = (burst) ? (0.5 - Math.random()) * 20 : lastX - mouseX;
    particle.vy = (burst) ? (0.5 - Math.random()) * 20 : lastY - mouseY;
    particles.push(particle);
}
function onEnterFrame() {
   ctx.clearRect(0, 0, stageWidth, stageHeight);
  
    var points = 5;
    var step, halfStep, start, n, dx, dy, outerRadius, innerRadius, angle;
    var particle;
    var i = particles.length;
    while(--i > -1) {
        particle = particles[i];
        particle.x += particle.vx;
        particle.y += particle.vy;
            if(particle.x - particle.size < 0) {
            particle.x = particle.size;
            particle.vx = -particle.vx * particle.bounce;
        }
        else if(particle.x + particle.size > stageWidth) {
            particle.x = stageWidth - particle.size;
            particle.vx = -particle.vx * particle.bounce;
        }
        
        if(particle.y - particle.size < 0) {
            particle.y = particle.size;
            particle.vy = -particle.vy * particle.bounce;
        }
        else if(particle.y + particle.size > stageHeight) {
        particle.y = stageHeight - particle.size;
            particle.vy = -particle.vy * particle.bounce;
        }
        
        context.fillStyle = particle.color;
        context.globalAlpha = particle.alpha;
        context.beginPath();
        
        outerRadius = particle.size;
        innerRadius = particle.size * 0.3;
        step = (Math.PI * 2) / points;
        halfStep = step / 2;
start = (particle.rotate / 180) * Math.PI;
        context.moveTo( particle.x + (Math.cos( start ) * outerRadius), 
                        particle.y - (Math.sin( start ) * outerRadius) );
        
        for(n = 1; n <= points; ++n) {
            dx = particle.x + Math.cos(start + (step * n) - halfStep) * innerRadius;
            dy = particle.y - Math.sin(start + (step * n) - halfStep) * innerRadius;
            context.lineTo( dx, dy );
            dx = particle.x + Math.cos(start + (step * n)) * outerRadius;
            dy = particle.y - Math.sin(start + (step * n)) * outerRadius;
            context.lineTo(dx, dy);
}
        context.closePath();
        context.fill();
        
        particle.alpha *= particle.fade;
        particle.rotate += particle.rotateDir;
        
        if(particle.alpha <= MIN_ALPHA) {
            particles = particles.slice(0,i).concat(particles.slice(i+1));
        }
    }
}


function resize() {
    stageWidth = $(window).width();
    stageHeight = $(window).height();
    canvas.width = stageWidth;
    canvas.height = stageHeight;
    
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
    particles = innerWidth<400? 55 : 99;
    
}

function makeChars(t) {
    let actual = parseInt(t / duration) % str.length;
    if (current === actual)
        return
    current = actual;
    chars = [...str[actual]].map(makeChar);
}

function render(t) {
    makeChars(t);
    requestAnimationFrame(render);
    ctx.fillStyle = '#00000010'
    ctx.fillRect(0, 0, w, h);
    chars.forEach((pts,i) => firework(t, i, pts));
}

function firework(t, i, pts) {
    t -= i*200;
    let id = i + chars.length*parseInt(t - t%duration);
    t = t % duration / duration;
    let dx = (i+1)*w/(1+chars.length);
    dx += Math.min(0.33, t)*100*Math.sin(id);
    let dy = h*0.5;
    dy += Math.sin(id*4547.411)*h*0.1;
    if (t < 0.33) {
      rocket(dx, dy, id, t*3);
    } else {
      explosion(pts, dx, dy, id, Math.min(1, Math.max(0, t-0.33)*2));
    }
}

function rocket(x, y, id, t) {
  ctx.fillStyle = 'white';
  let r = 2-2*t + Math.pow(t, 15*t)*16;
  y = h - y*t;
  circle(x, y, r)
}

function explosion(pts, x, y, id, t) {
  let dy = (t*t*t)*20;
  let r = Math.sin(id)*1 + 3  
  r = t<0.5 ? (t+0.5)*t*r:r-t*r
  ctx.fillStyle = `hsl(${id*55}, 55%, 55%)`;
  pts.forEach((xy,i) => {
      if (i%20 === 0)
        ctx.fillStyle = `hsl(${id*55}, 55%, ${55+t*Math.sin(t*55+i)*45}%)`;
      circle(t*xy[0] + x, h - y + t*xy[1] + dy, r)
  });
}

function circle(x,y,r) {
  ctx.beginPath();
  ctx.ellipse(x, y, r, r, 0, 0, 6.283);
  ctx.fill();
}