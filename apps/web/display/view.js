// TODO add some sort of state pattern for showing and hiding corresponding views (and get rid of resetStartScreen() )

//(function($) {

	var cfg = {
		winScore:		5,
		loginAddress:	'http://localhost:12345',
		fieldWidth:		800,
		fieldHeight:	400,
		padHeightRel:	.2,
		ballRadius:		7,
		netWidth: 		0.008,
	};

	var util = {
		show: function(el) {
			el.style.visibility = 'visible';
		},
		hide: function(el) {
			el.style.visibility = 'hidden';
		},
	};


	
	var dom = {};
	var playerCnt = 0;
	var scores = {one: 0, two: 0};
	
	var conn = new WebSocket('ws://192.168.64.174:8005');
	conn.binaryType = 'arraybuffer';
	
	conn.onopen = function() {
		console.log('connection opened!');
	};

	conn.onclose = function() {
		console.log('connection closed!');
	};
	
	conn.onerror = function(error) {
		alert('WebSocket error occurred: ' + error);
	};
	
	conn.onmessage = onCoreMessage;
	
	
	$(function() {
		
		dom.body = document.querySelector('body');
		
		// create views
		initStartScreen();
		initReadyScreen();
		initGame();
		initFinishScreen();

		util.show(dom.startScreen);
	});
	
	function initStartScreen() {
		
		scores.one = 0; scores.two = 0;
	//	dom = {};
		//dom.body = document.querySelector('body');
		var domElements = document.querySelectorAll('body > *'), bodyEl = document.querySelector('body');

		for(var i=0; i<domElements.length; i++) {
			//bodyEl.removeChild(domElements[i]);
		}
		
		dom.startScreen = document.createElement('div');
		dom.startScreen.id = 'startscreen';
		dom.startScreen.className = 'view';
		dom.body.appendChild(dom.startScreen);
		
		dom.qr_one = document.createElement('div');
		dom.qr_one.className = 'qr one';

		var half = document.createElement('div');
		half.className = 'half_width qr_wrap';

		dom.startScreen.appendChild(half).appendChild(dom.qr_one);
		
		
		dom.qr_two = document.createElement('div');
		dom.qr_two.className = 'qr two';

		half = document.createElement('div');
		half.className = 'half_width qr_wrap';

		dom.startScreen.appendChild(half).appendChild(dom.qr_two);

		// generate QR codes
		$(dom.qr_one).qrcode(cfg.loginAddress);
		$(dom.qr_two).qrcode(cfg.loginAddress);

		var msg = document.createElement('div');
		msg.className = 'message full_width';
		msg.innerHTML = 'Scan one of the codes to join the game!';
		dom.startScreen.appendChild(msg);

		util.hide(dom.startScreen);
	}

	function initReadyScreen() {

		dom.readyScreen = document.createElement('div');
		dom.readyScreen.id = 'readyscreen';
		dom.readyScreen.className = 'view';
		dom.body.appendChild(dom.readyScreen);

		var msg = document.createElement('div');
		msg.className = 'message';
		msg.innerHTML = 'Get ready!';

		dom.readyScreen.appendChild(msg);

		util.hide(dom.readyScreen);
	}

	function resetStartScreen() {

		util.hide(dom.field);
		util.hide(dom.finishScreen);
		util.hide(dom.readyScreen);

		util.show(dom.qr_one);
		util.show(dom.qr_two);
		util.show(dom.startScreen);
	}
	
	function initGame() {
		dom.field = document.createElement('div');
		dom.field.id = 'field';
		dom.field.style.width = cfg.fieldWidth + 'px';
		dom.field.style.height = cfg.fieldHeight + 'px';

		var net = document.createElement('div'),
			w_net = cfg.netWidth * cfg.fieldWidth;
		net.id = 'net';
		net.style.borderWidth = w_net + 'px';
		net.style.left = (cfg.fieldWidth - w_net) / 2 + 'px';

		dom.field.appendChild(net);
		
		dom.body.appendChild(dom.field);

		util.hide(dom.field);
		
		var padHeightAbs = cfg.fieldHeight * cfg.padHeightRel;
		
		dom.pad_one = document.createElement('div');
		dom.pad_one.className = 'pad one';
		dom.pad_one.style.height = padHeightAbs + 'px';
		dom.field.appendChild(dom.pad_one);
		
		dom.pad_two = document.createElement('div');
		dom.pad_two.className = 'pad two';
		dom.pad_two.style.height = padHeightAbs + 'px';
		dom.field.appendChild(dom.pad_two);
		
		dom.ball = document.createElement('div');
		dom.ball.id = 'ball';
		dom.ball.style.left = cfg.fieldWidth / 2 + 'px';
		dom.ball.style.top = cfg.fieldHeight / 2 + 'px';
		dom.ball.style.width = 2 * cfg.ballRadius + 'px';
		dom.ball.style.height = 2 * cfg.ballRadius + 'px';
		dom.field.appendChild(dom.ball);
		
		dom.score = document.createElement('div');
		dom.score.id = 'score';
		dom.field.appendChild(dom.score);
		
		dom.score_one = document.createElement('div');
		dom.score_one.className = 'one';
		dom.score_one.innerHTML = scores.one;
		dom.score.appendChild(dom.score_one);
		
		dom.score_two = document.createElement('div');
		dom.score_two.className = 'two';
		dom.score_two.innerHTML = scores.two;
		dom.score.appendChild(dom.score_two);		
	}

	function initFinishScreen() {

		dom.finishScreen = document.createElement('div');
		dom.finishScreen.id = 'finishscreen';
		dom.finishScreen.className = 'view';
		dom.body.appendChild(dom.finishScreen);
		
		var msg = document.createElement('div');
		msg.className = 'message';
		msg.innerHTML = 'And ze winner is...';
		dom.finishScreen.appendChild(msg);

		var msgWinner = document.createElement('div');
		msgWinner.className = 'message winner';
		dom.winner = msgWinner;
		dom.finishScreen.appendChild(msgWinner);

		util.hide(dom.finishScreen);
	}
	
	var dat, ctrl;
	function onCoreMessage(evt) {
		
		var dat = new Uint32Array(evt.data);

		console.log(dat);


		switch(dat[0]) {

case 8: // pad position change

onPadUpdate(dat[1] === 1, dat[2] / Math.pow(2, 32));


		}
		
		// onPadUpdate(true, evt.data);
		return;


		if(dat.length != 16) { // TODO replace with the real required length
			return;
		}
		
		ctrl = parseInt(dat.substr(0, 2), 16);
		console.log(ctrl);
		
		// TODO impl controller logic
	}
	
	function onPlayerLogin(isLeft) {
		
		if(isLeft) {
			util.hide(dom.qr_one);
		}else {
			util.hide(dom.qr_two);
		}
		
		playerCnt++;
		
		if(playerCnt === 2) {
			util.show(dom.readyScreen);
		}
	}
	
	function onPlayerLogout(isLeft) {
		players--;
	}
	
	function onGameStart() {
		util.hide(dom.startScreen);
		util.hide(dom.readyScreen);
		util.hide(dom.finishScreen);

		util.show(dom.field);
	}
	
	function onGameFinished(isLeftWinner) {
		
		util.hide(dom.field);
		util.hide(dom.startScreen);
		util.hide(dom.readyScreen);

		var winnerTxt = 'Player ' + (isLeftWinner ? 1 : 2) + '!';
		dom.winner.innerHTML = winnerTxt;

		util.show(dom.finishScreen);
	}
	
	function onGameAborted(hasLeftLeft) {
		
		resetStartScreen();
	}
	
	function onPadUpdate(isLeft, pos) {
		var pad = isLeft ? dom.pad_one : dom.pad_two;
		
		var padHeightAbs = cfg.fieldHeight * cfg.padHeightRel;
		var posAbs = (cfg.fieldHeight - padHeightAbs) * pos;
		
		pad.style.top = posAbs + 'px';
	}
	
	function onBallUpdate(pos) {

		var posAbs = {
			x: pos.x * (cfg.fieldWidth - cfg.ballRadius  * 2),
			y: pos.y * (cfg.fieldHeight - cfg.ballRadius * 2)
		};
		
		dom.ball.style.left = posAbs.x + 'px';
		dom.ball.style.top = posAbs.y + 'px';
	}
	
	function onPointScored(isLeft) {
		scores[isLeft ? 'one' : 'two']++;
		dom.score_one.innerHTML = scores.one;
		dom.score_two.innerHTML = scores.two;
	}
	

	
	/** to test stuff
	setTimeout(function() {
		onPlayerLogin(false);
	}, 300);

	setTimeout(function() {
		onPlayerLogin(true);
	}, 700);
	
	setTimeout(function() {
		return;
		onGameStart();

		var i=0;
		var iv = setInterval(function() {
			onBallUpdate({x: ((Math.cos(i/10) + 1) / 2), y: ((Math.sin(i/10) + 1) / 2)});
			//onPadUpdate(true, (Math.sin(i/15) + 1) / 2);
			//onPadUpdate(false, (Math.cos(i/15) + 1) / 2);
			
			if(i > 200) {
				clearInterval(iv);
				//onGameFinished(true);
			}
			i+=1;
		}, 20);
	}, 1000);
	
	setInterval(function() {
		onPointScored(Math.random() > 0.5);
	}, 1500);
	 */
	
//})(jQuery);
