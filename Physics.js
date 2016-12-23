'use strict';
var planet = [];
var entity = [];
var c;
var ctx;
var bcolor = "DDEEFF";
var id = 4;

{
  let a = {};
  a.fixed = true;
  a.id = '1';
  a.x = 260;
  a.y = 800;
  a.xV = 0;
  a.yV = 0;
  a.xA = 0;
  a.yA = 0;
  a.mass = 25;
  a.radius = 75;

  planet.push(a);

  let b = Object.assign({}, a);
  b.fixed = false;
  b.id = '2';
  b.x = 500;
  b.y = 250;
  b.xV = .12;
  b.yV = .2;

  planet.push(b);

  let c = Object.assign({}, a);
  c.id = '3';
  c.fixed = false;
  c.y = 100;
  c.mass = 60;
  c.radius = 75;

  planet.push(c);

  let d = Object.assign({}, a);
  d.id = '4';
  d.x = 1200;
  d.y = 450;
  d.mass = 60;
  d.radius = 75;

  planet.push(d);

  let e = {};
  e.x = 400;
  e.y = 600;
  e.xV = 0;
  e.yV = 0;
  e.xV2 = 0;
  e.yV2 = 0;
  e.xA = 0;
  e.yA = 0;
  e.mass = 0.5;
  e.radius = 3;
  e.orientation = Math.PI / 2;
  e.on = '0';
  e.press = false;
  e.jump = false;

  entity.push(e);
}

window.onload = function(){
  c = document.getElementById('canvas');
  ctx = c.getContext('2d');
  c.width = window.innerWidth - 25;
  c.height = window.innerHeight - 65;
  document.addEventListener('keydown', (event) => {
    let key = event.key;
    for (let i in entity){
      if (key == 'd' && entity[i].on != '0' && entity[i].press == false){
        entity[i].jump = true;
        entity[i].press = true;
        entity[i].xV += -1 * Math.cos(Math.PI/2 - entity[i].orientation + .05)*.55;
        entity[i].yV += Math.sin(Math.PI/2 - entity[i].orientation + .05)*.55;
      }
      else if (key == 'a' && entity[i].on != '0' && entity[i].press == false){
        entity[i].jump = true;
        entity[i].press = true;
        entity[i].xV += Math.cos(Math.PI/2 - entity[i].orientation - .05)*.55;
        entity[i].yV += -1 * Math.sin(Math.PI/2 - entity[i].orientation - .05)*.55;
      }
      else if (key == "w" && entity[i].on != '0' && entity[i].press == false){
        entity[i].jump = true;
        entity[i].press = true;
        entity[i].xV += Math.cos(entity[i].orientation)*.6;
        entity[i].yV += Math.sin(entity[i].orientation)*.6;
      }
    }
  }, false);
  document.addEventListener('keyup', (event) => {
    let key = event.key;
    for (let i in entity){
      if (key == 'd'){
        entity[i].press = false;
      }
      else if (key == 'a'){
        entity[i].press = false;
      }
      else if (key == "w"){
        entity[i].press = false;
      }
    }
  }, false);


  document.addEventListener('mousedown', (event) => {
    let x = event.pageX - c.offsetLeft;
    let y = event.pageY - c.offsetTop;
    if (document.getElementById('mass').value != "" && document.getElementById('radius').value != "" && document.getElementById('pc').checked && x>=0 && x<c.width && y>=0 && y<c.height){
      console.log("creating player")
      let p = {};
      id+=1;
      p.id = id.toString();
      p.x = Number(x);
      p.y = Number(y);
      p.xV = 0;
      p.yV = 0;
      p.xA = 0;
      p.yA = 0;
      p.xV2 = 0;
      p.yV2 = 0;
      p.mass = Number(document.getElementById('mass').value);
      p.radius = Number(document.getElementById('radius').value);
      p.orientation = Math.PI / 2;
      p.on = '0';
      p.press = false;
      p.jump = false;
      console.log(p)
      entity.push(p);
    }
    else if (document.getElementById('mass').value != "" && document.getElementById('radius').value != "" && x>=0 && x<c.width && y>=0 && y<c.height){
      let p = {};
      p.fixed = document.getElementById('static').checked;
      id+=1;
      p.id = id.toString();
      p.x = x;
      p.y = y;
      p.xV = 0;
      p.yV = 0;
      p.xA = 0;
      p.yA = 0;
      p.mass = Number(document.getElementById('mass').value);
      p.radius = Number(document.getElementById('radius').value);

      planet.push(p);
    }
  }, false);
  document.getElementById('clear').addEventListener('click', clear);
}

function clear(){
  entity = [];
  planet = [];
}

