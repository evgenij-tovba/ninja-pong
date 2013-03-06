//(function($) {
	
	var cfg = {
		winScore:		5,
		loginAddress:	'http://localhost:12345',
		fieldWidth:		800,
		fieldHeight:	400,
		padHeightRel:	.2,
		ballRadius:		7
	};
	
	var dom = {};
	var playerCnt = 0;
	var scores = {one: 0, two: 0};
	
	var conn = new WebSocket('ws://192.168.64.174:8005');
	
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
		
		initStartScreen();
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
		dom.body.appendChild(dom.startScreen);
		
		dom.qr_one = document.createElement('div');
		dom.qr_one.className = 'qr one';
		dom.startScreen.appendChild(dom.qr_one);
		$(dom.qr_one).qrcode(cfg.loginAddress);
		
		dom.qr_two = document.createElement('div');
		dom.qr_two.className = 'qr two';
		dom.startScreen.appendChild(dom.qr_two);
		$(dom.qr_two).qrcode(cfg.loginAddress);
	}
	
	function initGame() {
		dom.field = document.createElement('div');
		dom.field.id = 'field';
		dom.field.style.width = cfg.fieldWidth + 'px';
		dom.field.style.height = cfg.fieldHeight + 'px';
		
		dom.body.appendChild(dom.field);
		
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
	
	var dat, ctrl;
	function onCoreMessage(evt) {
		
		console.log(evt);
		
		onPadUpdate(true, evt.data);
		return;

		dat = evt.data;
		if(dat.length != 16) { // TODO replace with the real required length
			return;
		}
		
		ctrl = parseInt(dat.substr(0, 2), 16);
		console.log(ctrl);
		
		// TODO impl controller logic
	}
	
	function onPlayerLogin(isLeft) {
		
		if(isLeft) {
			dom.startScreen.removeChild(dom.qr_one);
		}else {
			dom.startScreen.removeChild(dom.qr_two);
		}
		
		playerCnt++;
		
		if(playerCnt === 2) {
			var msg = document.createElement('div');
			msg.className = 'message';
			msg.innerHTML = 'Ready... be prepared!';
			dom.startScreen.appendChild(msg);
		}
	}
	
	function onPlayerLogout(isLeft) {
		players--;
	}
	
	function onGameStart() {
		initGame();
	}
	
	function onGameFinished(isLeftWinner) {
		
		dom.field.style.display = 'none';
		dom.startScreen.style.display = 'none';
		
		var winnerTxt = isLeftWinner ? 'LINKS' : 'RECHTS';
		
		dom.finishScreen = document.createElement('div');
		dom.finishScreen.id = 'finishscreen';
		dom.body.appendChild(dom.finishScreen);
		
		var msg = document.createElement('div');
		msg.className = 'message';
		msg.innerHTML = 'And ze winner is: ' + winnerTxt;
		dom.finishScreen.appendChild(msg);
	}
	
	function onGameAborted(hasLeftLeft) {
		initStartScreen();
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
	

	
	/** to test stuff */
	setTimeout(function() {
		onCoreMessage({data: '01020304AABBCCDD'});
		onPlayerLogin(false);
	}, 300);

	setTimeout(function() {
		onPlayerLogin(true);
	}, 700);
	
	setTimeout(function() {
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
	
	
//})(jQuery);
