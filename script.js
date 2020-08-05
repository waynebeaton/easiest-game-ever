var game = document.getElementById("game");
var character = document.getElementById("character");
var block = document.getElementById("block");
var counter=0;
function jump(){
    if(character.classList == "animate"){return}
    character.classList.add("animate");
    setTimeout(function(){
        character.classList.remove("animate");
    },300);
}

var walk1 = {
	frames: ["walkright1", "walkright2", "walkright3", "walkright4", "walkright5"]
}
var walk2 = {
	frames: ["walkleft1", "walkleft2", "walkleft3", "walkleft4", "walkleft5"]
}
var kick1 = {
	frames: ["kick1", "kick2"]
}
var kick2 = {
	frames: ["kick3", "kick4", "kick4", "kick4"]
}
var kick3 = {
	frames: ["kick5", "kick6"]
}

var roundhouse1 = {
	frames: ["roundhouse1", "roundhouse2"]
}
var roundhouse2 = {
	frames: ["roundhouse3", "roundhouse4"]
}
var roundhouse3 = {
	frames: ["roundhouse5", "roundhouse6", "roundhouse7"]
}

var hit1 = {
	images: ["url('hit1.jpg')"]
}
walk1.next = walk2;
walk1.kick = roundhouse1;
walk1.hit = hit1;

walk2.next = walk1;
walk2.kick = kick1;
walk2.hit = hit1;

kick1.next = kick2;
kick2.next = kick3;
kick3.next = walk1;

roundhouse1.next = roundhouse2;
roundhouse2.next = roundhouse3;
roundhouse3.next = walk2;

var hero = {
	move: walk1,
	kickNext: false,
	frame: 0,
	step: function() {
		if (++this.frame >= this.move.frames.length) {
			this.frame = 0;
			if (this.kickNext && this.move.kick != null) {
				this.kickNext = false;
				this.move = this.move.kick;
			} else {
				this.move = this.move.next;
			}
		}			
	},
	getFrame: function() {
		return this.move.frames[this.frame];
	},
	kick: function() {
		this.kickNext = true;
	}
};

var enemy = {
	x: 500,
	speed: 5,
	step: function() {
		this.x -= this.speed;
		if (this.x < 0) {
			this.x = 500;
		}
		block.style.left = this.x.toString() + "px";
	},
	reset: function() {
		this.x = 500;
		this.speed = 3 + Math.floor(Math.random() * 5); 
	}
}

function playGame() {
	//game.style.backgroundImage = "url('trees.jpg')";
	game.onclick = function() {
		hero.kick();
	};
	
	var x = 0;

	var play = setInterval(function() {
		hero.step();
		enemy.step();

		character.classList = [hero.getFrame()];
		x -= 1;
		position = x.toString() +"px 0px";
		game.style.backgroundPosition = position;
	   
		if (character.offsetLeft + character.offsetWidth > block.offsetLeft) {
			if (hero.move == kick2 || hero.move == roundhouse2) {
	       		enemy.reset();
			} else {
				clearInterval(play);
			}
		}

	}, 100);
}
