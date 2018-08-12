
connectsnake = require('./connect-snake');
var csg = new connectsnake.ConnectSnakeGame('snake');
document.getElementById('start').onclick = () => { csg.gameStart() };
