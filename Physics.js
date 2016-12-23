'use strict';
var planet = [];
var entity = [];
var projectile = [];
var c;
var ctx;
var bcolor = "DDEEFF";
var id = 1;


window.onload = function(){
  c = document.getElementById('canvas');
  ctx = c.getContext('2d');
  c.width = window.innerWidth - 25;
  c.height = window.innerHeight - 65;
  document.addEventListener('keydown', (event) => {
    let key = event.key;
    for (let i in entity){
      if (key == 'd' && entity[i].press == false){
        if (entity[i].on != '0') {
          entity[i].jump = true;
          entity[i].press = true;
          entity[i].xV += -1 * Math.cos(Math.PI/2 - entity[i].orientation + .05)*.55;
          entity[i].yV += Math.sin(Math.PI/2 - entity[i].orientation + .05)*.55;
          entity[i].facing = true;
        }
        else{
          entity[i].orientation += Math.PI/8;
          entity[i].press = true;
        }
      }
      else if (key == 'a' && entity[i].press == false){
        if (entity[i].on != '0') {
          entity[i].jump = true;
          entity[i].press = true;
          entity[i].xV += Math.cos(Math.PI/2 - entity[i].orientation - .05)*.55;
          entity[i].yV += -1 * Math.sin(Math.PI/2 - entity[i].orientation - .05)*.55;
          entity[i].facing = false;
        }
        else{
          entity[i].orientation -= Math.PI/8;
          entity[i].press = true;
        }
      }
      else if (key == "w" && entity[i].on != '0' && entity[i].press == false){
        entity[i].jump = true;
        entity[i].press = true;
        entity[i].xV += Math.cos(entity[i].orientation)*.6;
        entity[i].yV += Math.sin(entity[i].orientation)*.6;
      }
      else if (key == " " && entity[i].shoot == 0){
        entity[i].shoot = 50; //shoot delay
        let p = {}
        p.x = entity[i].x;
        p.y = entity[i].y;
        let dir = entity[i].facing?entity[i].orientation+Math.PI/2:entity[i].orientation-Math.PI/2;
        p.xV = entity[i].xV + Math.cos(dir) * 1; //power of gun
        p.yV = entity[i].yV + Math.sin(dir) * 1;
        p.xA = 0;
        p.yA = 0;
        p.radius = 1;
        p.mass = .0001;
        p.life = 10000;
        p.damage = 25;
        p.id = entity[i].id;
        projectile.push(p);

      }
      else {
      }
      if(document.getElementById('combat').checked){
        break;
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
  document.getElementById('open').addEventListener('click', function(){load(document.getElementById('file').files)});
  document.getElementById('load').addEventListener('click', function(){request(document.getElementById('world').value)});

  request(1);
}

function request(num){
  $.get("world"+num, function(data, status){
    build(data);
  });
}

function load(file){
  let r = new FileReader();
  r.readAsText(file[0]);
  r.onload = function(e){build(JSON.parse(e.target.result))}
}

function build(world){
  clear();
  for (let i in world.planet){
    (function(j){
      setTimeout(function(){create(world.planet[j])}, world.planet[j].time);
    })(i)
  }
  for (let i in world.spawn){
    spawn(world.spawn[i])
  }
}

function spawn(loc){
  let e = {};
  e.id = id;
  id+=1;
  e.x = loc.x;
  e.y = loc.y;
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
  e.shoot = 0;
  e.hp = 100;
  e.flag = false;
  e.facing = true; //right = true; left = false;

  entity.push(e);
}

function create(pnet){
  let p = {};
  p.mass = pnet.mass;
  p.radius = pnet.radius;
  p.x = pnet.x;
  p.y = pnet.y;
  p.fixed = pnet.fixed;
  p.xV = pnet.xV;
  p.yV = pnet.yV;
  p.xA = 0;
  p.yA = 0;
  p.id = id;
  id+=1;
  planet.push(p);
}

function clear(){
  entity = [];
  planet = [];
  projectile = [];
  id = 1;
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

  for (let i = 0; i < entity.length; i+=1){
    if (entity[i].hp<=0){
      entity.splice(i, 1);
      i-=1;
      continue;
    }
    if (entity[i].shoot>0)
      entity[i].shoot -=1;
    else {
      entity[i].shoot = 0;
    }
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

    entity[i].yA = yATemp;
    entity[i].yV += entity[i].yA;
    entity[i].y += entity[i].yV;

  }

  for (let i = 0; i < projectile.length; i+=1){
    let xATemp = 0;
    let yATemp = 0;
    projectile[i].life -= 1;
    for (let j in planet){
      let r = Math.pow(projectile[i].x - planet[j].x,2) + Math.pow(projectile[i].y - planet[j].y, 2);

      //if collision
      if (Math.sqrt(r) <= projectile[i].radius + planet[j].radius){
        projectile[i].flag = true;
        break;
      }
      let force = -1 * (projectile[i].mass * planet[j].mass) / r;
      let forceX = force * (projectile[i].x - planet[j].x) / Math.sqrt(r);
      let forceY = force * (projectile[i].y - planet[j].y) / Math.sqrt(r);

      xATemp += forceX/projectile[i].mass;
      yATemp += forceY/projectile[i].mass;
    }
    for (let j in entity){
      if (projectile[i].id == entity[j].id) continue;
      let r = Math.pow(projectile[i].x - entity[j].x,2) + Math.pow(projectile[i].y - entity[j].y, 2);

      //if collision
      if (Math.sqrt(r) <= projectile[i].radius + entity[j].radius){
        projectile[i].flag = true;
        entity[j].hp -= projectile[i].damage;
        break;
      }
    }
    if (projectile[i].flag == true || projectile[i].life <=0){
      projectile.splice(i,1);
      i-=1;
      continue;
    }
    projectile[i].xA = xATemp;
    projectile[i].xV += projectile[i].xA;
    projectile[i].x += projectile[i].xV;


    projectile[i].yA = yATemp;
    projectile[i].yV += projectile[i].yA;
    projectile[i].y += projectile[i].yV;

    if (projectile[i].y + projectile[i].radius < 0 || projectile[i].y - projectile[i].radius > c.height || projectile[i].x + projectile[i].radius < 0 || projectile[i].x - projectile[i].radius > c.width){
      projectile.splice(i,1);
      i-=1;
      continue;
    }

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
    ctx.moveTo(entity[i].x, entity[i].y);
    let dir = entity[i].facing?entity[i].orientation+Math.PI/2:entity[i].orientation-Math.PI/2;
    ctx.lineTo(entity[i].x+entity[i].radius*2*Math.cos(dir),entity[i].y+entity[i].radius*2*Math.sin(dir));
    ctx.stroke();
  }
  for (let i in projectile){
    ctx.beginPath();
    ctx.arc(projectile[i].x, projectile[i].y, projectile[i].radius, 2*Math.PI, 0);
    ctx.stroke();
  }
}

var loop = setInterval(update, 3);
