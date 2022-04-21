

//Storage
const Storage= (function(){
    return {
        getQuestions : async function(){
            let res = await fetch('questions.json');
            let questions = await res.json();
            return questions;
        }
    }
})();

//Model
const TriviaModel = (function(){

    //Constructor de pregunta
    const Question = function(){

    }

    //Constructor de usuario
    const User = function(name, points){
        this.name = name;
        this.points = points;
    }

    //persistencia de datos
    const data = {
        questions : [],
        users : [],
        currentQuestion : {},
        currentUser: {}
    }

    return {
        setQuestions : function(questions){
            data.questions = questions;
        },

        getQuestions: function(){
            return data.questions;
        },

        setCurrentQuestion(question){
            data.currentQuestion = question;
        },

        getCurrentQuestion(){
            return data.currentQuestion;
        },
        createUser(){

        },

        getRandomQuestion: function(category){
            let catQuestions = data.questions.filter(q => q.category == category);
            const random = Math.floor(Math.random() * catQuestions.length);
            const randomQuestion = catQuestions[random];
            data.currentQuestion = randomQuestion;
            return randomQuestion;
        }
    }

})();

//View
const UI = (function(){
    const UISelectors = {
         //Botones de Menu
         playBtn : '#playBtn',
         rankingBtn: '#rankingBtn',
         configurationBtn: '#configurationBtn',

         //Boton de pantalla de usuario
         playUserBtn: '#playUserBtn',

         //Botón de trivia
         exitTriviaBtn: '#exitTriviaBtn',

         //Botón volver a menu desde finalización de trivia
         backEndGameBtn : '#backEndGameBtn',

         //Botón colcer a menu desde ranking
         backRankingBtn : '#backRankingBtn',

         //Botones de configuración
         sendBtn: '#sendBtn',
         backConfigurationBtn: '#backConfigurationBtn',

         //label pregunta
         triviaQuestion: '#trivia__question',

         //div respuestas
         triviaAnswers: '#trivia__answers--id',

         //btn respuestas
         selectAnswerZero: '#rta0',
         selectAnswerOne: '#rta1',
         selectAnswerTwo: '#rta2',
         selectAnswerThree: '#rta3',

    }

    //respuesta en posiciones random
    const shuffleAnswers = function(answers){
        for (let i = answers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = answers[i];
            answers[i] = answers[j];
            answers[j] = temp;
          }
      
          return answers;
    }

    //Metodos públicos
    return {

        getSelectors: function(){
            return UISelectors;
        },

        switchScreen: function(screenToHide, screenToShow){
            //ocultar pantalla
            document.querySelector(`#${screenToHide}`).classList.remove('showScreen');
            document.querySelector(`#${screenToHide}`).classList.add('hideScreen');
            //mostrar pantalla
            document.querySelector(`#${screenToShow}`).classList.remove('hideScreen');
            document.querySelector(`#${screenToShow}`).classList.add('showScreen');

        },

        showQuestion : function(questionObject){
            let html = '';
            //pintar pregunta
            let questionLabel = document.querySelector(UISelectors.triviaQuestion);
            questionLabel.textContent = questionObject.question;

            //obtener respuestas
            const {question, category, ...answers} = questionObject;

            //ordenar respuestas de manera aleatoria
            let answersArray = [];
            for (const key in answers) {
                answersArray.push(answers[key]);
            }
            answersArray = shuffleAnswers(answersArray);
            
            //pintar opciones de respuesta
            answersArray.forEach((answer,index) => html+= `<input id="rta${index}" class="trivia__answer" type="button" value="${answer}">`);
            document.querySelector(UISelectors.triviaAnswers).innerHTML = html;
     
        }
    }

})();

