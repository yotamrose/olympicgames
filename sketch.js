let person;
let hoop;
let target;
let score = 0;
let gameState = "aiming"; // "aiming" or "throwing"
let gender = "male"; // Default gender
let maleButton, femaleButton;

function setup() {
  createCanvas(800, 600);
  person = new Person(100, height - 150, gender);
  hoop = new Hoop(person.x + 70, person.y - 60);
  target = new Target(700, 300);
  
  // Create gender selection buttons
  maleButton = createButton('Male');
  maleButton.position(20, 20);
  maleButton.mousePressed(() => changeGender('male'));
  
  femaleButton = createButton('Female');
  femaleButton.position(80, 20);
  femaleButton.mousePressed(() => changeGender('female'));
}

function draw() {
  background(135, 206, 235); // Sky blue
  
  // Draw ground
  fill(34, 139, 34);
  rect(0, height - 50, width, 50);
  
  // Display score
  fill(0);
  textSize(24);
  textAlign(RIGHT);
  text(`Score: ${score}`, width - 20, 30);
  
  // Display stage
  textAlign(CENTER);
  textSize(24);
  if (score < 5) {
    text("Stage 1", width / 2, 30);
  } else {
    text("Stage 2", width / 2, 30);
  }
  
  target.display();
  person.display();
  hoop.display();
  
  if (score >= 5) {
    target.move();
  }
  
  if (gameState === "aiming") {
    person.aim(mouseX, mouseY);
  } else if (gameState === "throwing") {
    hoop.move();
    if (hoop.hits(target)) {
      score++;
      resetGame();
    }
    if (hoop.offScreen()) {
      resetGame();
    }
  }
}

function mousePressed() {
  if (gameState === "aiming") {
    person.throw();
    hoop.throw(person.throwForce);
    gameState = "throwing";
  }
}

function resetGame() {
  person = new Person(100, height - 150, gender);
  hoop = new Hoop(person.x + 70, person.y - 60);
  target.y = random(100, height - 100);
  gameState = "aiming";
}

function changeGender(newGender) {
  gender = newGender;
  resetGame();
}

class Person {
  constructor(x, y, gender) {
    this.x = x;
    this.y = y;
    this.gender = gender;
    this.armAngle = 0;
    this.throwForce = createVector(0, 0);
  }
  
  display() {
    push();
    translate(this.x, this.y);
    
    // Legs
    fill(200, 0, 0); // Red shorts
    rect(-25, -50, 50, 50);
    fill(255, 220, 180); // Skin tone
    rect(-20, 0, 15, 40); // Left leg
    rect(5, 0, 15, 40); // Right leg
    
    // Torso
    fill(255); // White shirt
    rect(-30, -100, 60, 50);
    fill(200, 0, 0); // Red stripe
    rect(-30, -85, 60, 20);
    
    // Arms
    push();
    translate(0, -90);
    rotate(this.armAngle);
    fill(255, 220, 180);
    ellipse(0, 0, 20, 20); // Shoulder
    rect(0, -10, 70, 20); // Upper arm
    ellipse(70, 0, 20, 20); // Elbow
    pop();
    
    fill(255, 220, 180);
    rect(-40, -100, 15, 40); // Other arm
    
    // Head
    fill(255, 220, 180);
    ellipse(0, -120, 40, 40);
    
    // Hair
    fill(0);
    if (this.gender === 'male') {
      arc(0, -120, 40, 40, PI, TWO_PI);
    } else {
      arc(0, -120, 40, 40, PI, TWO_PI);
      rect(-20, -120, 40, 30);
    }
    
    // Gender-specific features
    if (this.gender === 'female') {
      fill(200, 0, 0);
      arc(0, -75, 40, 20, PI, TWO_PI); // Suggest a female figure
    }
    
    pop();
  }
  
  aim(targetX, targetY) {
    let angle = atan2(targetY - (this.y - 90), targetX - this.x);
    this.armAngle = constrain(angle, -PI/2, PI/2);
    
    let force = p5.Vector.sub(createVector(targetX, targetY), createVector(this.x, this.y - 90));
    force.normalize();
    force.mult(15);
    this.throwForce = force;
  }
  
  throw() {
    // Animate throw
    this.armAngle = PI/2;
  }
}

class Hoop {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 40;
    this.velocity = createVector(0, 0);
  }
  
  display() {
    fill(255, 0, 0);
    ellipse(this.x, this.y, this.size);
    fill(255);
    ellipse(this.x, this.y, this.size - 10);
  }
  
  throw(force) {
    this.velocity = force;
  }
  
  move() {
    this.velocity.y += 0.3; // Gravity
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
  
  hits(target) {
    let d = dist(this.x, this.y, target.x, target.y);
    return d < (this.size / 2 + target.size / 2);
  }
  
  offScreen() {
    return this.y > height || this.x > width;
  }
}

class Target {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 60;
    this.direction = 1; // 1 for moving down, -1 for moving up
    this.speed = 2;
  }
  
  display() {
    fill(255, 255, 0);
    rect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
  }
  
  move() {
    this.y += this.direction * this.speed;
    if (this.y > height - this.size / 2 - 50 || this.y < this.size / 2) {
      this.direction *= -1;
    }
  }
}
