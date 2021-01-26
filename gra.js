//Deklaracja potrzebnych zmiennych
var soundSetting = true;
var musicSetting = true;
var playerCounter = 2;
var playerNicknames = [];
var round = 1;
var pvalue = [];
var points = Array(4);
var playerNumber = 0;
var howManyPoints = 0;
var rankingPoints = Array(4);
var rankingNames = Array(4);
//Wyzerowanie punktów każdemu graczowi
points.fill(0,0,5);
var isCategoryUsed = Array(4);
for (let i = 0; i < 4; i++) {
  isCategoryUsed[i] = Array(13);
  isCategoryUsed[i].fill(true, 0, 13);
}
var throwCounter = 0;

//Przypisanie dźwięków do zmiennych.
var throws = new Audio("src/dice.wav");
var clicks = new Audio("src/click.wav");
var wins = new Audio("src/win.mp3");
var sons = new Audio("src/soundon.wav");
var awin = new Audio("https://takeb1nzyto.space/assets/music/Nyanyanyanyanyanyanya!%20-%20daniwell%20(Momone%20Momo%20UTAU%20Cover).mp3");
var backgroundMusic = new Audio('src/background.mp3');
awin.volume = 0.2;
backgroundMusic.volume = 0.2;
sons.volume = 0.5;
//Zapętlony dźwięk w tle
if (typeof backgroundMusic.loop == 'boolean')
{
  backgroundMusic.loop = true;
}
else
{
  backgroundMusic.addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
  }, false);
}
//Wyłączanie/Włączanie Dźwieków
function Sound() {
  if (soundSetting == false) {
    soundSetting = true;
    document.getElementById("sound").innerHTML = "<img src=\"src/s_on.png\" alt=\"\" />";
    throws.volume = 0.5;
    clicks.volume = 1;
    wins.volume = 1;
    sons.play()
  }
  else {
    soundSetting = false;
    document.getElementById("sound").innerHTML = "<img src=\"src/s_off.png\" alt=\"\" />";
    throws.volume = 0;
    clicks.volume = 0;
    wins.volume = 0;
  }
}
//Wyłączanie/Włączanie muzyki
function Music()
{
  if (musicSetting == false) {
    musicSetting = true;
    document.getElementById("music").innerHTML = "<img src =\"src/music.png\" alt=\"\" />";
    backgroundMusic.volume = 0.2;
    awin.volume = 0.2;
  }
  else{
    musicSetting = false;
  document.getElementById("music").innerHTML = "<img src =\"src/musicoff.png\" alt=\"\" />";
  awin.volume = 0;
  backgroundMusic.volume = 0;
  }
}
//Wyświetlanie aktualnego gracza
function Players(nr) {
  let text = "";
  playerCounter = (nr);
  for (let i = 0; i < [nr]; i++) {
    text += '<input type="text" maxlength="30" size="29" id="text' + i + '"" placeholder="Nazwa gracza ' + (i + 1) + '"><br>';
  }
  document.getElementById("players").innerHTML = text;
  document.getElementById("start").style.display = "inline";
}

//Wczytanie nicków + Odegranie animacji, Wywołanie rundy
function Start() {
  for (let i = 0; i < playerCounter; i++) {
    playerNicknames[i] = document.getElementById("text" + i + "").value;
    if (playerNicknames[i] == '') { playerNicknames[i] = "Gracz " + (i + 1) };
  }
  for (let i = 0; i < 5; i++) {
    pvalue[i] = 0;
  }
  document.getElementById("play").classList.toggle('animate__jackInTheBox');
  document.getElementById("play").classList.toggle('animate__zoomOut');
  setTimeout(() => { document.getElementById("play").style.display = "none"; document.getElementById("box2").style.display = "inline-block"; document.getElementById("box1").style.width = "79vw"; document.getElementById("box2").style.width = "20vw"; RoundStart(0); }, 400);
  Scoreboard();
  backgroundMusic.play();
}
//Tablica wyników
function Scoreboard()
{
  var result = SortRanking();
  let text="Tabela wyników: <ol>";
  for (let i = 0; i < playerCounter; i++) {
    text+='<li>'+playerNicknames[result[i]]+' - '+points[result[i]]+'</li>';
  }
  text+="</ol>";
  document.getElementById("box2").innerHTML = text;
}
//Rozpoczęcie rundy
function RoundStart() {
  document.getElementById("game").innerHTML = "Runda: " + round + "  Kolejka gracza: " + playerNicknames[[playerNumber]] + "<br><br>" + '<div id="dices"></div><div id="skip"></div>';
  document.getElementById("skip").innerHTML = '<p onclick="ThrowingDice(' + [playerNumber] + ')">Rzuć kośćmi</p>';
}