function update(){
  for (let i = 0; i < planet.length; i+=1){
    if (!planet[i].fixed){
      let xATemp = 0;
      let yATemp = 0;
      for (let j in planet){
        if (i == j) continue;
        let r = Math.pow(planet[i].x - planet[j].x,2) + Math.pow(planet[i].y - planet[j].y, 2);

        //if collision
        if (Math.sqrt(r) <= planet[i].radius + planet[j].radius){
          //eventually put code for rebound here
          r = Math.pow(planet[i].radius + planet[j].radius,2);
        }
        let force = -1 * (planet[i].mass * planet[j].mass) / r;
        let forceX = force * (planet[i].x - planet[j].x) / Math.sqrt(r);
        let forceY = force * (planet[i].y - planet[j].y) / Math.sqrt(r);

        xATemp += forceX/planet[i].mass;
        yATemp += forceY/planet[i].mass;
      }
      planet[i].xA = xATemp;
      planet[i].xV += planet[i].xA;
      planet[i].x += planet[i].xV;


      planet[i].yA = yATemp;
      planet[i].yV += planet[i].yA;
      planet[i].y += planet[i].yV;

      if (document.getElementById('bound').checked){
        if (planet[i].y + planet[i].radius < 0 || planet[i].y - planet[i].radius > c.height || planet[i].x + planet[i].radius < 0 || planet[i].x - planet[i].radius > c.width){
          planet.splice(i,1);
          i-=1;
          continue;
        }
        //y collision detection
        if (planet[i].y - planet[i].radius < 0){
          planet[i].y = (planet[i].y - planet[i].radius) * -1 + planet[i].radius;
          planet[i].yV = planet[i].yV * -1;
        }
        if (planet[i].y + planet[i].radius > c.height){
          planet[i].y = (c.height - planet[i].y - planet[i].radius) + c.height - planet[i].radius;
          planet[i].yV = planet[i].yV * -1;
        }

        //x collision detection
        if (planet[i].x - planet[i].radius < 0){
          planet[i].x = (planet[i].x - planet[i].radius) * -1 + planet[i].radius;
          planet[i].xV = planet[i].xV * -1;
        }
        if (planet[i].x + planet[i].radius > c.width){
          planet[i].x = (c.width - planet[i].x - planet[i].radius) + c.width - planet[i].radius;
          planet[i].xV = planet[i].xV * -1;
        }
      }

    }
  }

  for (let i in entity){
    let xATemp = 0;
    let yATemp = 0;
    if (entity[i].on == '0'){
      for (let j in planet){

        let r = Math.pow(entity[i].x - planet[j].x,2) + Math.pow(entity[i].y - planet[j].y, 2);

        //if collision
        if (0 >= Math.sqrt(r) - entity[i].radius - planet[j].radius){
          let angle = 0;

          if (entity[i].x - planet[j].x >= 0)
            angle = Math.atan((entity[i].y - planet[j].y) / (entity[i].x - planet[j].x));
          else
            angle = Math.PI - Math.atan((entity[i].y - planet[j].y) / (planet[j].x - entity[i].x));

          entity[i].orientation = angle;
          entity[i].x = ((entity[i].radius + planet[j].radius) * Math.cos(angle)) + planet[j].x;
          entity[i].y = ((entity[i].radius + planet[j].radius) * Math.sin(angle)) + planet[j].y;
          entity[i].on = planet[j].id;
          entity[i].xV = planet[j].xV;
          entity[i].yV = planet[j].yV;
          xATemp = 0;
          yATemp = 0;
          break;
        }
        let force = -1 * (entity[i].mass * planet[j].mass) / r;
        let forceX = force * (entity[i].x - planet[j].x) / Math.sqrt(r);
        let forceY = force * (entity[i].y - planet[j].y) / Math.sqrt(r);

        xATemp += forceX/entity[i].mass;
        yATemp += forceY/entity[i].mass;
      }
    }
    else if (entity[i].jump){
      let p = getPlanetById(entity[i].on)
      let r = Math.pow(entity[i].x - p.x,2) + Math.pow(entity[i].y - p.y, 2);
      if (0 < Math.sqrt(r) - entity[i].radius - p.radius){
        entity[i].jump = false;
        entity[i].on = '0';
      }
    }
    else {
      let p = getPlanetById(entity[i].on)
      entity[i].xV = p.xV;
      entity[i].yV = p.yV;
      xATemp = 0;
      yATemp = 0;
    }
    entity[i].xA = xATemp;
    entity[i].xV += entity[i].xA;
    entity[i].x += entity[i].xV;
    entity[i].x += entity[i].xV2;

    entity[i].yA = yATemp;
    entity[i].yV += entity[i].yA;
    entity[i].y += entity[i].yV;
    entity[i].y += entity[i].yV2;

  }
  draw();
}

function getPlanetById(id){
  for (let i in planet){
    if (planet[i].id == id)
      return planet[i];
  }
}

function draw(){
  let newC = document.getElementById('bcolor').value;

  if (newC!="")
    bcolor = newC;
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.fillStyle = "#" + bcolor;
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = "#000000";
  for (let i in planet){
    ctx.beginPath();
    ctx.arc(planet[i].x, planet[i].y, planet[i].radius, 2*Math.PI, 0);
    ctx.stroke();
  }
  for (let i in entity){
    ctx.beginPath();
    ctx.arc(entity[i].x, entity[i].y, entity[i].radius, 2*Math.PI, 0);
    ctx.stroke();
  }
}

var loop = setInterval(update, 1);
