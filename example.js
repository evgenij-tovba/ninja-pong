/*
 * Example on how to use the connection_manager
 */

var connection_manager = require('connection_manager');

var game = new connection_manager({
  listen_addr: 'localhost',
  listen_port: 8001,
  debug: true,
  protocols: connection_manager.PROTOCOLS.UDP,
  client_idle_timeout: 10 // 10s
});

game.on('start', function() {
  console.log('Game started!');
});

game.on('player_joined', function(player_id) {
  console.log('New player: ' + player_id);
})

game.on('player_left', function(player_id) {
  console.log('Player left: ' + player_id);
})

game.on('action', function(player_id, action) {
  console.log('Action from player: '
    + player_id + ': '
    + action.toString().trim()
  );

  // example message handling...
  if (action.toString().trim() === 'kill') {
    console.log('Stopping game...');
    game.stop();
  }
})

game.on('stop', function() {
  console.log('Game end :(');
  process.exit(0);
})

console.log('Starting game...');
game.start();
