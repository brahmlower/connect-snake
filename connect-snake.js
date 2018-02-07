
const grid_list = [
  {x:0, y:0, px: 285, py: 333},
  {x:0, y:1, px: 283, py: 377.5},
  {x:0, y:2, px: 284, py: 424},
  {x:0, y:3, px: 282, py: 467.5},
  {x:0, y:4, px: 283, py: 512},
  {x:0, y:5, px: 283, py: 556},
  {x:1, y:0, px: 318, py: 330},
  {x:1, y:1, px: 317, py: 374.5},
  {x:1, y:2, px: 316, py: 419},
  {x:1, y:3, px: 317, py: 463.5},
  {x:1, y:4, px: 317, py: 508},
  {x:1, y:5, px: 318, py: 550},
  {x:2, y:0, px: 351, py: 327},
  {x:2, y:1, px: 350.3, py: 371.5},
  {x:2, y:2, px: 350, py: 416},
  {x:2, y:3, px: 349, py: 460.5},
  {x:2, y:4, px: 349, py: 502},
  {x:2, y:5, px: 349.5, py: 545},
  {x:3, y:0, px: 384, py: 324},
  {x:3, y:1, px: 383.5, py: 368.5},
  {x:3, y:2, px: 383, py: 413},
  {x:3, y:3, px: 383.5, py: 454.5},
  {x:3, y:4, px: 385, py: 498},
  {x:3, y:5, px: 384.8, py: 539},
  {x:4, y:0, px: 417, py: 321},
  {x:4, y:1, px: 416.6, py: 365.},
  {x:4, y:2, px: 416.7, py: 406},
  {x:4, y:3, px: 416.6, py: 451},
  {x:4, y:4, px: 416.9, py: 493},
  {x:4, y:5, px: 417.5, py: 535},
  {x:5, y:0, px: 450, py: 318},
  {x:5, y:1, px: 449.6, py: 362.5},
  {x:5, y:2, px: 449.6, py: 405.5},
  {x:5, y:3, px: 450, py: 447},
  {x:5, y:4, px: 450.5, py: 489},
  {x:5, y:5, px: 451, py: 527},
  {x:6, y:0, px: 483, py: 315},
  {x:6, y:1, px: 482, py: 358},
  {x:6, y:2, px: 482, py: 399},
  {x:6, y:3, px: 480.8, py: 442},
  {x:6, y:4, px: 480.8, py: 484},
  {x:6, y:5, px: 480, py: 523},
];

let game = null;

let game_flash = 0;

let food = null;

let snake = null;

let vel_input = null;

// Creates a default snake
function create_snake() {
  return {
    alive: true,
    vel: {x: 0, y: -1},
    tail: [ {x: 4, y: 0} ]
  };
}

function game_start() {
  // make sure we're not overwriting an existing game
  if (game != null) {
    return;
  }
  // set everything to empties
  game = null;
  food = null;
  snake = null;
  vel_input = null;
  game_flash = 0;
  // start game preparation
  context.drawImage(board, 0, 0);
  snake = create_snake()
  food = create_food();
  render_snake();
  render_food();
  window.addEventListener('keydown', keypress, false);
  game = setInterval(game_tick, 500);
}

// Creates a food in an available space
function create_food() {
  let spaces = JSON.parse(JSON.stringify(grid_list));
  snake.tail.forEach( function(item) {
    spaces[item.x * 6 + item.y] = null;
  })
  let available = spaces.filter( function(item) {
    return item != null
  });
  return available[Math.floor(Math.random() * available.length)];
}

function render_puck(color, x, y) {
  if (x < 0 || x > 6 || y < 0 || y > 5) {
    console.log("Puck out of bounds", x, y)
  }
  let coord = grid_list[x * 6 + y];
  context.drawImage(color, coord.px, coord.py);
}

function render_snake() {
  snake.tail.forEach( function(i) {
    render_puck(yellow, i.x, i.y);
  });
}

function render_food() {
  render_puck(red, food.x, food.y);
}

function coord_out_of_bounds(pos) {
  return pos.x < 0 || 
         pos.x > 6 ||
         pos.y < 0 || 
         pos.y > 5
}

function prepare_board() {
  context.drawImage(board, 0, 0);
};

function keypress(event) {
  // Prevent arrow keys from scrolling around
  if (event.code == "ArrowLeft" ||
      event.code == "ArrowRight" ||
      event.code == "ArrowUp" ||
      event.code == "ArrowDown") {
    event.preventDefault();
  }
  if (snake.vel.x == 0 && event.code == "ArrowLeft") {
    vel_input = {x: -1, y: 0};
  }
  else if (snake.vel.x == 0 && event.code == "ArrowRight") {
    vel_input = {x: 1, y: 0};
  }
  else if (snake.vel.y == 0 && event.code == "ArrowDown") {
    vel_input = {x: 0, y: -1};
  }
  else if (snake.vel.y == 0 && event.code == "ArrowUp") {
    vel_input = {x: 0, y: 1};
  }
}

function game_loop() {
  // apply user user input
  if (vel_input != null) {
    snake.vel.x = vel_input.x;
    snake.vel.y = vel_input.y;
  }

  // apply velocity, updating the position of the snake
  new_pos = Object.assign({}, snake.tail[snake.tail.length-1]);
  new_pos.x += snake.vel.x;
  new_pos.y -= snake.vel.y;

  // Check if new position is overlapping snake body
  let overlap = false;
  snake.tail.slice(1, snake.tail.length-1).forEach( function(item) {
    if (item.x == new_pos.x && item.y == new_pos.y) { overlap = true; }
  })
  if (overlap) {
    console.log('snake has died from eatting itself at position', new_pos);
    return false;
  }

  // Check if new position will be out of bounds
  if (coord_out_of_bounds(new_pos)) {
    console.log('snake has died out of bounds at position', new_pos);
    return false;
  }

  // Update the position of the snake. If the new position
  // is on the food, don't trim the end of the tail and instead
  // generate another food somewhere
  snake.tail.push(new_pos);
  if (new_pos.x == food.x && new_pos.y == food.y) {
    food = create_food();
  }
  else {
    snake.tail = snake.tail.splice(1);
  }

  // Re render the game
  context.drawImage(board, 0, 0);
  render_snake();
  render_food();
  return true;
}

function game_over() {
  game_flash += 1;
  if (game_flash % 2 == 1) {
    context.drawImage(board, 0, 0);
  }
  else {
    context.drawImage(board, 0, 0);
    render_snake();
    render_food();
  }
}

function game_tick() {
  if (snake.alive) {
    snake.alive = game_loop();
  }
  else if (game_flash < 7) {
    game_over();
  }
  else {
    console.log("You lost! You suck :(");
    clearInterval(game);
    game = null;
    window.removeEventListener('keydown', keypress, false);
  }
}