//Pominięcie ruchu
function SkipMyTurn() {
  throwCounter += 10;
  ThrowingDice([playerNumber]);
}

//Rzut kostką
function ThrowingDice() {
  let is = 0;
  if (throwCounter < 3) {
    let text = "";
    for (let i = 0; i < 5; i++) {
      text += '<img id="dice' + i + '" src="src/dice';
      if (pvalue[i] < 7) {
        pvalue[i] = Math.floor(Math.random() * 6 + 1);
        is++;
        text += pvalue[i] + '.png" alt="" onclick="Uclicks(' + i + ')">';
      } else {
        text += (pvalue[i] - 10) + '.png" alt="" class="click">';
      }
    }
    if (throwCounter == 0) {
      document.getElementById("skip").innerHTML += '<p onclick="SkipMyTurn()">Pomiń</p>';
    }
    if (is > 0) {
      throws.play();
      throwCounter++;
      document.getElementById("dices").innerHTML = text;

    }
    if (throwCounter >= 3) {
      ThrowingDice();
    }

    //Wyświetlanie kategorii
  } else if (throwCounter >= 3) {
    let stringArrayForCategory = ["Jedynki", "Dwójki", "Trójki", "Czwórki", "Piątki", "Szóstki", "3 jednakowe", "4 jednakowe", "Full", "Mały strit", "Duży strit", "Generał (Yahtzee)", "Szansa"];
    let text = "";
    howManyPoints = points [playerNumber];
    for (let i = 0; i < 13; i++) {
      text += '<p onclick="chooseCategory(' + i + ')"';
      if (isCategoryUsed[[playerNumber]][i] == false) { text += ' class="used"' }
      text += '>' + stringArrayForCategory[i] + '</p>';
      if (i == 5) { text += '<br>' }
    }
    document.getElementById("skip").innerHTML = text;
  }
}

//Zachowanie kości do gry
function Uclicks(nr) {
  document.getElementById("dice" + [nr]).classList.toggle("click");
  clicks.play();
  if (pvalue[[nr]] < 7) {
    pvalue[[nr]] += 10
  } else {
    pvalue[[nr]] -= 10
  }
}

//Wybór kategorii
function chooseCategory(nr) {
  switch (nr) {
    case 0:
      if (isCategoryUsed[[playerNumber]][[nr]] == true) { Calculate(1); isCategoryUsed[[playerNumber]][[nr]] = false; Reset(); }
      break;
    case 1:
      if (isCategoryUsed[[playerNumber]][[nr]] == true) { Calculate(2); isCategoryUsed[[playerNumber]][[nr]] = false; Reset(); }
      break;
    case 2:
      if (isCategoryUsed[[playerNumber]][[nr]] == true) { Calculate(3); isCategoryUsed[[playerNumber]][[nr]] = false; Reset(); }
      break;
    case 3:
      if (isCategoryUsed[[playerNumber]][[nr]] == true) { Calculate(4); isCategoryUsed[[playerNumber]][[nr]] = false; Reset(); }
      break;
    case 4:
      if (isCategoryUsed[[playerNumber]][[nr]] == true) { Calculate(5); isCategoryUsed[[playerNumber]][[nr]] = false; Reset(); }
      break;
    case 5:
      if (isCategoryUsed[[playerNumber]][[nr]] == true) { Calculate(6); isCategoryUsed[[playerNumber]][[nr]] = false; Reset(); }
      break;
    case 6:
      if (isCategoryUsed[[playerNumber]][[nr]] == true) { points[[playerNumber]] += Same(3); isCategoryUsed[[playerNumber]][[nr]] = false; Reset(); }
      break;
    case 7:
      if (isCategoryUsed[[playerNumber]][[nr]] == true) { points[[playerNumber]] += Same(4); isCategoryUsed[[playerNumber]][[nr]] = false; Reset(); }
      break;
    case 8:
      if (isCategoryUsed[[playerNumber]][[nr]] == true) { points[[playerNumber]] += Same(10); isCategoryUsed[[playerNumber]][[nr]] = false; Reset(); }
      break;
    case 9:
      if (isCategoryUsed[[playerNumber]][[nr]] == true) { points[[playerNumber]] += Strike(1, 3); isCategoryUsed[[playerNumber]][[nr]] = false; Reset(); }
      break;
    case 10:
      if (isCategoryUsed[[playerNumber]][[nr]] == true) { points[[playerNumber]] += Strike(1, 4); isCategoryUsed[[playerNumber]][[nr]] = false; Reset(); }
      break;
    case 11:
      if (isCategoryUsed[[playerNumber]][[nr]] == true) { points[[playerNumber]] += Strike(0, 4); isCategoryUsed[[playerNumber]][[nr]] = false; Reset(); }
      break;
    case 12:
      if (isCategoryUsed[[playerNumber]][[nr]] == true) { Decreasing();
                points[[playerNumber]] += pvalue.reduce((a, b) => a + b, 0); isCategoryUsed[[playerNumber]][[nr]] = false; Reset(); }
      break;

  }
}
//Sortowanie
function SortRanking()
{
  for (let i = 0; i < 4; i++) {
    rankingPoints[i] = points[i];
    rankingNames[i] = i;
  }
  for (let i = 3; i >= 0; i--) {
    for (let j = 3; j > 0; j--) {
      if (rankingPoints[j] > rankingPoints[j - 1]) {
        let tempPoints = rankingPoints[j];
        rankingPoints[j] = rankingPoints[j - 1];
        rankingPoints[j - 1] = tempPoints;
        let tempNames = rankingNames[j];
        rankingNames[j] = rankingNames[j - 1];
        rankingNames[j - 1] = tempNames;
      }
    }
  }
  return rankingNames;
}
//Sumowanie z górnej tabelki (1-6)
function Calculate(category) {
  Decreasing()
  for (let i = 0; i < 5; i++) {
    if (pvalue[i] == category) { points[playerNumber] += category; }
  }
}

