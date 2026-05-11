// stores flashcard information
const flashcards = [
  {
    symbol: "♩",
    answer: "Quarter Note"
  },
  {
    symbol: "𝅗𝅥",
    answer: "Half Note"
  },
  {
    symbol: "𝅝",
    answer: "Whole Note"
  },
  {
    symbol: "♩.",
    answer: "Dotted Quarter Note"
  }
];

// keeps track of the current flashcard
let flashcardIndex = 0;

// displays the current flashcard
function showFlashcard() {

  // grabs flashcard elements
  const flashcard =
    document.getElementById("flashcard");

  const symbol =
    document.getElementById("flashcard-symbol");

  const answer =
    document.getElementById("flashcard-answer");

  // prevents errors on pages without flashcards
  if (!flashcard || !symbol || !answer) {
    return;
  }

  // resets card to front side
  flashcard.classList.remove("flipped");

  // updates symbol and answer
  symbol.textContent =
    flashcards[flashcardIndex].symbol;

  answer.textContent =
    flashcards[flashcardIndex].answer;
}

// loads next flashcard
function nextFlashcard() {

  flashcardIndex++;

  // loops back to beginning
  if (flashcardIndex >= flashcards.length) {
    flashcardIndex = 0;
  }

  showFlashcard();
}

// rhythm patterns that all equal exactly 4 beats
const rhythmPatterns = [

  // four quarter notes
  [
    { symbol: "♩", type: "quarter", beats: 1 },
    { symbol: "♩", type: "quarter", beats: 1 },
    { symbol: "♩", type: "quarter", beats: 1 },
    { symbol: "♩", type: "quarter", beats: 1 }
  ],

  // eighth note rhythm
  [
    { symbol: "♪ ♪", type: "eighthPair", beats: 1 },
    { symbol: "♩", type: "quarter", beats: 1 },
    { symbol: "♪ ♪", type: "eighthPair", beats: 1 },
    { symbol: "♩", type: "quarter", beats: 1 }
  ],

  // half note rhythm
  [
    { symbol: "𝅗𝅥", type: "half", beats: 2 },
    { symbol: "♩", type: "quarter", beats: 1 },
    { symbol: "♩", type: "quarter", beats: 1 }
  ],

  // dotted quarter rhythm
  [
    { symbol: "♩.", type: "dottedQuarter", beats: 1.5 },
    { symbol: "♪", type: "eighthSingle", beats: 0.5 },
    { symbol: "♩", type: "quarter", beats: 1 },
    { symbol: "♩", type: "quarter", beats: 1 }
  ]
];

// stores current rhythm
let currentRhythm = [];

// generates a random rhythm
function generateRhythm() {

  const rhythmDisplay =
    document.getElementById("rhythm-display");

  const rhythmStatus =
    document.getElementById("rhythm-status");

  // prevents errors on pages without rhythm content
  if (!rhythmDisplay || !rhythmStatus) {
    return;
  }

  // chooses random rhythm
  const randomIndex =
    Math.floor(Math.random() * rhythmPatterns.length);

  currentRhythm =
    rhythmPatterns[randomIndex];

  // displays rhythm horizontally
  rhythmDisplay.textContent =
    currentRhythm
      .map(note => note.symbol)
      .join("   ");

  rhythmStatus.textContent =
    "New rhythm generated. Press Play Rhythm to hear it.";
}

// plays rhythm audio
function playRhythm() {

  if (currentRhythm.length === 0) {
    generateRhythm();
  }

  const rhythmStatus =
    document.getElementById("rhythm-status");

  const AudioContext =
    window.AudioContext || window.webkitAudioContext;

  const audioContext =
    new AudioContext();

  let startTime =
    audioContext.currentTime + 0.1;

  const beatLength = 0.55;

  currentRhythm.forEach(note => {

    if (note.type === "quarter") {

      playClick(audioContext, startTime);

    }

    else if (note.type === "half") {

      playClick(audioContext, startTime);

    }

    else if (note.type === "dottedQuarter") {

      playClick(audioContext, startTime);

    }

    else if (note.type === "eighthSingle") {

      playClick(audioContext, startTime);

    }

    else if (note.type === "eighthPair") {

      playClick(audioContext, startTime);

      playClick(
        audioContext,
        startTime + (0.5 * beatLength)
      );
    }

    // advances playback timing
    startTime += note.beats * beatLength;
  });

  if (rhythmStatus) {

    rhythmStatus.textContent =
      "Playing rhythm. Try clapping along.";
  }
}

// creates click sound
function playClick(audioContext, time) {

  const oscillator =
    audioContext.createOscillator();

  const gain =
    audioContext.createGain();

  oscillator.type = "square";

  oscillator.frequency.value = 900;

  gain.gain.setValueAtTime(0.4, time);

  gain.gain.exponentialRampToValueAtTime(
    0.01,
    time + 0.08
  );

  oscillator.connect(gain);

  gain.connect(audioContext.destination);

  oscillator.start(time);

  oscillator.stop(time + 0.08);
}

// waits until page fully loads
document.addEventListener(
  "DOMContentLoaded",
  function () {

    // flashcard elements
    const flashcard =
      document.getElementById("flashcard");

    const nextFlashcardButton =
      document.getElementById("next-flashcard-btn");

    // connects flashcard interactions
    if (flashcard && nextFlashcardButton) {

      // flips flashcard
      flashcard.addEventListener(
        "click",
        function () {

          flashcard.classList.toggle("flipped");

        }
      );

      // loads next flashcard
      nextFlashcardButton.addEventListener(
        "click",
        nextFlashcard
      );

      // loads first card
      showFlashcard();
    }

    // rhythm elements
    const newRhythmButton =
      document.getElementById("new-rhythm-btn");

    const playRhythmButton =
      document.getElementById("play-rhythm-btn");

    // connects rhythm buttons
    if (
      newRhythmButton &&
      playRhythmButton
    ) {

      newRhythmButton.addEventListener(
        "click",
        generateRhythm
      );

      playRhythmButton.addEventListener(
        "click",
        playRhythm
      );

      // loads rhythm immediately
      generateRhythm();
    }
  }
);