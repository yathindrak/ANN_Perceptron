// A list of points we will use to "train" the perceptron
let trainingSet = new Array(2000);
// A Perceptron object
let perceptron;

// We will train the perceptron with one "Point" object at a time
let count = 0;

// Coordinate space
let xmin = -1;
let ymin = -1;
let xmax = 1;
let ymax = 1;

// learning rate
const learningRate = 0.001;

// num of inputs with bias
const numOfInputs = 3; // -> 2 inputs(x,y for each point) + bias -> 3

// bias value should be 1 - (otherwise if inputs are zero. weighted sum will be zero. That is wrong)
const bias = 1;

// The function to describe a line -> y = mx + c
function f(x) {
  return -0.9 * x + 0.4;
}

/**
 * P5.js setup
 */
function setup() {
  createCanvas(400, 400);

  // The perceptron has 3 inputs -- x, y, and bias
  // Second value is "Learning Constant"
  perceptron = new Perceptron(numOfInputs, learningRate); // Learning Constant is low just b/c it's fun to watch, this is not necessarily optimal

  // Create a random set of trainingSet points and calculate the "known" answer
  for (let i = 0; i < trainingSet.length; i++) {
    let x = random(xmin, xmax);
    let y = random(ymin, ymax);
    let answer = 1;
    if (y < f(x)) answer = -1;
    trainingSet[i] = {
      input: [x, y, bias],
      output: answer
    };
  }
}


function draw() {
  background(0);

  // Draw the initial line
  strokeWeight(1);
  stroke(255);
  let x1 = map(xmin, xmin, xmax, 0, width);
  let y1 = map(f(xmin), ymin, ymax, height, 0);
  let x2 = map(xmax, xmin, xmax, 0, width);
  let y2 = map(f(xmax), ymin, ymax, height, 0);
  line(x1, y1, x2, y2);

  // Draw the line based on the current weights
  // Formula is weights[0]*x + weights[1]*y + weights[2] = 0
  stroke(255);
  strokeWeight(2);
  let weights = perceptron.getWeights();
  x1 = xmin;
  x2 = xmax;

  // With the equation "w0(x)+w1(y)+w2(b)=0" -> This is the equation of line
  // we can then make this "w0(x)+w2(b)=-w1(y)" 
  // which then becomes "y = -w0(x)/w1-w2(b)/w1"
  // since bias (b) is zero,
  // "y = -w0(x)/w1-w2/w1"
  y1 = (-weights[2] - weights[0] * x1) / weights[1];
  y2 = (-weights[2] - weights[0] * x2) / weights[1];

  x1 = map(x1, xmin, xmax, 0, width);
  y1 = map(y1, ymin, ymax, height, 0);
  x2 = map(x2, xmin, xmax, 0, width);
  y2 = map(y2, ymin, ymax, height, 0);
  line(x1, y1, x2, y2);


  // Train the Perceptron with one "training set" point at a time
  perceptron.train(trainingSet[count].input, trainingSet[count].output);
  count = (count + 1) % trainingSet.length;

  // Draw all the points based on what the Perceptron would "guess"
  // Does not use the "known" correct answer
  for (let i = 0; i < count; i++) {
    stroke(255);
    strokeWeight(1);
    fill(255);
    let guess = perceptron.feedforward(trainingSet[i].input);
    if (guess > 0) noFill();

    let x = map(trainingSet[i].input[0], xmin, xmax, 0, width);
    let y = map(trainingSet[i].input[1], ymin, ymax, height, 0);
    ellipse(x, y, 8, 8);
  }
}
