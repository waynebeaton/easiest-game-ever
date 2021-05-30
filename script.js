var game = document.getElementById("game");
var character = document.getElementById("character");
var block = document.getElementById("block");
var score = 0;

var hero = {
	reset: function() {
		this.move = this.segments["walk1"];
		this.kickNext = false;
		this.frame = 0;
	},
	step: function() {
		if (++this.frame >= this.move.frames.length) {
			if (this.move.next == null) {
				this.frame--;
				reset();
			} else {
				this.frame = 0;
				if (this.kickNext && this.move.kick != null) {
					this.kickNext = false;
					this.move = this.segments[this.move.kick];
				} else {
					this.move = this.segments[this.move.next];
				}
			}
		}
	},
	getFrame: function() {
		return this.move.frames[this.frame];
	},
	kick: function() {
		this.kickNext = true;
	},
	hit: function(enemy) {
		this.move.hit(this, enemy);
	},
	fall: function() {
		this.move = hero.segments.hit1;
		this.frame = 0;
	},
	segments: {
		"walk1" : {
			frames: ["walkright1", "walkright2", "walkright3", "walkright4", "walkright5"],
			next: "walk2",
			kick: "roundhouse1",
			hit: function(me, enemy) {
				me.fall();
				enemy.reset();
			}
		},
		"walk2" : {
			frames: ["walkleft1", "walkleft2", "walkleft3", "walkleft4", "walkleft5"],
			next: "walk1",
			kick: "kick1",
			hit: function(me, enemy) {
				me.fall();
				enemy.reset();
			}
		},
		"kick1": {
			frames: ["kick1", "kick2"],
			next: "kick2",
			hit: function(me, enemy) {
				me.fall();
				enemy.reset();
			}
		},
		"kick2": {
			frames: ["kick3", "kick4", "kick4", "kick4"],
			next: "kick3",
			hit: function(me, enemy) {
				enemy.destroy();
			}
		},
		"kick3": {
			frames: ["kick5", "kick6"],
			next: "walk1",
			hit: function(me, enemy) {
				me.fall();
				enemy.reset();
			}
		},
		"roundhouse1": {
			frames: ["roundhouse1", "roundhouse2"],
			next: "roundhouse2",
			hit: function(me, enemy) {
				me.fall();
				enemy.reset();
			}
		},
		"roundhouse2": {
			frames: ["roundhouse3", "roundhouse4"],
			next: "roundhouse3",
			hit: function(me, enemy) {
				enemy.destroy();
			}
		},
		"roundhouse3": {
			frames: ["roundhouse5", "roundhouse6", "roundhouse7"],
			next: "walk2",
			hit: function(me, enemy) {
				me.fall();
				enemy.reset();
			}
		},
		"hit1": {
			frames: ["hit1", "hit2", "hit3", "hit4"],
			next: null,
			hit: function(me, enemy) {
			}
		}
	}
};

var enemy = {
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
	},
	destroy: function() {
		score += this.speed;
		document.getElementById("score").textContent=score;
		this.reset();
	}
}

var play;
function playGame() {
	hero.reset();
	enemy.reset();
	game.onclick = function() {
		hero.kick();
	};
	
	var x = 0;

	play = setInterval(function() {
		hero.step();
		enemy.step();

		character.classList = [hero.getFrame()];
		x -= 3;
		position = x.toString() +"px 0px";
		game.style.backgroundPosition = position;
	   
		if (character.offsetLeft + character.offsetWidth > block.offsetLeft) {
			hero.hit(enemy);
		}

	}, 100);
}

function reset() {
	clearInterval(play);
	game.onclick = playGame;
}
