const TEXTBOX = document.getElementById("userInput");
const DEATH = new Audio("../DEATH.wav");
const COMPLETE = new Audio("../COMPLETE.wav");
const BEAR = new Audio("../BEARLIFE.wav");


TEXTBOX.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("submit").click();
  }
});

function getInput() {return document.getElementById('userInput').value;}
function resetInput() {document.getElementById('userInput').value = '';}
function showInputBox(answers) {TEXTBOX.style.display="grid"; TEXTBOX.placeholder=answers;}
function hideInputBox() {TEXTBOX.style.display="none"}
function invalidAnswer() {console.log("invalid answer")}

function death() {DEATH.play();}
function complete() {COMPLETE.play();}
function bearLife() {BEAR.play();}

function waitForInput(gameState) {
  return new Promise(resolve => {
    const submitButton = document.getElementById("submit");
    submitButton.onclick = () => {
        const input = getInput();
        resolve(processInput(gameState, input));
    }
  });
}

function processInput(gameState, input) {

  if (gameState === 'firstPart') {switch (input) {
      case "run":
        fast();
        break;
      case "save":
        heroic();
        break;
      case "walk":
        slow();
        break;
      default:
        invalidAnswer()
    }
  }

  if (gameState === 'fast') {switch (input) {case "force": return "force"; case "turn": return "turn";}}

  if (gameState === 'heroic') {switch (input) {case "sit": return "sit"; case "carry": return "carry";}}

  if (gameState === 'slowOne') {
    if (input === "lay down") {return "lay down";}
    else if (input === "keep on") {return "keep on";}
    else invalidAnswer();
  }

  if (gameState === 'slowTwo') {switch (input) {case "job": return "job"; case "ambulance": return "amb";}}

  resetInput();
}

function printText(textArray, answers) {
  let i=0;
  var printer = setInterval(function() {
    if (i < textArray.length) { document.getElementById("gameText").innerText += textArray[i]; i++; }
    else { clearInterval(printer); setInterval(1000); if (answers) {showInputBox(answers)}}
  }, 2000);
}

async function fast() {
  hideInputBox();

  printText(["\nYour body's overheated and you're out of breath " +
	"by the time you reach a small iron shack in the woods.\n",
  "\nDo you force your way in, or turn back?\n"], "force/turn")

  var choice = await waitForInput("fast");
  if (choice === "force") {
    hideInputBox();
    printText(["\nYou lock yourself in and pray to Santa.\t*\t*\t*\n",
    "\n3 and a half hours later you wake up in a cold sweat to some boisterous elves" +
	"shouting at you in a strange language.\n", "\nAlthough festive in appearance, they shoot you and leave.\n"])
    setTimeout(death, 6000);
  }
  else if (choice === "turn") {
    hideInputBox();
    printText(["\nThe bear is charging at you.\n",
  "\nThe two of you eventually manage to work out an arrangement, but over the months to come,\n" +
  "\nyou find yourself unfulfilled by the bear way of life, always wondering what might have been.\n"]);
    setTimeout(bearLife, 4000);
  }
  else invalidAnswer();
}

async function heroic() {
  hideInputBox();

  printText(["\nBy happenstance the bear retreats into the woods due to an unforeseen honey spillage nearby.\n",
  "\nAs you approach you see the bear's victim wounded on the charred forest floor.\n",
  "\nDo you sit and talk to him during his final hour, or try & carry him to safety?\n"], "sit/carry")

  var choice = await waitForInput("heroic");
  if (choice ==="sit") {
    hideInputBox();
    printText(["\nWhilst you sing Christmas carols in a vain effort to calm this man's feverish mental state,\n",
      "\nGrowls McBear unexpectedly leaps out of the woods and eats you.\n"]);
    setTimeout(death, 4000);
  }
  else if (choice === "carry") {
    hideInputBox();
    printText("\nIt's too painful for him to move. He's in no state to walk.\n",
      "\nYou'll send help back when you get to a phone.\n")
    slow();
  }
}

async function slow() {
  hideInputBox();

  printText(["\nAfter almost an hour, on the verge of collapsing " +
    "from dehydration, you think you can hear the sound of cars up ahead.\n"], "lay down/keep on")

  var choice = await waitForInput('slowOne');
  if (choice === "lay down") {
    hideInputBox();
    printText(["\nYou fall asleep forevermore.\n"]); death();
  }
  else if (choice === "keep on") {
    hideInputBox();
    resetInput();
    printText(["\nyou're walking for another few hundred metres, barely able to stand, " +
    "until you spot a motorway service station.\n",
      "\nyou go into McDonald's and pick up someone's Fanta and down all of it in one.\n",
      "\nYou notice a sign saying there are job vacancies.\n",
      "\nDo you register your interest, or demand someone give you their phone so you can call an ambulance?\n",
      "\n1. Seems like a good opportunity\n",
      "\n2. I will keep my promise.\n"], "job/ambulance")
  }

    var choiceTwo = await waitForInput("slowTwo");
    if (choiceTwo === "job") {
      hideInputBox();
      printText(["\nYou approach the counter dizzy, but collapse due to chronic malnutrition, " +
      "smashing your head on the well-polished floor.\n"]);
      setTimeout(death, 2000);
    }
    else if (choiceTwo === "amb") {
     hideInputBox();
     printText(["\nPeople look at you like you're insane.\n",
     "\nBut after a while, someone hands you a Filet-o-Fish.\n",
     "\nTwo weeks later, you read in the newspaper that the victim of the bear attack was" +
       "saved and he's on the road to recovery.\n",
     "\nWell done. you completed WASTELAND!!\n",
     "\n\t\t(☆▽☆)"]);
     setTimeout(complete, 8000);
    }
}

async function start() {
  hideInputBox();

  printText(["You are wandering through a burnt forest.\n",
    "\nA strange mixture of soil, ash and pebbles encroaches upon your worn out shoes.\n",
    "\nFossils of trees destroyed in the fire seem to unravel in every direction.\n",
    "\nWay out on your right you notice a bear mauling a human who's crying out in distress.\n",
    "\nDo you run, try to save that person, or just keep minding your own business?\n"],
    "run/save/walk");

  await waitForInput("firstPart");
}

start();
