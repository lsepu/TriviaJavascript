

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
        users : []
    }

    return {
        setQuestions : function(questions){
            data.questions = questions;
        },

        getQuestions: function(){
            return data.questions;
        },

        getRandomQuestion: function(category){
            let catQuestions = data.questions.filter(q => q.category == category);
            const random = Math.floor(Math.random() * catQuestions.length);
            return catQuestions[random];
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
    }

})();

//App Contoller
const App = (function(UI){

    //cargar event listeners
    const loadEventListeners = function(){
        const UISelectors = UI.getSelectors();

        //cambiar pantalla
        document.querySelector(UISelectors.playBtn).addEventListener('click', playGame);
        document.querySelector(UISelectors.rankingBtn).addEventListener('click', switchScreen);
        document.querySelector(UISelectors.configurationBtn).addEventListener('click', switchScreen);
        document.querySelector(UISelectors.playUserBtn).addEventListener('click', switchScreen);
        document.querySelector(UISelectors.exitTriviaBtn).addEventListener('click', switchScreen);
        document.querySelector(UISelectors.sendBtn).addEventListener('click', switchScreen);

        //volver a menu
        document.querySelector(UISelectors.backEndGameBtn).addEventListener('click', switchScreen);
        document.querySelector(UISelectors.backRankingBtn).addEventListener('click', switchScreen);
        document.querySelector(UISelectors.backConfigurationBtn).addEventListener('click', switchScreen);
    }

    //Comenzar juego
    const playGame = function(e){
        //mostrar pregunta facíl inicial
        let question = TriviaModel.getRandomQuestion('Facil');
        console.log(question);

        switchScreen(e);
    }

    //selección de respuesta
    const answerSelected = function(e){

    }

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

            //carga de event listeners
            loadEventListeners();

        }
    }

})(UI, TriviaModel);

//Inicializar app
App.init();