const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;
const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';
let enteredValue = 0;
let chosenMaxLife;

try{
 enteredValue = parseInt(prompt("Maximum life for you and the monster", '100'));
 console.log(isNaN(enteredValue))

if (isNaN(enteredValue) && enteredValue <= 0) {

    throw {message: 'you entered non numbers'}
}
}
catch {
    chosenMaxLife = 100;
    alert('opps, something happened!')
}

chosenMaxLife = enteredValue;


let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonuLife = true;


adjustHealthBars(chosenMaxLife)
function reset() {
     let currentMonsterHealth = chosenMaxLife;
    let currentPlayerHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
}
function endRound() {
    const initialPlayerLife = currentPlayerHealth;
    const playerDemage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDemage;
    writeToLog(LOG_EVENT_MONSTER_ATTACK, playerDemage, currentMonsterHealth, currentPlayerHealth)

    if (currentPlayerHealth <= 0 && hasBonuLife) {
        hasBonuLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerLife;
        setPlayerHealth(initialPlayerLife);
        alert('you would be dead but the bonus life saved you!');
        return;
    }
    if(currentMonsterHealth <= 0){
        alert('you won!');
        writeToLog(LOG_EVENT_GAME_OVER, 'YOU WON', currentMonsterHealth, currentPlayerHealth)
        reset();
    }
    else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0){
        alert('you lost');
        writeToLog(LOG_EVENT_MONSTER_ATTACK, 'YOU LOST', currentMonsterHealth, currentPlayerHealth)
        reset();
    }
    else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
        alert('you have a draw');
        writeToLog(LOG_EVENT_MONSTER_ATTACK, 'A DRAW', currentMonsterHealth, currentPlayerHealth)

        reset();
    }

    if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0 ) {
       reset();
    }
}
function attackMonster(mode) {
    let maxDemage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE
    let logEvent = mode === MODE_ATTACK ? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_PLAYER_STRONG_ATTACK
    // if (mode === MODE_ATTACK) {
    //     maxDemage = ATTACK_VALUE;
    //     logEvent = LOG_EVENT_PLAYER_ATTACK
        
    // } else if (mode === MODE_STRONG_ATTACK) {
    //     maxDemage = STRONG_ATTACK_VALUE;
    //     logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK

    // }
    const demage = dealMonsterDamage(maxDemage);
    currentMonsterHealth -= demage;
    const playerDemage = dealPlayerDamage(ATTACK_VALUE)
    currentPlayerHealth -= playerDemage;
    writeToLog(logEvent, demage, currentMonsterHealth, currentPlayerHealth)
    endRound();
}

function attackHandler() {
    attackMonster(MODE_ATTACK)
}

function strongAttackHandler() {
    attackMonster(MODE_STRONG_ATTACK)

}
function healPlayerHandler() {
    let healValue;
    if(currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
        alert(' you cannot heal to more than your max initial health');
        healValue = chosenMaxLife - currentPlayerHealth;
    } 
    else {
        healValue = HEAL_VALUE;
    }
    increasePlayerHealth(healValue);
    currentPlayerHealth += healValue;
    writeToLog(logEvent, LOG_EVENT_PLAYER_HEAL, currentMonsterHealth, currentPlayerHealth)
    endRound();
}

function writeToLog(ev, vl) {
    logEntry = {
        event: ev,
        value: vl, 
        target: 'MONSTER',
        finalMonsterHealth :currentMonsterHealth, 
        finalPlayerHealth : currentPlayerHealth
    }
    switch(ev) {
        case LOG_EVENT_PLAYER_ATTACK:
            logEntry = {
                event: ev,
                value: vl, 
                target: 'MONSTER',
                finalMonsterHealth : currentMonsterHealth, 
                finalPlayerHealth : currentPlayerHealth
            }
            break;
        case LOG_EVENT_PLAYER_STRONG_ATTACK:
            logEntry = {
                event: ev,
                value: vl, 
                target: 'PLAYER',
                finalMonsterHealth : currentMonsterHealth, 
                finalPlayerHealth : currentPlayerHealth
            }
            break;
        case LOG_EVENT_MONSTER_ATTACK: 
            logEntry = {
                event: ev,
                value: vl, 
                target: 'PLAYER',
                finalMonsterHealth :currentMonsterHealth, 
                finalPlayerHealth : currentPlayerHealth
            }
            break;
        case LOG_EVENT_PLAYER_HEAL: 
            logEntry = {
                event: ev,
                value: vl, 
                target: 'PLAYER',
                finalMonsterHealth : currentMonsterHealth, 
                finalPlayerHealth : currentPlayerHealth
            }
            break;
        case LOG_EVENT_GAME_OVER: 
            logEntry = {
                event: ev,
                value: vl, 
                finalMonsterHealth : currentMonsterHealth, 
                finalPlayerHealth : currentPlayerHealth
            }
            break;
        default: 
         logEntry = {}
    }
    battleLog.push(logEntry);
}
function printLogHandler() {
    for (let index = 0; index < battleLog.length; index++) {
        const element = battleLog[index];
        console.log(element);
        
    }
}
attackBtn.addEventListener('click', attackHandler)
strongAttackBtn.addEventListener('click', strongAttackHandler)
healBtn.addEventListener('click', healPlayerHandler)
logBtn.addEventListener('click', printLogHandler)