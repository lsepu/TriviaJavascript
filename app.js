

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
    const Question = function(question, r1, r2, r3, rv, category){
        this.question = question;
        this.r1 = r1;
        this.r2 = r2;
        this.r3 = r3;
        this.rv = rv;
        this.category = category;
    }

    //Constructor de usuario
    const User = function(name, points){
        this.userName = name;
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
        addQuestion: function(question, r1, r2, r3, rv, category){
            const newQuestion = new Question(question,r1,r2,r3,rv,category);
            data.questions.push(newQuestion);
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
        },
        getRanking: function(){

            let sortUsers = data.users.sort(function(userOne, userTwo){
                if (userOne.points < userTwo.points) {
                    return 1;
                }
                if (userOne.points > userTwo.pointse) {
                    return -1;
                }
                return 0;
            })
            //obtener 3 primeros
            let topUsers = sortUsers.slice(0, 3);
            return topUsers;

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

         //div ranking
         triviaRanking: '#trivia__ranking',

         //btn respuestas
         selectAnswerZero: '#rta0',
         selectAnswerOne: '#rta1',
         selectAnswerTwo: '#rta2',
         selectAnswerThree: '#rta3',

         userInput: '#user-name',
         currentPointsLabel : '#trivia__points',
         totalPointsLabel : '#trivia__total',

         //inputs creación de pregunta
         newQuestion: '#configuration__question',
         correctAnswer: '#configuration__correct-answer',
         newAnswerOne: '#configuration__answer1',
         newAnswerTwo: '#configuration__answer2',
         newAnswerThree: '#configuration__answer3'
         

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
     
        },
        showRanking : function(topUsers){
            let html = "";
            //pintar top 3 de usuarios en html
            topUsers.forEach(user => html+=`<p class="trivia__person" >${user.userName} : ${user.points} puntos</p>`);
            document.querySelector(UISelectors.triviaRanking).innerHTML = html;
        }
    }

})();

//App Controller
const App = (function(UI){

    //cargar event listeners
    const loadEventListeners = function(){
        const UISelectors = UI.getSelectors();
        document.querySelector(UISelectors.playBtn).addEventListener('click', switchScreen);
        document.querySelector(UISelectors.rankingBtn).addEventListener('click', ranking);
        document.querySelector(UISelectors.configurationBtn).addEventListener('click', switchScreen);
        document.querySelector(UISelectors.playUserBtn).addEventListener('click', userToPlay);
        document.querySelector(UISelectors.exitTriviaBtn).addEventListener('click', endGame);
        document.querySelector(UISelectors.sendBtn).addEventListener('click', createQuestion);
        document.querySelector(UISelectors.backEndGameBtn).addEventListener('click', switchScreen);
        document.querySelector(UISelectors.backRankingBtn).addEventListener('click', switchScreen);
        document.querySelector(UISelectors.backConfigurationBtn).addEventListener('click', switchScreen);
        //selección de respuesta
        document.querySelector(UISelectors.selectAnswerZero).addEventListener('click', answerSelected);
        document.querySelector(UISelectors.selectAnswerOne).addEventListener('click', answerSelected);
        document.querySelector(UISelectors.selectAnswerTwo).addEventListener('click', answerSelected);
        document.querySelector(UISelectors.selectAnswerThree).addEventListener('click', answerSelected);   
    }

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

    //crear nueva pregunta
    const createQuestion = function(){
        let question = document.querySelector(UI.getSelectors().newQuestion);
        let r1 = document.querySelector(UI.getSelectors().newAnswerOne);
        let r2 = document.querySelector(UI.getSelectors().newAnswerTwo);
        let r3 = document.querySelector(UI.getSelectors().newAnswerThree);
        let rc = document.querySelector(UI.getSelectors().correctAnswer);
        let category = 'Facil';

        TriviaModel.addQuestion(question.value ,r1.value ,r2.value ,r3.value ,rc.value ,category);
        question.value ="";
        r1.value = "";
        r2.value = "";
        r3.value = "";
        rc.value = "";
        console.log(TriviaModel.getQuestions());
        UI.switchScreen('add-question','menu')
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

    //ranking de usuarios
    const ranking = function(){
        const topThree = TriviaModel.getRanking();
        UI.showRanking(topThree);
        UI.switchScreen('menu','ranking');
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