import UI from "./views/View.js";
import TriviaModel from "./models/Trivia.js";

//fetch de datos de json de preguntas y usuarios
const Storage = (function () {
  return {
    getQuestions: async function () {
      let res = await fetch("data/questions.json");
      let questions = await res.json();
      return questions;
    },
    getUsers: async function () {
      let res = await fetch("data/users.json");
      let users = await res.json();
      return users;
    },
  };
})();

//App Controller
const App = (function (UI) {
  //cargar event listeners
  const loadEventListeners = function () {
    const UISelectors = UI.getSelectors();
    document
      .querySelector(UISelectors.playBtn)
      .addEventListener("click", switchScreen);
    document
      .querySelector(UISelectors.rankingBtn)
      .addEventListener("click", ranking);
    document
      .querySelector(UISelectors.configurationBtn)
      .addEventListener("click", switchScreen);
    document
      .querySelector(UISelectors.playUserBtn)
      .addEventListener("click", userToPlay);
    document
      .querySelector(UISelectors.exitTriviaBtn)
      .addEventListener("click", endGame);
    document
      .querySelector(UISelectors.sendBtn)
      .addEventListener("click", createQuestion);
    document
      .querySelector(UISelectors.backEndGameBtn)
      .addEventListener("click", switchScreen);
    document
      .querySelector(UISelectors.backRankingBtn)
      .addEventListener("click", switchScreen);
    document
      .querySelector(UISelectors.backConfigurationBtn)
      .addEventListener("click", switchScreen);
    //selección de respuesta
    document
      .querySelector(UISelectors.selectAnswerZero)
      .addEventListener("click", answerSelected);
    document
      .querySelector(UISelectors.selectAnswerOne)
      .addEventListener("click", answerSelected);
    document
      .querySelector(UISelectors.selectAnswerTwo)
      .addEventListener("click", answerSelected);
    document
      .querySelector(UISelectors.selectAnswerThree)
      .addEventListener("click", answerSelected);
  };

  //cambio entre ventanas
  const switchScreen = function (e) {
    const btnPressed = e.target.id;
    switch (btnPressed) {
      case "playBtn":
        UI.switchScreen("menu", "new-player");
        break;
      case "rankingBtn":
        UI.switchScreen("menu", "ranking");
        break;
      case "configurationBtn":
        UI.switchScreen("menu", "add-question");
        break;
      case "playUserBtn":
        UI.switchScreen("new-player", "trivia");
        break;
      case "exitTriviaBtn":
        UI.switchScreen("trivia", "end-game");
        break;
      case "sendBtn":
        UI.switchScreen("add-question", "menu");
        break;
      case "backEndGameBtn":
        UI.switchScreen("end-game", "menu");
        break;
      case "backRankingBtn":
        UI.switchScreen("ranking", "menu");
        break;
      case "backConfigurationBtn":
        UI.switchScreen("add-question", "menu");
        break;
    }
  };

  //crear nueva pregunta
  const createQuestion = function () {
    const UISelectors = UI.getSelectors();
    //obtengo la nueva pregunta de la UI
    const newQuestionInfo = UI.getNewQuestionInputs();
    const [question, r1, r2, r3, rv, category] = newQuestionInfo;

    //Creación de pregunta en modelo
    TriviaModel.addQuestion(
      question.value,
      r1.value,
      r2.value,
      r3.value,
      rv.value,
      category.value
    );
    //limpiar inputs
    UI.clearNewQuestionInputs();

    UI.switchScreen("add-question", "menu");
    alert("Pregunta agregada satisfactoriamente");

    //POR MOTIVOS DE DEMOSTRACIÓN, mostrar array de preguntas
    console.log(TriviaModel.getQuestions());
  };

  //agregar nuevo usuario o actualizar puntos de usuario existente
  const userToPlay = function () {
    console.log('Crear usuario e iniciar nueva partida');
    const userInput = document.querySelector(UI.getSelectors().userInput);
    const userName = userInput.value;
    //se crea el nuevo objeto usuario con params: username, points
    const user = TriviaModel.addUser(userName, 0);
    TriviaModel.setCurrentUser(user);
    
    //limpiar input
    UI.clearUserInput();

    showNewQuestion("Iniciar");
    UI.switchScreen("new-player", "trivia");
  };

  //selección de respuesta
  const answerSelected = function (e) {
    console.log('Respuesta seleccionada');
    let currentQuestion = TriviaModel.getCurrentQuestion();
    let answer = e.target.value;
    //revisa si respondio correctamente o no
    if (answer == currentQuestion.rv) {
      TriviaModel.addPoint();
      const category = currentQuestion.category;
      showNewQuestion(category);
    } else {
      endGame();
    }
  };

  //ranking de usuarios
  const ranking = function () {
    const topThree = TriviaModel.getRanking();
    UI.showRanking(topThree);
    UI.switchScreen("menu", "ranking");
  };

  /*  const loadInitialQuestion = function () {
    let question = TriviaModel.getRandomQuestion("Facil");
    //Mostrar pregunta y respuestas en pantalla
    UI.showQuestion(question, 0);
    loadEventListeners();
  }; */

  //mostrar pregunta dependiendo la categoria
  const showNewQuestion = function (category) {
    let question = "";
    let userPoints = TriviaModel.getPoints();
    switch (category) {
      case "Iniciar":
        question = TriviaModel.getRandomQuestion("Facil");
        UI.showQuestion(question, 0);
        break;
      case "Facil":
        question = TriviaModel.getRandomQuestion("Medio");
        UI.showQuestion(question, userPoints);
        break;
      case "Medio":
        question = TriviaModel.getRandomQuestion("Dificil");
        UI.showQuestion(question, userPoints);
        break;
      case "Dificil":
        question = TriviaModel.getRandomQuestion("Muy dificil");
        UI.showQuestion(question, userPoints);
        break;
      case "Muy dificil":
        question = TriviaModel.getRandomQuestion("Legendario");
        UI.showQuestion(question, userPoints);
        break;
      case "Legendario":
        endGame();
        break;
    }
    loadEventListeners();
  };

  //finalización de juego
  const endGame = function () {
    let points = TriviaModel.getPoints();
    //actualizar puntos de usuario en modelo
    TriviaModel.updateUserPoints(points);
    //mostrar puntos totales
    UI.showTotalPoints(points);
    UI.switchScreen("trivia", "end-game");
    loadEventListeners();
  };

  //cargar preguntas en modelo
  const initInformation = async function () {
    let questions = await Storage.getQuestions();
    let users = await Storage.getUsers();
    TriviaModel.setQuestions(questions);
    TriviaModel.setUsers(users);
  };

  return {
    init: async function () {
      UI.clearUserInput();
      //cargar en modelo
      await initInformation();
      //carga de event listeners
      loadEventListeners();
    },
  };
})(UI, TriviaModel);

//Inicializar app
App.init();
