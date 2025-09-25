// Simple dice logic with secret tap to fix number
let fixedNumber = null;
let tapSequence = [];
let isLongPress = false;
let longPressTimeout = null;

// Dummy 3D render placeholder (replace with Three.js scene)
const diceContainer = document.getElementById('dice-container');
diceContainer.innerHTML = '<div id="dice-face" style="font-size:120px;user-select:none;cursor:pointer;">🎲</div>';

function rollDice(showFixed = false) {
  let result = fixedNumber && showFixed ? fixedNumber : Math.floor(Math.random() * 6) + 1;
  document.getElementById('dice-face').textContent = result;
}

// Secret tap logic: Tap corners (Top-Left, Top-Right, Bottom-Left, Bottom-Right, Center) in a secret sequence to set fixedNumber
diceContainer.addEventListener('click', (e) => {
  // Calculate tap area (can later improve for mobile)
  const rect = diceContainer.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const w = rect.width, h = rect.height;

  let area = '';
  if (x < w/3 && y < h/3) area = 'TL';
  else if (x > 2*w/3 && y < h/3) area = 'TR';
  else if (x < w/3 && y > 2*h/3) area = 'BL';
  else if (x > 2*w/3 && y > 2*h/3) area = 'BR';
  else area = 'C';

  tapSequence.push(area);

  // Example: TL,TR,BL,BR,C + number = set fixedNumber
  if (tapSequence.length > 6) tapSequence.shift();
  // For demo, fix number 6 if user taps all corners then center
  if (tapSequence.join(',') === 'TL,TR,BL,BR,C,TR') {
    fixedNumber = 6;
    showFixedIndicator(true);
    setTimeout(() => showFixedIndicator(false), 1200);
    tapSequence = [];
    return;
  }
  // Reset fixed number if tap sequence is repeated
  if (tapSequence.join(',') === 'C,C,C,C,C,C') {
    fixedNumber = null;
    showFixedIndicator(false);
    tapSequence = [];
    rollDice();
    return;
  }
  rollDice();
});

// Long press to show fixed number
diceContainer.addEventListener('mousedown', () => {
  longPressTimeout = setTimeout(() => {
    isLongPress = true;
    rollDice(true);
    showFixedIndicator(true);
  }, 700);
});
diceContainer.addEventListener('mouseup', () => {
  clearTimeout(longPressTimeout);
  if (isLongPress) {
    showFixedIndicator(false);
    isLongPress = false;
    rollDice();
  }
});

function showFixedIndicator(show) {
  const el = document.getElementById('fixed-indicator');
  if (fixedNumber && show) {
    el.textContent = `FIXED: ${fixedNumber}`;
    el.classList.add('active');
  } else {
    el.textContent = '';
    el.classList.remove('active');
  }
}

// Initial roll
rollDice();