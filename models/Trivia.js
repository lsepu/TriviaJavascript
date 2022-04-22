const TriviaModel = (function () {
  const Question = function (question, r1, r2, r3, rv, category) {
    this.question = question;
    this.r1 = r1;
    this.r2 = r2;
    this.r3 = r3;
    this.rv = rv;
    this.category = category;
  };

  const User = function (name, points) {
    this.userName = name;
    this.points = points;
  };

  //persistencia de datos
  const data = {
    questions: [],
    users: [],
    currentQuestion: {},
    currentUser: {},
  };

  return {
    setQuestions: function (questions) {
      data.questions = questions;
    },
    setUsers: function (users) {
      data.users = users;
    },
    getQuestions: function () {
      return data.questions;
    },
    getUsers: function () {
      return data.users;
    },
    addPoint: function () {
      data.currentUser.points = data.currentUser.points + 15;
    },
    getPoints: function () {
      return data.currentUser.points;
    },
    addUser: function (userName, points) {
      const user = new User(userName, points);
      data.users.push(user);
      return user;
    },
    addQuestion: function (question, r1, r2, r3, rv, category) {
      const newQuestion = new Question(question, r1, r2, r3, rv, category);
      data.questions.push(newQuestion);
    },
    updateUserPoints: function (points) {
      console.log("Se actualizan los Puntos del Jugador o Usuario")
      //obtener usuario del array de usuario
      let foundUserIndex = data.users.findIndex(
        (user) => user == data.currentUser
      );

      //actualizar puntos de usuario
      data.users[foundUserIndex].points = points;
    },
    setCurrentQuestion(question) {
      data.currentQuestion = question;
    },
    setCurrentUser(user) {
      data.currentUser = user;
    },
    getCurrentQuestion() {
      return data.currentQuestion;
    },
    getRandomQuestion: function (category) {
      console.log("Se obtiene una Pregunta al Azar")
      let catQuestions = data.questions.filter((q) => q.category == category);
      const random = Math.floor(Math.random() * catQuestions.length);
      const randomQuestion = catQuestions[random];
      data.currentQuestion = randomQuestion;
      return randomQuestion;
    },
    getRanking: function () {
      let sortUsers = data.users.sort(function (userOne, userTwo) {
        if (userOne.points < userTwo.points) {
          return 1;
        }
        if (userOne.points > userTwo.pointse) {
          return -1;
        }
        return 0;
      });
      //obtener 3 primeros
      console.log("Se optiene el Top 3 de los Jugadores")
      let topUsers = sortUsers.slice(0, 3);
      return topUsers;
    },
  };
})();

export default TriviaModel;
