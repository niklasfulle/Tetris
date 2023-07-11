let playfield, fallingPiece, ghostPiece, paused;

const width = 10;
const height = 22;

function setup() {
    playfield = new Playfield(width, height);

    let totalWidth = playfield.cellSize * width + playfield.borderSize * 2;
    let totalHeight = playfield.cellSize * height + playfield.borderSize * 2;

    createCanvas(totalWidth, totalHeight);

    spawnNewPiece();
}

let prev = 0;
function draw() {
    let curr = millis();
    let delta = curr - prev;
    prev = curr;

    if (!paused) fallingPiece.update(delta);

    // move down piece and spawn a new one
    // if necessary
    if (fallingPiece.timeToFall()) {
        fallingPiece.resetBuffer();
        fallingPiece.moveDown();

        if (!playfield.isValid(fallingPiece)) {
            fallingPiece.moveUp();
            spawnNewPiece();
        }
    }

    playfield.clearLines();

    playfield.show();
    fallingPiece.show();
}

function spawnNewPiece() {
    if (fallingPiece) {
        playfield.addToGrid(fallingPiece);
    }

    const pieces = ["O", "J", "L", "S", "Z", "T", "I"];
    const choice = random(pieces);
    fallingPiece = new Tetrominoes(choice, playfield);
}

function hardDrop(piece, playfield) {
    // move down as long as current position is valid
    while (playfield.isValid(piece)) {
        piece.moveDown();
    }

    // in the last iteration the position isn't valid, so move up
    piece.moveUp();
}

function keyPressed() {
    switch (key.toLowerCase()) {
        case " ":
            hardDrop(fallingPiece, playfield);
            spawnNewPiece();
            break;

        case "p":
            paused = !paused;
            break;

        case "z":
            fallingPiece.rotateCCW();
            // if not valid, rotate back
            if (!playfield.isValid(fallingPiece)) fallingPiece.rotateCW();
            break;

        case "x":
            fallingPiece.rotateCW();
            // if not valid, rotate back
            if (!playfield.isValid(fallingPiece)) fallingPiece.rotateCCW();
            break;
    }

    switch (keyCode) {
        case UP_ARROW:
            fallingPiece.rotateCW();
            if (!playfield.isValid(fallingPiece)) fallingPiece.rotateCCW();
            break;
        case DOWN_ARROW:
            fallingPiece.moveDown();
            if (!playfield.isValid(fallingPiece)) fallingPiece.moveUp();
            else fallingPiece.resetBuffer();
            break;
        case RIGHT_ARROW:
            fallingPiece.moveRight();
            if (!playfield.isValid(fallingPiece)) fallingPiece.moveLeft();
            break;
        case LEFT_ARROW:
            fallingPiece.moveLeft();
            if (!playfield.isValid(fallingPiece)) fallingPiece.moveRight();
            break;
        default:
            break;
    }
}
