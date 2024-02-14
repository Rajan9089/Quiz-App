
const username = document.getElementById('username');       // reference to username inside form
const saveScoreBtn = document.getElementById('saveScoreBtn');      // referenece to saveScoreBtn
const finalScore = document.getElementById('finalScore');

const mostRecentScore = localStorage.getItem('mostRecentScore');

//8. Save High Scores in Local Storage
const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

const MAX_HIGH_SCORES = 5;
// console.log(highScores);

finalScore.innerText = mostRecentScore;

username.addEventListener('keyup' , ()=> {
    // console.log(username.value);
    saveScoreBtn.disabled = !username.value;
})


saveHighScore = (e) =>{
    e.preventDefault();
    // console.log('Clicked the save Button');

    const score = {
        score: mostRecentScore,
        // score: Math.floor(Math.random()*100),
        name: username.value,
    };
    highScores.push(score);
    highScores.sort((a, b) => b.score - a.score);
    // highScores.sort((a,b)=>{
    //     return b.score - a.score;
    // })

    highScores.splice(5);          // after 5th index cut off every thing

    localStorage.setItem('highScores', JSON.stringify(highScores));
    window.location.assign('./');

    // console.log(highScores);
    // console.log(score);
};