const cnv = document.getElementById("canvas")
const ctx = cnv.getContext("2d")

var earth = {
    size: {x:960,y:960},
    pos: {x:0,y:300},
    vel: {x:0,y:0},
    gravity: 0.0989,
    color: "green",
    restituition: 100
}

var rocket = {
    size: {x:25,y:50},
    pos: {x:cnv.width/2 - 25/2,y:cnv.height/2 - 50/2},
    rot: 0,
    vel: {x:0,y:0},
    acel: {x:0,y:0},
    acelMultiplier: {x:0,y:0},
    throttle: 0,
    color: "red"
}
var commonText = {font: "20px Arial"}

var kcode = {up:38, w:87, down:40, s:83, right:39, d:68, left:37, a:65, lShift: 16, lCtrl: 17}
var moveUp, moveRight, moveLeft, pressShift, pressCtrl;
main()
function main(){
    clearCanvas()
    events()
    move(rocket)
    logic()
    drawRocket(rocket)
    drawPlanet(earth)
    drawText("30px", "Arial", rocket.vel.x, 10, 40, "black", "velocity x: ", "m/s")
    drawText("30px", "Arial", rocket.vel.y, 10, 80, "black", "velocity y: ", "m/s")
    drawText("30px", "Arial", rocket.throttle, cnv.width/2 - 55, 500, "black",  "Throttle: ", "%")
    requestAnimationFrame(main, cnv)
}
function clearCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function drawRocket(object){
    ctx.save()
    ctx.translate(cnv.width/2, cnv.height/2);
    ctx.rotate(object.rot * Math.PI / 180);
    ctx.fillStyle = object.color
    ctx.fillRect(object.pos.x - cnv.width/2, object.pos.y - cnv.height/2, object.size.x, object.size.y)
    ctx.restore()
}
function drawPlanet(object){
    ctx.fillStyle = object.color
    ctx.fillRect(object.pos.x, object.pos.y, object.size.x, object.size.y)
}

function drawText(fontSize, fontFamily, data, posX, posY, color, after, before = ""){
    ctx.fillStyle = color
    ctx.font = fontSize + " " + fontFamily 
    ctx.fillText(after + Math.abs(data.toFixed(1)) + before, posX,posY)
}

function logic(){
    calcPos(earth, rocket)
    calcVel(rocket, earth)
    calcColideTerrain(rocket, earth)
    calcTrottle(rocket)
    calcAcelDeg(rocket)
}
function calcPos(object1, object2){
    object1.pos.x += object2.vel.x
    object1.pos.y += object2.vel.y
}
function calcVel(object1, object2){
    object1.vel.y -= object2.gravity
    object1.vel.x += object1.acel.x * object1.acelMultiplier.x
    object1.vel.y += object1.acel.y * object1.acelMultiplier.y
    
}
function calcColideTerrain(object1, object2){
    var catX = (object1.pos.x + object1.size.x/2) - (object2.pos.x + object2.size.x/2)
    var catY = (object1.pos.y + object1.size.y/2) - (object2.pos.y + object2.size.y/2)

    var halfWidth = object1.size.x/2 + object2.size.x/2
    var halfHeight = object1.size.y/2 + object2.size.y/2
    console.log(halfWidth + " " + catX)
    if(Math.abs(catX) < halfWidth && Math.abs(catY) < halfHeight){

        var overlapX = halfWidth - Math.abs(catX);
		var overlapY = halfHeight - Math.abs(catY);

		if(overlapX >= overlapY){
			if(catY > 0){
				if (object1.vel.y > 0){
                    object1.vel.y = 0
                }
			} else {
				if (object1.vel.y < 0){
                    object1.vel.y = 0
                }
			}
		} else {
			if(catX > 0){
				if (object1.vel.x > 0){
                    object1.vel.x = 0
                }
			} else {
				if (object1.vel.x < 0){
                    object1.vel.x = 0
                }
			}
		}
    }
}

function calcTrottle(object){
    object.acel.x = object.throttle/500
    object.acel.y = object.throttle/500
}
function calcAcelDeg(object){
    if(object.rot < 180 && object.rot >= 0){
        object.acelMultiplier.y = 1 - object.rot / 90
    }
    if(object.rot >= -180 && object.rot < 0){
        object.acelMultiplier.y = 1 +object.rot / 90
    }

    if(object.rot < 90 && object.rot >= -90){
        object.acelMultiplier.x = 0 - object.rot / 90
    }
    else{
        //console.log(object.acelMultiplier.x = 1 - (object.rot - 90) / 90)
        object.acelMultiplier.x = (1 - (object.rot - 90) / 90)*-1
        if(object.rot < -90 && object.rot >= -180){
            object.acelMultiplier.x = 1 - (object.rot - 90) / 90
        }
    }


    if (object.rot > 180){object.rot = -180}
    if (object.rot < -180){object.rot = 180}
    //console.log(object.acelMultiplier.x + " " + object.acelMultiplier.y + " " + object.rot)
}

function events(){
	addEventListener("keydown", keyDownPress)
	addEventListener("keyup", keyUpPress)
}

function keyDownPress(e){
	switch(e.keyCode){
		case kcode.up: 
		case kcode.w:
			moveUp = true
			break
		case kcode.down: 
		case kcode.s:
			moveDown = true
			break
		case kcode.left: 
		case kcode.a:
			moveLeft = true
			break
		case kcode.right: 
		case kcode.d:
			moveRight = true
			break
        case kcode.lShift:
	        pressShift = true
	        break
        case kcode.lCtrl:
	        pressCtrl = true
	        break
		}
}
function keyUpPress(e){
	switch(e.keyCode){
		case kcode.up: 
		case kcode.w:
			moveUp = false
			break
		case kcode.down: 
		case kcode.s:
			moveDown = false
			break
		case kcode.left: 
		case kcode.a:
			moveLeft = false
			break
		case kcode.right: 
		case kcode.d:
			moveRight = false
			break
        case kcode.lShift:
            pressShift = false
            break
        case kcode.lCtrl:
            pressCtrl = false
            break
		}
}
function move(object){
	/*if(moveDown){
		player.posY += speedMoviment/divSpeed
	}*/
	if(moveRight){
		object.rot ++
	}
	if(moveLeft){
		object.rot --
	}
    if(pressShift){
        if (object.throttle < 100) {
            object.throttle += 1
        }
    }
    if(pressCtrl){
        if (object.throttle > 0) {
            object.throttle -= 1
        }
	}
}