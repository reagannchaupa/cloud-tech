// script.js

document.addEventListener('DOMContentLoaded', () => {
    console.log('Core Tech website loaded.');
    // Future interactivity will go here
});

const canvas = document.getElementById("neuralCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let dots = [];
let childDots = [];
let sparks = [];

function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
    ctx.scale(dpr, dpr); // scale to device resolution
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();


for (let i = 0; i < 100; i++) {
    dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8, // Random velocity
        vy: (Math.random() - 0.5) * 0.8, 
        radius: Math.random() * 2 + 1,
    });
}

function drawDots() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff"; // cyan/light blue
    
    for (let i = 0; i < dots.length; i++) { 
        let d = dots[i];
        d.x += d.vx;
        d.y += d.vy;

        if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
        if (d.y < 0 || d.y > canvas.height) d.vy *= -1;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    // Draw connecting lines
    for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
            let dx = dots[i].x - dots[j].x;
            let dy = dots[i].y - dots[j].y;
            let dist = Math.sqrt(dx/2 * dx + dy/2 * dy);

            if (dist < 110) {
                ctx.strokeStyle = "rgba(0,255,255,0.2)";
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(dots[i].x, dots[i].y);
                ctx.lineTo(dots[j].x, dots[j].y);
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(drawDots);
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Animate & draw main dots
    dots.forEach(dot => {
        dot.x += dot.vx;
        dot.y += dot.vy;

        if (dot.x < 0 || dot.x > canvas.width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1;

        // 👇 ADD THIS: Radius pulse effect (natural breathing)
        const pulse = Math.sin(Date.now() / 200 + dot.x) * 0.3;
        dot.r = Math.max(0.8, Math.min(dot.r + pulse, 3));  // Keep radius within range

        // Brightness based on updated radius
        const alpha = Math.min(1, 0.3 + dot.r / 3);
        ctx.fillStyle = `rgba(0, 255, 255, ${alpha})`;

        // Draw the dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        ctx.fill();
    });

    // Lines and optional bursts
    for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
            const dx = dots[i].x - dots[j].x;
            const dy = dots[i].y - dots[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                ctx.strokeStyle = "rgba(0,255,255,0.1)";
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(dots[i].x, dots[i].y);
                ctx.lineTo(dots[j].x, dots[j].y);
                ctx.stroke();

                // Trigger "burst" occasionally
                if (dist < 50 && Math.random() < 0.003) {
                    for (let b = 0; b < 4; b++) {
                        childDots.push({
                            x: dots[i].x,
                            y: dots[i].y,
                            vx: (Math.random() - 0.5) * 1.5,
                            vy: (Math.random() - 0.5) * 1.5,
                            r: 0.5,
                            life: 50
                        });
                    }
                }
            }
        }
    }

    // Animate & fade burst dots
    childDots = childDots.filter(cd => cd.life > 0);
    childDots.forEach(cd => {
        cd.x += cd.vx;
        cd.y += cd.vy;
        cd.life -= 1;

        const fade = cd.life / 50;
        ctx.fillStyle = `rgba(0, 255, 255, ${fade})`;

        ctx.beginPath();
        ctx.arc(cd.x, cd.y, cd.r, 0, Math.PI * 2);
        ctx.fill();
    });


    // Occasionally generate a new spark
    if (Math.random() < 0.02) {
        const d1 = dots[Math.floor(Math.random() * dots.length)];
        const d2 = dots[Math.floor(Math.random() * dots.length)];
        const dist = Math.hypot(d1.x - d2.x, d1.y - d2.y);

        if (dist < 100 && dist > 20) {
            sparks.push({
                x1: d1.x,
                y1: d1.y,
                x2: d2.x,
                y2: d2.y,
                alpha: 1.0,
                life: 5
            });
        }
    }
  

    requestAnimationFrame(draw);

}
  
// Load all embeds on the page
//Tally.loadEmbeds();

draw();
drawDots();
