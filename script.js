
// Original Variables and Arrays
let sounds = [];
let soundButtons = [];
let targets = [];
let placeholderImage;
let buttonImage;
let folderNames = ["Bad Speaker", "Chewing", "Metal Friction", "Snoring", "Styrofoam"];
let soundFiles = [
  "sound/bad speaker.mp3",
  "sound/chewing.mp3",
  "sound/metal friction.mp3",
  "sound/snoring.mp3",
  "sound/styrofoam.mp3"
];
let activeButton = null;

// Preload assets including new sound files
function preload() {
  for (let i = 0; i < soundFiles.length; i++) {
    sounds.push(loadSound(soundFiles[i]));
  }
  placeholderImage = loadImage("Opened Folder copy.png");
  buttonImage = loadImage("Music Disc copy.png");
}

// Setup canvas, draggable discs, and target folders
function setup() {
  const canvasContainer = document.getElementById("canvas-container");
  const canvas = createCanvas(800, 600);
  canvas.parent(canvasContainer);

  for (let i = 0; i < soundFiles.length; i++) {
    // Assign each sound a unique draggable disc
    soundButtons.push(new DraggableButton(random(50, 300), random(50, 300), 60, 60, i));
    targets.push({ x: 700, y: 100 + i * 100, w: 60, h: 60, name: folderNames[i] });
  }
}

// Draw canvas and display all components
function draw() {
  background(224);

  // Draw draggable discs
  for (let i = 0; i < soundButtons.length; i++) {
    soundButtons[i].update();
    soundButtons[i].display();
  }

  // Draw folders
  for (let i = 0; i < targets.length; i++) {
    drawFolder(targets[i].x, targets[i].y, targets[i].w, targets[i].h, targets[i].name);
  }
}

// Draw a folder with its label
function drawFolder(x, y, w, h, name) {
  image(placeholderImage, x, y, w, h);
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(12);
  text(name, x + w / 2, y + h + 15);
}

// Handle mouse press for dragging
function mousePressed() {
  for (let i = 0; i < soundButtons.length; i++) {
    if (soundButtons[i].isMouseOver()) {
      soundButtons[i].startDragging();
      if (sounds[soundButtons[i].soundIndex].isLoaded()) {
        sounds[soundButtons[i].soundIndex].play();
      }
      break;
    }
  }
}

// Handle mouse release for drag-and-match logic
function mouseReleased() {
  let draggingIndex = soundButtons.findIndex(button => button.isDragging);

  if (draggingIndex !== -1) {
    const button = soundButtons[draggingIndex];
    const target = targets[button.soundIndex];

    // Check if button is dropped on the correct folder
    if (
      button.x + button.w / 2 > target.x &&
      button.x + button.w / 2 < target.x + target.w &&
      button.y + button.h / 2 > target.y &&
      button.y + button.h / 2 < target.y + target.h
    ) {
      soundButtons.splice(draggingIndex, 1); // Remove the matched button
    }
    button.stopDragging();
  }
}

// Draggable button class with improved dragging logic
class DraggableButton {
  constructor(x, y, w, h, soundIndex) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.soundIndex = soundIndex;
    this.isDragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  display() {
    image(buttonImage, this.x, this.y, this.w, this.h);
  }

  update() {
    if (this.isDragging) {
      this.x = mouseX + this.offsetX;
      this.y = mouseY + this.offsetY;
    }
  }

  isMouseOver() {
    return (
      mouseX > this.x &&
      mouseX < this.x + this.w &&
      mouseY > this.y &&
      mouseY < this.y + this.h
    );
  }

  startDragging() {
    this.isDragging = true;
    this.offsetX = this.x - mouseX;
    this.offsetY = this.y - mouseY;
  }

  stopDragging() {
    this.isDragging = false;
  }
}

// Pop-up functionality for buttons
function togglePopup(buttonId) {
  const button = document.getElementById(buttonId);
  const popup = document.getElementById("popup");

  if (activeButton === button) return;

  if (activeButton) activeButton.classList.remove("pressed");

  button.classList.add("pressed");
  activeButton = button;

  document.getElementById("popup-title").textContent = button.textContent;
  document.getElementById("popup-message").textContent = `${button.textContent} action performed!`;

  popup.classList.remove("hidden");
  popup.style.display = "block";
}

// Close the pop-up
function closePopup() {
  const popup = document.getElementById("popup");
  popup.style.display = "none";
  popup.classList.add("hidden");

  if (activeButton) {
    activeButton.classList.remove("pressed");
    activeButton = null;
  }
}