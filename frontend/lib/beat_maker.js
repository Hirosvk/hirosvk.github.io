const KickDrum = require('./drum.js').KickDrum;
const BeatPatterns = require('../constants/beat_patterns.js');

function BeatMaker(options){
  // this.tempo = options.tempo;
  this.pattern = BeatPatterns[options.pattern];
  // this.timeSig = options.timeSig;

  this.emitNotes = options.emitNotes;
  this.clearStore = options.clearStore;
  // this.setListenStatus = options.setListenStatus;
  this.drum = new KickDrum;
}

BeatMaker.prototype.manageBeat = function () {
  this.barIdx = this.barIdx || 0;
  this.beatIdx = this.beatIdx || 0;
  if (this.pattern[this.barIdx][this.beatIdx]){
    this.drum.start();
    this.emitNotes();
  }
  // update indices below
  if (this.beatIdx === this.pattern[0].length - 1){
    this.beatIdx = 0;
    this.clearStore();
    if (this.barIdx === this.pattern.length - 1){
      this.barIdx = 0;
    } else {
      this.barIdx++;
    }
  } else {
    this.beatIdx++;
  }
};


// BeatMaker.prototype.start = function () {
//   this.setListenStatus(true);
//   let interval = 1000 / (this.pattern[0].length / this.timeSig) * (60/this.tempo);
//   this.currentBeat = setInterval(this.manageBeat.bind(this), interval);
// };
//
// BeatMaker.prototype.stop = function () {
//   this.setListenStatus(false);
//   if (this.currentBeat) { clearInterval(this.currentBeat); }
// };


module.exports = BeatMaker;
