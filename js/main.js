// Select Element
let countSpan = document.querySelector('.count span');
let bullets = document.querySelector(".bullets .spans");
let bulletsElement = document.querySelector(".bullets");
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answers-area");
let submitButton =document.querySelector(".submit-button");
let labels = document.querySelectorAll(".answer label");
let results = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

function getQuestions(){
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function () {
        if(this.readyState === 4 && this.status === 200){
            let questionObjet = JSON.parse(this.responseText);
            let questionsCount = questionObjet.length;
            
            createBullets(questionsCount); 
            
            addQuestionData(questionObjet[currentIndex] , questionsCount);
            
            countdown(5 , questionsCount);
            submitButton.onclick = () => {
                let theRightAnswer =  questionObjet[currentIndex].right_answer;
                currentIndex++;

                checkAnswer(theRightAnswer , questionsCount);

                // Remove Previous Question
                quizArea.innerHTML = "";
                answerArea.innerHTML = "";


                addQuestionData(questionObjet[currentIndex] , questionsCount);
            
                handleBullets();

                clearInterval(countdownInterval);
                countdown(5 , questionsCount);


                showResult(questionsCount);
        }
        }
    }
    myRequest.open("GET" , "questions.json", true);
    myRequest.send();
}

getQuestions();

function createBullets(num){
    countSpan.innerHTML = num;

    for(let i = 0 ; i < num ; i++){
        let theBullets = document.createElement("span");
        if(i===0){
            theBullets.className = "on";
        }
        
        bullets.appendChild(theBullets);
    }
}

function addQuestionData(obj , count){
   if(currentIndex < count){
     let questionTilte = document.createElement("h2");

    let questionText = document.createTextNode(obj.title)

    questionTilte.appendChild(questionText);

    quizArea.appendChild(questionTilte);

    for(let i = 1 ; i <= 4 ; i++){
        let mainDiv = document.createElement("div");

        mainDiv.className = 'answer';

        let radioInput = document.createElement("input");
        radioInput.type = 'radio';
        radioInput.name = 'question';
        radioInput.id = `answer-${i}`;
        radioInput.dataset.answer = obj[`answer-${i}`];

        if(i === 1) {
            radioInput.checked = true;
        }
    
    
        let theLabel = document.createElement("label");

        theLabel.htmlFor = `answer-${i}`;

        let theLabelText = document.createTextNode(obj[`answer-${i}`]);

        theLabel.appendChild(theLabelText);

        mainDiv.appendChild(radioInput);
        mainDiv.appendChild(theLabel);
        answerArea.appendChild(mainDiv);
    }
   } 
   
}

function checkAnswer(rAnswer , count){
    let answers = document.getElementsByName("question");
    let theChoosenAnswer;

    for(let i = 0 ; i < answers.length ; i++){
        if(answers[i].checked){
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }
    if (rAnswer === theChoosenAnswer){
        console.log(rAnswer);
        console.log(theChoosenAnswer);
        rightAnswers++;
        console.log(rightAnswers);
    }
}

function handleBullets(){
    let bulletsSpan = document.querySelectorAll(".bullets .spans span");

    let arrayOfSpan = Array.from(bulletsSpan);

    arrayOfSpan.forEach((span , index) => {

        if(currentIndex === index){
            span.className = "on";
        }
    })
}

function showResult(count){
    let theResults;
    if(currentIndex === count){
        quizArea.remove();
        answerArea.remove();
        submitButton.remove();
        bulletsElement.remove();

        if(rightAnswers > (count / 2) && rightAnswers < count){
            theResults = `<span class = "good">Good</span> , You Answered ${rightAnswers} From ${count} `;
        }else if(rightAnswers === count){
            theResults = `<span class = "perfect">Perfect</span> , You Answered ${rightAnswers} From ${count} ` ; 
        }else{
            theResults = `<span class = "bad">Bad</span> , You Answered ${rightAnswers} From ${count} `  ;
        }
        results.innerHTML = theResults;

    }
}

function countdown (duration , count){
    if(currentIndex < count){
        let minutes , seconds;
        countdownInterval = setInterval(function () {
            minutes = parseInt(duration / 60);
            seconds = parseInt (duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            countdownElement.innerHTML = `${minutes}:${seconds}`;
            
            
            if(--duration < 0){
                clearInterval (countdownInterval);
                submitButton.click();
            }
            
        } , 1000)
    }
}