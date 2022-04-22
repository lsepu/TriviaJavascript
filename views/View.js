const UI = (function () {
  const UISelectors = {
    playBtn: "#playBtn",
    rankingBtn: "#rankingBtn",
    configurationBtn: "#configurationBtn",
    playUserBtn: "#playUserBtn",
    exitTriviaBtn: "#exitTriviaBtn",
    backEndGameBtn: "#backEndGameBtn",
    backRankingBtn: "#backRankingBtn",
    sendBtn: "#sendBtn",
    backConfigurationBtn: "#backConfigurationBtn",
    triviaQuestion: "#trivia__question",
    triviaAnswers: "#trivia__answers--id",
    triviaRanking: "#trivia__ranking",
    selectAnswerZero: "#rta0",
    selectAnswerOne: "#rta1",
    selectAnswerTwo: "#rta2",
    selectAnswerThree: "#rta3",
    userInput: "#user-name",
    currentPointsLabel: "#trivia__points",
    totalPointsLabel: "#trivia__total",
    newQuestion: "#configuration__question",
    correctAnswer: "#configuration__correct-answer",
    newAnswerOne: "#configuration__answer1",
    newAnswerTwo: "#configuration__answer2",
    newAnswerThree: "#configuration__answer3",
    newQuestionCategory: "#trivia__categories"
  };

  //respuesta en posiciones random
  const shuffleAnswers = function (answers) {
    console.log("se ordenan las respuestas aleatoriamente")
    for (let i = answers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = answers[i];
      answers[i] = answers[j];
      answers[j] = temp;
    }
    return answers;
  };

  //Metodos públicos
  return {
    getSelectors: function () {
      return UISelectors;
    },

    switchScreen: function (screenToHide, screenToShow) {
      console.log("Se actualiza a la Vista")
      //ocultar pantalla
      document.querySelector(`#${screenToHide}`).classList.remove("showScreen");
      document.querySelector(`#${screenToHide}`).classList.add("hideScreen");
      //mostrar pantalla
      document.querySelector(`#${screenToShow}`).classList.remove("hideScreen");
      document.querySelector(`#${screenToShow}`).classList.add("showScreen");
    },

    showTotalPoints: function (points) {
      console.log("mostrar puntos en la pantalla de finalización")
      //mostrar puntos en la pantalla de finalización
      let totalPoints = document.querySelector(UISelectors.totalPointsLabel);
      totalPoints.textContent = `Total de puntos: ${points} puntos`;
    },

    showQuestion: function (questionObject, points) {
      console.log("muestra la pregunta que se debe responder ")
      let html = "";
      //pintar pregunta
      let questionLabel = document.querySelector(UISelectors.triviaQuestion);
      questionLabel.textContent = questionObject.question;
      //pintar puntos
      let currentPointsLabel = document.querySelector(
        UISelectors.currentPointsLabel
      );
      currentPointsLabel.textContent = points;
      //obtener respuestas
      const { question, category, ...answers } = questionObject;
      //ordenar respuestas de manera aleatoria
      let answersArray = [];
      for (const key in answers) {
        answersArray.push(answers[key]);
      }
      answersArray = shuffleAnswers(answersArray);
      //pintar opciones de respuesta
      answersArray.forEach(
        (answer, index) =>
          (html += `<input id="rta${index}" class="trivia__answer" type="button" value="${answer}">`)
      );
      document.querySelector(UISelectors.triviaAnswers).innerHTML = html;
      
    },

    showRanking: function (topUsers) {
      console.log("Se muestra la informacion del Ranking top 3")
      let html = "";
      //pintar top 3 de usuarios en html
      topUsers.forEach(
        (user) =>
          (html += `<p class="trivia__person" >${user.userName} : ${user.points} puntos</p>`)
      );
      document.querySelector(UISelectors.triviaRanking).innerHTML = html;
    },

    getNewQuestionInputs: function(){
      console.log("Se obtinen los datos de los inputs para crear una nueva pregunta")
        let question = document.querySelector(UISelectors.newQuestion);
        let r1 = document.querySelector(UISelectors.newAnswerOne);
        let r2 = document.querySelector(UISelectors.newAnswerTwo);
        let r3 = document.querySelector(UISelectors.newAnswerThree);
        let rv = document.querySelector(UISelectors.correctAnswer);
        let category = document.querySelector(UISelectors.newQuestionCategory);
        const newQuestionInfo = [question, r1, r2 ,r3, rv, category];
        return newQuestionInfo;
    },

    clearNewQuestionInputs: function(){
      console.log("Limpia los Imputs para una nueva Pregunta")
        document.querySelector(UISelectors.newQuestion).value="";
        document.querySelector(UISelectors.newAnswerOne).value="";
        document.querySelector(UISelectors.newAnswerTwo).value="";
        document.querySelector(UISelectors.newAnswerThree).value="";
        document.querySelector(UISelectors.correctAnswer).value="";
        document.querySelector(UISelectors.newQuestionCategory).value="Facil";
    },

    clearUserInput : function(){
        document.querySelector(UI.getSelectors().userInput).value = "";
    }

  };
})();

export default UI;