//App Contoller
const App = (function(UI){

    //cargar event listeners
    const loadEventListeners = function(){
        const UISelectors = UI.getSelectors();

        //cambiar pantalla
        document.querySelector(UISelectors.playBtn).addEventListener('click', switchScreen);
        document.querySelector(UISelectors.rankingBtn).addEventListener('click', switchScreen);
        document.querySelector(UISelectors.configurationBtn).addEventListener('click', switchScreen);
        document.querySelector(UISelectors.playUserBtn).addEventListener('click', switchScreen);
        document.querySelector(UISelectors.exitTriviaBtn).addEventListener('click', switchScreen);
        document.querySelector(UISelectors.sendBtn).addEventListener('click', switchScreen);

        //volver a menu
        document.querySelector(UISelectors.backEndGameBtn).addEventListener('click', switchScreen);
        document.querySelector(UISelectors.backRankingBtn).addEventListener('click', switchScreen);
        document.querySelector(UISelectors.backConfigurationBtn).addEventListener('click', switchScreen);

        //selección de respuesta
        document.querySelector(UISelectors.selectAnswerZero).addEventListener('click', answerSelected);
        document.querySelector(UISelectors.selectAnswerOne).addEventListener('click', answerSelected);
        document.querySelector(UISelectors.selectAnswerTwo).addEventListener('click', answerSelected);
        document.querySelector(UISelectors.selectAnswerThree).addEventListener('click', answerSelected);
        
    }

    const loadQuestion = function(){
        let question = TriviaModel.getRandomQuestion('Facil');

        //Mostrar pregunta y respuestas en pantalla
        UI.showQuestion(question);
    }

    //selección de respuesta
    const answerSelected = function(e){
        let currentQuestion = TriviaModel.getCurrentQuestion();
        let answer = e.target.value;
        //revisa si respondio correctamente o no
        if(answer == currentQuestion.rv){
            const category = currentQuestion.category;
            showNewQuestion(category);
        }else{
            endGame();
        }
        loadEventListeners();
    }

    //mostrar pregunta dependiendo la categoria
    const showNewQuestion = function(category){
        console.log(category)
        let question;
        switch (category) {
            case 'Facil':
                question = TriviaModel.getRandomQuestion('Medio');
                UI.showQuestion(question);
            case 'Medio':
                question = TriviaModel.getRandomQuestion('Dificil');
                UI.showQuestion(question);
                break;
            case 'Dificil':
                question = TriviaModel.getRandomQuestion('Muy dificil');
                UI.showQuestion(question);
                break;
            case 'Muy dificil':
                question = TriviaModel.getRandomQuestion('Legendario');
                UI.showQuestion(question);
                break;
            case 'Legendario':
                endGame();
                break;
        }
    }

    //finalización de juego
    const endGame = function(){
        UI.switchScreen('trivia','end-game');
    };

    //cambio entre ventanas
    const switchScreen = function(e){
        const btnPressed = e.target.id;
        switch(btnPressed){

            //opciones de menu
            case 'playBtn':
                UI.switchScreen('menu','new-player');
                break;
            case 'rankingBtn':
                UI.switchScreen('menu','ranking');
                break;
            case 'configurationBtn':
                UI.switchScreen('menu','add-question');
                break;

            //opción de pantalla de usuario
            case 'playUserBtn':
                UI.switchScreen('new-player', 'trivia');
                break;

            //botón de trivia
            case 'exitTriviaBtn':
                UI.switchScreen('trivia', 'end-game');
                break;

            //botones de configuración
            case 'sendBtn':
                UI.switchScreen('add-question', 'menu');
                break;

            //volver a menu
            case 'backEndGameBtn':
                UI.switchScreen('end-game','menu');
                break;
            case 'backRankingBtn':
                UI.switchScreen('ranking','menu');
                break;
            case'backConfigurationBtn':
                UI.switchScreen('add-question','menu');
                break;
        }
    }

    //cargar preguntas en modelo
    const initQuestions = async function(){
       let questions = await Storage.getQuestions();
       TriviaModel.setQuestions(questions);
    }

    // Metodos públicos
    return {
        init: async function(){
            
            //cargar en modelo
            await initQuestions();

            //añadir primera pregunta a pantalla de trivia
            loadQuestion();

            //carga de event listeners
            loadEventListeners();

        }
    }

})(UI, TriviaModel);

//Inicializar app
App.init();