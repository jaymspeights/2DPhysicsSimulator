'use strict';
var planet = [];
var entity = [];
var projectile = [];
var c;
var ctx;
var bcolor = "DDEEFF";
var id = 1;
var scale = 1;
var mouseX;
var mouseY;
var center = {"x":0, "y":0};
var delay;
var loop;

function start(){
  c = document.getElementById('canvas');
  ctx = c.getContext('2d');
  c.width = window.innerWidth - 25;
  c.height = window.innerHeight - 25;
  mouseX = c.width/2;
  mouseY = c.height/2;
  center.x = 0;
  center.y = 0;
  document.addEventListener('keydown', (event) => {
    let key = event.key;
    if (key == 'd'){
      for (let i in entity){
        if (entity[i].on != '0' && entity[i].press == false) {
          entity[i].jump = true;
          entity[i].press = true;
          entity[i].xV += -1 * Math.cos(Math.PI/2 - entity[i].orientation + .05)*.55;
          entity[i].yV += Math.sin(Math.PI/2 - entity[i].orientation + .05)*.55;
          entity[i].facing = true;
        }
        else if(entity[i].press == false){
          entity[i].orientation += Math.PI/6;
          entity[i].press = true;
        }
        if(document.getElementById('combat').checked){
          break;
        }
      }
    }
    else if (key == 'a'){
      for (let i in entity){
        if (entity[i].on != '0' && entity[i].press == false) {
          entity[i].jump = true;
          entity[i].press = true;
          entity[i].xV += Math.cos(Math.PI/2 - entity[i].orientation - .05)*.55;
          entity[i].yV += -1 * Math.sin(Math.PI/2 - entity[i].orientation - .05)*.55;
          entity[i].facing = false;
        }
        else if (entity[i].press == false){
          entity[i].orientation -= Math.PI/6;
          entity[i].press = true;
        }
        if(document.getElementById('combat').checked){
          break;
        }
      }
    }
    else if (key == "w"){
      for (let i in entity){
        if (entity[i].on != '0'){
          entity[i].jump = true;
          entity[i].press = true;
          entity[i].xV += Math.cos(entity[i].orientation)*.6;
          entity[i].yV += Math.sin(entity[i].orientation)*.6;
        }
        if(document.getElementById('combat').checked){
          break;
        }
      }
    }
    else if (key == "s"){
      for (let i in entity){
        if (entity[i].shoot == 0){
          entity[i].shoot = 50; //shoot delay
          let p = {}
          p.x = entity[i].x;
          p.y = entity[i].y;
          let dir = entity[i].facing?entity[i].orientation+Math.PI/2:entity[i].orientation-Math.PI/2;
          p.xV = entity[i].xV + Math.cos(dir) * 2; //power of gun
          p.yV = entity[i].yV + Math.sin(dir) * 2;
          p.xA = 0;
          p.yA = 0;
          p.radius = 2;
          p.mass = .0001;
          p.life = 3000;
          p.damage = 25;
          p.id = entity[i].id;
          projectile.push(p);
        }
        if(document.getElementById('combat').checked){
          break;
        }
      }
    }

    //player two controls
    if (typeof entity[1] != "undefined" && document.getElementById('combat').checked){
      if (key == 'ArrowRight' && entity[1].press == false){
        if (entity[1].on != '0') {
          entity[1].jump = true;
          entity[1].press = true;
          entity[1].xV += -1 * Math.cos(Math.PI/2 - entity[1].orientation + .05)*.55;
          entity[1].yV += Math.sin(Math.PI/2 - entity[1].orientation + .05)*.55;
          entity[1].facing = true;
        }
        else if (entity[1].press == false){
          entity[1].orientation += Math.PI/6;
          entity[1].press = true;
        }
      }
      else if (key == 'ArrowLeft' && entity[1].press == false){
        if (entity[1].on != '0') {
          entity[1].jump = true;
          entity[1].press = true;
          entity[1].xV += Math.cos(Math.PI/2 - entity[1].orientation - .05)*.55;
          entity[1].yV += -1 * Math.sin(Math.PI/2 - entity[1].orientation - .05)*.55;
          entity[1].facing = false;
        }
        else if (entity[1].press == false){
          entity[1].orientation -= Math.PI/6;
          entity[1].press = true;
        }
      }
      else if (key == "ArrowUp" && entity[1].on != '0' && entity[1].press == false){
        entity[1].jump = true;
        entity[1].press = true;
        entity[1].xV += Math.cos(entity[1].orientation)*.6;
        entity[1].yV += Math.sin(entity[1].orientation)*.6;
      }
      else if (key == "ArrowDown" && entity[1].shoot == 0){
        entity[1].shoot = 50; //shoot delay
        let p = {}
        p.x = entity[1].x;
        p.y = entity[1].y;
        let dir = entity[1].facing?entity[1].orientation+Math.PI/2:entity[1].orientation-Math.PI/2;
        p.xV = entity[1].xV + Math.cos(dir) * 2; //power of gun
        p.yV = entity[1].yV + Math.sin(dir) * 2;
        p.xA = 0;
        p.yA = 0;
        p.radius = 2;
        p.mass = .0001;
        p.life = 3000;
        p.damage = 25;
        p.id = entity[1].id;
        projectile.push(p);
      }
    }
  }, false);
  document.addEventListener('keyup', (event) => {
    let key = event.key;
    if (!document.getElementById('combat').checked){
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
    }
    else{
      if (key == 'd'){
        entity[0].press = false;
      }
      else if (key == 'a'){
        entity[0].press = false;
      }
      else if (key == "w"){
        entity[0].press = false;
      }
      else if (key == 'ArrowRight' && typeof entity[1] != "undefined"){
        entity[1].press = false;
      }
      else if (key == 'ArrowLeft' && typeof entity[1] != "undefined"){
        entity[1].press = false;
      }
      else if (key == "ArrowUp" && typeof entity[1] != "undefined"){
        entity[1].press = false;
      }
    }
  }, false);

  document.addEventListener('mousewheel', (event) => {
    scale *= 1 - event.wheelDelta/1200;
  });

  document.addEventListener('mousemove', (event) => {
    mouseX = event.pageX - c.offsetLeft;
    mouseY = event.pageY - c.offsetTop;
  });

  document.addEventListener('mousedown', (event) => {
    let x = event.pageX - c.offsetLeft;
    let y = event.pageY - c.offsetTop;
    if (document.getElementById('mass').value != "" && document.getElementById('radius').value != "" && document.getElementById('pc').checked && x>=0 && x<c.width && y>=0 && y<c.height){
      let p = {};
      id+=1;
      p.id = id.toString();
      p.x = (Number(x)-2*center.x)*scale + center.x;
      p.y = (Number(y)-2*center.y)*scale + center.y;
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
      entity.push(p);
    }
    else if (document.getElementById('mass').value != "" && document.getElementById('radius').value != "" && x>=0 && x<c.width && y>=0 && y<c.height){
      let p = {};
      p.fixed = document.getElementById('static').checked;
      id+=1;
      p.id = id.toString();
      p.x = (Number(x)-2*center.x)*scale + center.x;
      p.y = (Number(y)-2*center.y)*scale + center.y;
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
  document.getElementById('pause').addEventListener('click', pause);
  document.getElementById('open').addEventListener('click', function(){load(document.getElementById('file').files)});
  document.getElementById('load').addEventListener('click', function(){request(document.getElementById('world').value)});

  loop = setInterval(update, 3);

  request(1);
}

function pause(){
  if (document.getElementById('pause').innerHTML == "Pause"){
    clearInterval(loop);
    loop = setInterval(draw, 3);
    document.getElementById('pause').innerHTML = "Play";
  }
  else {
    clearInterval(loop);
    loop = setInterval(update, 3);
    document.getElementById('pause').innerHTML = "Pause";
  }
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
  if (typeof world.scale != "undefined") scale = world.scale;
  for (let i in world.planet){
    (function(j){
      delay=setTimeout(function(){create(world.planet[j])}, world.planet[j].time);
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
  e.radius = 9;
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
  scale = 1;
  center.x = 0;
  center.y = 0;
  clearInterval(delay);
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
        // projectile[i].flag = true;
        // break;
        r = Math.pow(projectile[i].radius + planet[j].radius,2);
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

    if (document.getElementById('bound').checked){
      if (projectile[i].y + projectile[i].radius < 0 || projectile[i].y - projectile[i].radius > c.height || projectile[i].x + projectile[i].radius < 0 || projectile[i].x - projectile[i].radius > c.width){
        projectile.splice(i,1);
        i-=1;
        continue;
      }
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

  if(mouseY < c.height && mouseY > 0){
    let xd = mouseX - c.width/2;
    let yd = mouseY - c.height/2;
    let r = Math.pow(Math.pow(xd,2) + Math.pow(yd,2),.5);
    if (r>c.height/2.5){
      let xMov = Math.pow(Math.pow(r,2)-Math.pow(yd,2),.5);
      let yMov = Math.pow(Math.pow(r,2)-Math.pow(xd,2),.5);
      if (xd<0) xMov = xMov*-1;
      if (yd<0) yMov = yMov*-1;
      center.x -= xMov/750;
      center.y -= yMov/500;
    }
  }

  for (let i in planet){
    let x = (planet[i].x - center.x)/scale + 2*center.x;
    let y = (planet[i].y - center.y)/scale + 2*center.y;
    ctx.beginPath();
    ctx.arc(x, y, planet[i].radius/scale, 2*Math.PI, 0);
    ctx.stroke();
  }
  for (let i in entity){
    let x = (entity[i].x - center.x)/scale + 2*center.x;
    let y = (entity[i].y - center.y)/scale + 2*center.y;
    ctx.beginPath();
    ctx.arc(x, y, entity[i].radius/scale, 2*Math.PI, 0);
    ctx.stroke();
    ctx.moveTo(x, y);
    let dir = entity[i].facing?entity[i].orientation+Math.PI/2:entity[i].orientation-Math.PI/2;
    ctx.lineTo(x+entity[i].radius*2/scale*Math.cos(dir),y+entity[i].radius*2/scale*Math.sin(dir));
    ctx.stroke();
  }
  for (let i in projectile){
    let x = (projectile[i].x - center.x)/scale + 2*center.x;
    let y = (projectile[i].y - center.y)/scale + 2*center.y;
    ctx.beginPath();
    ctx.arc(x, y, projectile[i].radius/scale, 2*Math.PI, 0);
    ctx.stroke();
  }
}
