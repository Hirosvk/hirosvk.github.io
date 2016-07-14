const Colors = require('../constants/colors.js');
const Transpose = require('../utils/transpose.js');
const Triangle = require('./triangle.js');
const ColorTile = require('./color_tile.js');

let Pos = [[12,12],[9,9],[18,12],[9,15],[15,9],[6,12],[15,15]];

function Canvas(ctx, dims){
  this.ctx = ctx;
  this.dims = dims;
}

Canvas.prototype.setupGrid = function (triDim) {
  this.grid = {};
  this.triDim = triDim;
  this.cosDim = Math.floor(triDim * 0.866);
  this.rowLength = Math.floor(this.dims[0]/this.triDim) * 2;
  this.colLength = Math.floor(this.dims[1]/this.cosDim);

  for (let y = 0; y <= this.colLength; y++){
    for(let x = 0; x <= this.rowLength + 1; x++){
      this.grid[[x,y]] = new Triangle([x,y]);
    }
  }
};

Canvas.prototype.receiveNotes = function (notes) {
  this.notesToTiles(notes);
};

Canvas.prototype.notesToTiles = function (notes){
  let colors = this.generateColors(notes);
  console.log(colors);
  notes.forEach( (note, nIdx) => {
    colors[note].forEach( (color, cIdx) => {
      this.addColorTile(Pos[nIdx], color, cIdx);
      // if (cIdx > 5) {debugger};
      // max notes.length is 7, max colors.length is 6;
    });
  });
};

Canvas.prototype.addColorTile = function (pos, color, dirCode){
  let tile = new ColorTile(pos, color, dirCode);
  this.grid[pos].receiveColorTile(tile);
};

Canvas.prototype.generateColors = function (notes) {
  let colors = {};
  // if (notes.length > 1) {debugger;}
  for(let i = 0; i < notes.length; i++){
    _notes = notes.slice();
    _notes.splice(i, 1);
    colors[notes[i]] = _notes.map( _note => {
      return Colors[Transpose.interval(notes[i], _note)]
    })
  }
  // if (notes.length > 2) {debugger}
  return colors
};



Canvas.prototype.render = function () {
  let anchor = [0,0];
  let _x = 0;

  for (let y = 0; y <= this.colLength; y++){
    for(let x = 0; x <= this.rowLength + 1; x++){
      let row = [];
      if (x % 2 === 1){
        this.ctx.beginPath();
        this.ctx.moveTo(anchor[0], anchor[1]);
        this.ctx.lineTo(anchor[0] + Math.floor(this.triDim/2), anchor[1] + this.cosDim);
        this.ctx.lineTo(anchor[0] + this.triDim, anchor[1]);
      } else {
        this.ctx.beginPath();
        this.ctx.moveTo(anchor[0], anchor[1]);
        this.ctx.lineTo(anchor[0] - Math.floor(this.triDim/2), anchor[1] + this.cosDim);
        this.ctx.lineTo(anchor[0] + Math.floor(this.triDim/2), anchor[1] + this.cosDim);
      }
      if (this.grid[[x+_x, y]]) {
        this.ctx.fillStyle = this.grid[[x+_x, y]].getColor();
        this.ctx.fill();
      } else {
        this.ctx.closePath();
      }
      anchor[0] += (this.triDim * (x % 2));
    }
    if (y % 2 === 0){
      anchor[0] = -(Math.floor(this.triDim/2));
      _x = -1;
    } else {
      anchor[0] = 0;
      _x = 0;
    }
    anchor[1] += this.cosDim;
  }
};



Canvas.prototype.moveColorTiles = function () {
  let leavingTiles = [];
  for (let y = 0; y <= this.colLength; y++){
    for(let x = 0; x <= this.rowLength + 1; x++){
      leavingTiles = leavingTiles.concat(this.grid[[x,y]].emitColorTiles());
    }
  }
  leavingTiles.forEach( tile => {
    if (this.grid[tile.pos]){
      this.grid[tile.pos].receiveColorTile(tile);
    }
  });
};

Canvas.prototype.renderFrame = function () {
  this.render();
  this.moveColorTiles();
};

Canvas.prototype.animate = function(){
  this.animation = setInterval(this.renderFrame.bind(this), 100);
};

Canvas.prototype.stopAnimation = function(){
  clearInterval(this.animation);
};

module.exports = Canvas;
window.Canvas = Canvas;