//Zmniejszenie zaznaczonej wartości
function Decreasing() {
  for (let i = 0; i < 5; i++) {
    if (pvalue[i] > 7) { pvalue[i] -= 10; }
  }
}

//Zliczanie stritów i generała (Mały strit, Duży strit, Generał (Yahtzee))
function Strike(inc, expected) {
  let count = 0;
  Decreasing();
  for (let i = 0; i < 4; i++) {
    if ((pvalue[i] + inc) == pvalue[i + 1]) { count++; }
    else if (i != 0) { break; }
  }
  if (count >= expected) {
    if (expected == 4 && inc == 0) { return 50; }
    else if (expected == 4 && inc == 1) { return 40; }
    else if (expected == 3 && inc == 1) { return 30; }
  }
  else {
    return 0;
  }
}

//Zliczanie 3 i 4 tych samych (3 jednakowe i 4 jednakowe)
function Same(expected) {
  Decreasing();
  let leaver = true;
  let two = false;
  let three = false;
  let tempSum = pvalue.reduce((a, b) => a + b, 0);
  for (let i = 0; i < 5; i++) {
    let count = 0;
    if (leaver == true) { //1 6 1 6 1
      if(pvalue[i]!=0){
        var container=pvalue[i];
        }
      for (let j = 0; j < 5; j++) {
        if (container == pvalue[j]) {pvalue[j]=0; count++; }
        if (count == expected) { leaver = false; }
      }
      if (count == 3) { three = true; }
      else if (count == 2) { two = true; }
      if (count >= expected) { return tempSum; }
    }
  }
  if (two == true && three == true && expected == 10) { return 25; }

  else { return 0; }

}

//Resetowanie rundy
function Reset() {
  alert("Suma Twoich punktów: " + points[playerNumber]+ " (+"+(points[playerNumber] - howManyPoints)+")"  );
  if (playerNumber + 1 == playerCounter && round == 13) { Win(); }
  else {
    pvalue.fill(0, 0, 5);
    throwCounter = 0;
    if (playerNumber + 1 == playerCounter) {
      round++;
    }
    if (playerNumber < playerCounter - 1) {
      playerNumber++;
    } else {
      playerNumber = 0;
    }
    Scoreboard();
    RoundStart();
  }
}
//Wygrana
function Win() {
  let rankingPoints = [];
  let rankingNames = Array(4);
  var result = SortRanking();
  backgroundMusic.pause();
  document.getElementById("container2").innerHTML = '<div id="win"></div>';
  document.getElementById("box2").style.display = "none";
  document.getElementById("win").innerHTML = '<p id="winner">  Wygrałeś graczu: ' + playerNicknames[result[0]] + ' zdobywajac punktów: ' + points[result[0]] + '</p><img class="trail" src="src/nyan-trail.gif"><img class="cat" src="src/nyan-cat.gif">'
  document.getElementById("win").innerHTML += '<p id="second">  2. Miejsce: ' + playerNicknames[result[1]] + ' - ' + points[result[1]] + ' </p>';
  if (playerCounter == 3 || playerCounter ==4) {
    document.getElementById("win").innerHTML += '<p id="third"> 3. Miejsce: ' + playerNicknames[result[2]] + ' - ' + points[result[2]] + ' </p>';
  }
    wins.play();
    setTimeout(() => { awin.play(); }, 1600);
}
