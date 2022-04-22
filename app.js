

//Storage
//fetch de datos de json de preguntas y usuarios
const Storage= (function(){
    return {
        getQuestions : async function(){
            let res = await fetch('questions.json');
            let questions = await res.json();
            return questions;
        },
        getUsers : async function(){
            let res = await fetch('users.json');
            let users = await res.json();
            return users;
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
        setUsers : function(users){
            data.users = users
        },

        getQuestions: function(){
            return data.questions;
        },
        getUsers: function(){
            return data.users
        },
        addPoint : function(){
            data.currentUser.points = data.currentUser.points + 15;
        },
        getPoints : function(){
            return data.currentUser.points
        },
        addUser: function(userName, points){
            const user = new User(userName, points);
            data.users.push(user);
            return user;
        },
        updateUserPoints: function(points){

            //obtener usuario del array de usuario
            let foundUserIndex = data.users.findIndex(user => user == data.currentUser);

            //actualizar puntos de usuario
            data.users[foundUserIndex].points = points;
        },
        setCurrentQuestion(question){
            data.currentQuestion = question;
        },
        setCurrentUser(user){
            data.currentUser = user;
        },
        getCurrentQuestion(){
            return data.currentQuestion;
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

         //Botón volver a menu desde ranking
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

         userInput: '#user-name',
         currentPointsLabel : '#trivia__points',
         totalPointsLabel : '#trivia__total'
         

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
        showTotalPoints : function(points){

            //mostrar puntos en la pantalla de finalización
            let totalPoints = document.querySelector(UISelectors.totalPointsLabel);
            totalPoints.textContent = `Total de puntos: ${points} puntos`

        },

        showQuestion : function(questionObject, points){
            let html = '';
            //pintar pregunta
            let questionLabel = document.querySelector(UISelectors.triviaQuestion);
            questionLabel.textContent = questionObject.question;

            //pintar puntos
            let currentPointsLabel = document.querySelector(UISelectors.currentPointsLabel);
            currentPointsLabel.textContent = points;

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

//App Controller
const App = (function(UI){

    //cargar event listeners
    const loadEventListeners = function(){
        const UISelectors = UI.getSelectors();
        document.querySelector(UISelectors.playBtn).addEventListener('click', switchScreen);
        document.querySelector(UISelectors.rankingBtn).addEventListener('click', switchScreen);
        document.querySelector(UISelectors.configurationBtn).addEventListener('click', switchScreen);
        document.querySelector(UISelectors.playUserBtn).addEventListener('click', userToPlay);
        document.querySelector(UISelectors.exitTriviaBtn).addEventListener('click', endGame);
        document.querySelector(UISelectors.sendBtn).addEventListener('click', switchScreen);
        document.querySelector(UISelectors.backEndGameBtn).addEventListener('click', switchScreen);
        document.querySelector(UISelectors.backRankingBtn).addEventListener('click', switchScreen);
        document.querySelector(UISelectors.backConfigurationBtn).addEventListener('click', switchScreen);
        //selección de respuesta
        document.querySelector(UISelectors.selectAnswerZero).addEventListener('click', answerSelected);
        document.querySelector(UISelectors.selectAnswerOne).addEventListener('click', answerSelected);
        document.querySelector(UISelectors.selectAnswerTwo).addEventListener('click', answerSelected);
        document.querySelector(UISelectors.selectAnswerThree).addEventListener('click', answerSelected);   
    }

    const loadInitialQuestion = function(){
        let question = TriviaModel.getRandomQuestion('Facil');
        //Mostrar pregunta y respuestas en pantalla
        UI.showQuestion(question, 0);
    }

    //agregar nuevo usuario o actualizar puntos de usuario existente
    const userToPlay = function(){
        const userInput = document.querySelector(UI.getSelectors().userInput);
        const userName = userInput.value;
        //se crea el nuevo objeto usuario con params: username, points
        const user = TriviaModel.addUser(userName, 0);
        TriviaModel.setCurrentUser(user);
        //limpiar input
        userInput.value = '';
        UI.switchScreen('new-player', 'trivia');
    }

    //selección de respuesta
    const answerSelected = function(e){
        let currentQuestion = TriviaModel.getCurrentQuestion();
        let answer = e.target.value;
        //revisa si respondio correctamente o no
        if(answer == currentQuestion.rv){
            TriviaModel.addPoint();
            const category = currentQuestion.category;
            showNewQuestion(category);
        }else{
            endGame();
        }
    }

    //mostrar pregunta dependiendo la categoria
    const showNewQuestion = function(category){
        let question = '';
        let userPoints = TriviaModel.getPoints();
        switch (category) {
            case 'Facil':
                question = TriviaModel.getRandomQuestion('Medio');
                UI.showQuestion(question, userPoints);
                break;
            case 'Medio':
                question = TriviaModel.getRandomQuestion('Dificil');
                UI.showQuestion(question, userPoints);
                break;
            case 'Dificil':
                question = TriviaModel.getRandomQuestion('Muy dificil');
                UI.showQuestion(question, userPoints);
                break;
            case 'Muy dificil':
                question = TriviaModel.getRandomQuestion('Legendario');
                UI.showQuestion(question, userPoints);
                break;
            case 'Legendario':
                endGame();
                break;
        }
        loadEventListeners();
    }

    //finalización de juego
    const endGame = function(){
        let points = TriviaModel.getPoints();
        //actualizar puntos de usuario en modelo
        TriviaModel.updateUserPoints(points)
        //reiniciar nivel a facil
        loadInitialQuestion();
        //mostrar puntos totales
        UI.showTotalPoints(points);
        UI.switchScreen('trivia','end-game');
        loadEventListeners();
    };

    //cambio entre ventanas
    const switchScreen = function(e){
        const btnPressed = e.target.id;
        switch(btnPressed){
            case 'playBtn':
                UI.switchScreen('menu','new-player');
                break;
            case 'rankingBtn':
                UI.switchScreen('menu','ranking');
                break;
            case 'configurationBtn':
                UI.switchScreen('menu','add-question');
                break;
            case 'playUserBtn':
                UI.switchScreen('new-player', 'trivia');
                break;
            case 'exitTriviaBtn':
                UI.switchScreen('trivia', 'end-game');
                break;
            case 'sendBtn':
                UI.switchScreen('add-question', 'menu');
                break;
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
    const initInformation = async function(){
       let questions = await Storage.getQuestions();
       let users = await Storage.getUsers();
       TriviaModel.setQuestions(questions);
       TriviaModel.setUsers(users);
    }

    return {
        init: async function(){
            //cargar en modelo
            await initInformation();
            //añadir primera pregunta a pantalla de trivia
            loadInitialQuestion();
            //carga de event listeners
            loadEventListeners();

        }
    }

})(UI, TriviaModel);

//Inicializar app
App.init();