// const question = document.querySelector('#question');
// const choices = Array.from(document.querySelectorAll('.choice-text'));

const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text")); // Array formation of each four classes named choice-text
// console.log(choices);
// const questionCounterText = document.getElementById("questionCounter");
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");

//(12) - Create a Spinning Loader
const loader = document.getElementById("loader");
const game = document.getElementById("game");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];
// let questions = []; // preveously it was an hard coded of array of question objects.

fetch(
  "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple"
)
  .then((res) => {
    return res.json();
  })
  .then((loadedQuestions) => {
   //  console.log(loadedQuestions.results); // Array(10) of random question fetched from trivia DB
    questions = loadedQuestions.results.map((loadedQuestion) => {
      const formattedQuestion = {
        question : loadedQuestion.question      /* question : "What is the first book of the Old Testament?" */,
      };                                /*incorrect_answers : (3) ['Exodus', 'Leviticus', 'Numbers'] */
      // console.log(formattedQuestion);                                 /*correct_answer : "Genesis" */
      const answerChoices = [...loadedQuestion.incorrect_answers];       // these are three incorrect answer .. and we need one more that is correct answer at random place
      formattedQuestion.answer = Math.floor(Math.random() * 4) + 1; // Random index between 1 and 4
      answerChoices.splice(
        formattedQuestion.answer - 1, //did minus (-1) ->To make formattedQuestion.answer 0-based index
        0, //We aren't gonna remove any element
        loadedQuestion.correct_answer    // we are adding loadedQuestion ka correct answer .. that is forth option
      );

      answerChoices.forEach((choice, index) => {             //The forEach() method calls a function for each element in an array answerChoice.
        formattedQuestion["choice" + (index + 1)] = choice;
      });
      // console.log(formattedQuestion);
      return formattedQuestion;
    });
    startGame();
  })
  .catch((err) => {
    console.error(err);
  });

// let questions = [];
// fetch("questions.json")
//   .then((res) => {
//     // console.log(res);
//     return res.json();
//   })
//   .then((loadedQuestion) => {
//     // console.log(loadedQuestion);
//     questions = loadedQuestion;
//     startGame();
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 5;

startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuesions = [...questions];
  // console.log(availableQuesions[0]);
  // console.log(availableQuesions[2]);
  // console.log(availableQuesions[1]);
  getNewQuestion();

  game.classList.remove("hidden");     //By default hidden  class is removed
  loader.classList.add("hidden");      // inside loader id hidden class is added and inside game.css animation is added for 1 second 
};

getNewQuestion = () => {
  if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem("mostRecentScore", score);
    //go to the end page
    return window.location.assign("end.html");
  }
  questionCounter++;

  // questionCounterText.innerHTML = questionCounter + "/" + MAX_QUESTIONS;      // using string concatination
  // questionCounterText.innerHTML = `${questionCounter}/${MAX_QUESTIONS}`;        // using back-tick in ES6
  progressText.innerHTML = `Question ${questionCounter}/${MAX_QUESTIONS}`;

  //Update the progress bar
  progressBarFull.style.width = `${
    ((questionCounter - 1) / MAX_QUESTIONS) * 100
  }%`; // (1/3)*100 == 33%
  const questionIndex = Math.floor(Math.random() * availableQuesions.length); // 0 to 2 index

  // console.log(questionIndex);
  currentQuestion = availableQuesions[questionIndex];
  // console.log(currentQuestion);              //{question: " How do you write 'Hello World' in an alert box?", choice1: "msgBox('Hello World');", choice2: "alertBox('Hello World');", choice3: "msg('Hello World');", choice4: "alert('Hello World');", …}
  // console.log(currentQuestion.question);         //  How do you write 'Hello World' in an alert box?

  question.innerHTML = currentQuestion.question; // id referenced question ka innerHTML .. current question ke innerHTML se badal do

  choices.forEach((choice) => {
    // choices is the array of that four classses
    // console.log(choice.dataset);    //DOMStringMap {number: '1'}  DOMStringMap {number: '2'}  .. like that four times
    const number = choice.dataset["number"];
    // console.log(number);          // 1 , 2, 3 , 4 respectively
    choice.innerHTML = currentQuestion["choice" + number]; // choice1 , choice2 ,.... so on till choice4  ..for displaying like that
  });

  availableQuesions.splice(questionIndex, 1); // splice(start, deleteCount) splice out that available quetion so no repeatation
  acceptingAnswers = true;
};

choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    if (!acceptingAnswers) return;

    // console.log(e.target);     //  <p class="choice-text" data-number="2">&lt;javascript&gt;</p>
    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];
    // console.log(selectedAnswer);     // 1 , 2 ,3 ,4 like that

    // console.log(selectedAnswer , currentQuestion.answer);
    // console.log(selectedAnswer == currentQuestion.answer);

    const classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

    if (classToApply === "correct") {
      incrementScore(CORRECT_BONUS);
    }
    selectedChoice.parentElement.classList.add(classToApply); // add the class
    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply); // remove the class immidietly and seems like nothing happened
      getNewQuestion();
    }, 700);

    // getNewQuestion();
  });
});

incrementScore = (num) => {
  score += num;
  scoreText.innerHTML = score;
};

// startGame();  // now it will be called inside fetched question part



//  https://opentdb.com/          trivia data base
//  https://opentdb.com/api_config.php           api generator of question from trivia DB
//  https://jsonformatter.curiousconcept.com/     JSON Formatter to simple structre
/*
{
   "response_code":0,
   "results":[
      {
         "type":"multiple",
         "difficulty":"easy",
         "category":"General Knowledge",
         "question":"What word represents the letter &#039;T&#039; in the NATO phonetic alphabet?",
         "correct_answer":"Tango",
         "incorrect_answers":[
            "Target",
            "Taxi",
            "Turkey"
         ]
      },
      {
         "type":"multiple",
         "difficulty":"easy",
         "category":"General Knowledge",
         "question":"What company developed the vocaloid Hatsune Miku?",
         "correct_answer":"Crypton Future Media",
         "incorrect_answers":[
            "Sega",
            "Sony",
            "Yamaha Corporation"
         ]
      },
      {
         "type":"multiple",
         "difficulty":"easy",
         "category":"General Knowledge",
         "question":"Which of the following is not an Ivy League University?",
         "correct_answer":"Stanford",
         "incorrect_answers":[
            "University of Pennsylvania",
            "Harvard",
            "Princeton"
         ]
      },
      {
         "type":"multiple",
         "difficulty":"easy",
         "category":"General Knowledge",
         "question":"Five dollars is worth how many nickles?",
         "correct_answer":"100",
         "incorrect_answers":[
            "50",
            "25",
            "69"
         ]
      },
      {
         "type":"multiple",
         "difficulty":"easy",
         "category":"General Knowledge",
         "question":"Which country, not including Japan, has the most people of japanese decent?",
         "correct_answer":"Brazil",
         "incorrect_answers":[
            "China",
            "South Korea",
            "United States of America"
         ]
      },
      {
         "type":"multiple",
         "difficulty":"easy",
         "category":"General Knowledge",
         "question":"The Canadian $1 coin is colloquially known as a what?",
         "correct_answer":"Loonie",
         "incorrect_answers":[
            "Boolie",
            "Foolie",
            "Moodie"
         ]
      },
      {
         "type":"multiple",
         "difficulty":"easy",
         "category":"General Knowledge",
         "question":"When one is &quot;envious&quot;, they are said to be what color?",
         "correct_answer":"Green",
         "incorrect_answers":[
            "Red",
            "Blue",
            "Yellow"
         ]
      },
      {
         "type":"multiple",
         "difficulty":"easy",
         "category":"General Knowledge",
         "question":"In which fast food chain can you order a Jamocha Shake?",
         "correct_answer":"Arby&#039;s",
         "incorrect_answers":[
            "McDonald&#039;s",
            "Burger King",
            "Wendy&#039;s"
         ]
      },
      {
         "type":"multiple",
         "difficulty":"easy",
         "category":"General Knowledge",
         "question":"The &ldquo;fairy&rdquo; type made it&rsquo;s debut in which generation of the Pokemon core series games?",
         "correct_answer":"6th",
         "incorrect_answers":[
            "2nd",
            "7th",
            "4th"
         ]
      },
      {
         "type":"multiple",
         "difficulty":"easy",
         "category":"General Knowledge",
         "question":"Waluigi&#039;s first appearance was in what game?",
         "correct_answer":"Mario Tennis 64 (N64)",
         "incorrect_answers":[
            "Wario Land: Super Mario Land 3",
            "Mario Party (N64)",
            "Super Smash Bros. Ultimate"
         ]
      }
   ]
}


  */
