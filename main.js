const prompt = require('prompt-sync')({ sigint: true });

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
  constructor(field) {
    this._field = field;
    this._position = {
      vert: 0,
      horiz: 0
    }
  }

  get field() {
    return this._field;
  }

  set field(value) {
    this._field.horiz = value.horiz;
    this._field.vert = value.vert;

    return this.field;
  }

  get position() {
    return this._position;
  }

  set position(value) {
    this._position.horiz = value.horiz;
    this._position.vert = value.vert;

    return this.position;
  }

  updatePosition(value) {
    value = value.toLowerCase();

    if (!['u', 'd', 'l', 'r'].includes(value)) {
      console.log('Please enter a valid direction!');
      console.log('Valid Directions: U, D, L, R');
      return
    }

    if (value === 'u') {
      this.position = {
        vert: this.position.vert - 1,
        horiz: this.position.horiz
      }
    } else if (value === 'd') {
      this.position = {
        vert: this.position.vert + 1,
        horiz: this.position.horiz
      }
    } else if (value === 'l') {
      this.position = {
        vert: this.position.vert,
        horiz: this.position.horiz - 1
      }
    } else if (value === 'r') {
      this.position = {
        vert: this.position.vert,
        horiz: this.position.horiz + 1
      }
    }

    return this.position;
  }

  print() {
    for (let line of this._field) console.log(line.join(''))
    return
  }

  generateField(height, width, holesPercentage = .10) {

    let field = new Array(height);

    for (let row = 0; row < field.length; row++) {
      field[row] = Array.from(fieldCharacter.repeat(width))
    }

    // set the hat
    let hatX = Math.floor(Math.random() * width);
    let hatY = Math.floor(Math.random() * height);

    while (hatX === 0 && hatY === 0) {
      let hatX = Math.floor(Math.random() * width);
      let hatY = Math.floor(Math.random() * height);
    }

    field[hatY][hatX] = hat;

    // random holes
    const totalCharacter = height * width;
    let numOfHoles = Math.ceil(totalCharacter * holesPercentage);

    while (numOfHoles-- > 0) {
      let holeX = Math.floor(Math.random() * width);
      let holeY = Math.floor(Math.random() * height);

      while (holeX === 0 && holeY === 0 || field[holeY][holeX] === hat) {
        let holeX = Math.floor(Math.random() * width);
        let holeY = Math.floor(Math.random() * height);
      }

      field[holeY][holeX] = hole;
    }

    // show character
    field[0][0] = pathCharacter;

    // update field to the new field
    this._field = field;
    return
  }

  playGame() {
    console.log('Welcome to Locate your Hat!')
    let userFieldHeight = Number(prompt('Pick your field height'));
    let userFieldWidth = Number(prompt('Pick your field width'));

    // generate a field
    this.generateField(userFieldHeight, userFieldWidth);


    console.log('Your hat is a caret "^" on the map!')
    console.log('Use "L" for left, "R" for right, "U" for up, "D" for down')

    let isValid = true;
    // Keep taking the user input and print until 1 of 3 things happen
    while (isValid) {
      let userInput = prompt(this.print());

      this.updatePosition(userInput);

      // user coordinates match a hole
      if (this._field[this.position.vert][this.position.horiz] === hole) {
        console.log('You fell in a hole!');
        isValid = false;
      }

      // user coordinate falls out of bounds
      if (this.position.horiz < 0 || this.position.horiz >= this._field[0].length) {
        console.log('You fell out of bounds!');
        isValid = false;
      }

      if (this.position.vert < 0 || this.position.vert >= this._field.length) {
        console.log('You fell out of bounds!');
        isValid = false;
      }

      // user coordinates match the hat
      if (this._field[this.position.vert][this.position.horiz] === hat) {
        console.log('YOU WIN!');
        isValid = false;
      }

      this.field[this.position.vert][this.position.horiz] = pathCharacter;

    }
  }

}

const myField = new Field([
  ['*', '░', 'O'],
  ['░', 'O', '░'],
  ['░', '^', '░'],
]);


// myField.playGame();

myField.playGame()
