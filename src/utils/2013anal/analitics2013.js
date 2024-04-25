const games = require("../../../games2013.json");

function analitics2013() {
  let goalsHome = 0;
  let goalsOut = 0;

  let winHome = 0;
  let lostHome = 0;

  let noGoalHome = 0;
  let noGoalOut = 0;
  let firstYear = 2024;

  let moreThan1GoalHome = 0;
  let moreThan1GoalOut = 0;
  const numberGoals = 1;
  let matches = 0;

  for (const game of games.filter((val) => val.year >= 2019)) {
    const [home, out] = game.match.replace("(-)", "").split(" x ");

    const homeGoal = parseInt(home);
    const outGoal = parseInt(out);

    if (homeGoal > outGoal) winHome++;
    if (homeGoal < outGoal) lostHome++;

    if (homeGoal > numberGoals) moreThan1GoalHome++;
    if (outGoal > numberGoals) moreThan1GoalOut++;

    if (!homeGoal) noGoalOut++;
    if (!outGoal) noGoalHome++;

    goalsHome += homeGoal;
    goalsOut += outGoal;

    if (firstYear > game.year) firstYear = game.year;

    matches++;
  }

  console.log(
    `Gols em casa é ${(((goalsHome - goalsOut) / goalsHome) * 100).toFixed(
      2
    )}% maior que fora em ${2024 - firstYear} anos`
  );
  console.log("------------------------------------");
  console.log(
    `Sem sofrer gols é ${(
      ((noGoalHome - noGoalOut) / noGoalHome) *
      100
    ).toFixed(2)}% maior em casa que fora em ${2024 - firstYear} anos`
  );
  console.log("------------------------------------");
  console.log(
    `Mais de ${numberGoals} gols é ${(
      ((moreThan1GoalHome - moreThan1GoalOut) / moreThan1GoalHome) *
      100
    ).toFixed(2)}% maior em casa que fora em ${2024 - firstYear} anos`
  );
  console.log("------------------------------------");
  console.log(
    `Ganhar é ${(((winHome - lostHome) / winHome) * 100).toFixed(
      2
    )}% maior em casa que fora em ${2024 - firstYear} anos`
  );
  console.log("------------------------------------");
  console.log(
    `Foram calculadas ${matches} partidas com ${goalsHome} para o time da casa e ${goalsOut} para o time de fora`
  );
  console.log("------------------------------------");
}

module.exports = { analitics2013 };
