//Model


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

    // Metodos públicos
    return {
        init: function(){

            //carga de event listeners
            loadEventListeners();

        }
    }

})(UI);

//Inicializar app
App.init();