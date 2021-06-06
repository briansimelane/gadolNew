

// Shuffle deck of cards function
function shuffle(array) {
    var tmp, current, top = array.length;
    if (top) while (--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = array[current];
        array[current] = array[top];
        array[top] = tmp;
    }
    return array;
    } ;


function setInitialMarket(DataFromDatabase) {    
    // Contract card variables
    let valueHold = 0;
    let cashHold = 0;
    let debtorsHold = 0;
    let productsHold = 0;
    let redHold = 0;
    let greenHold = 0;
    let yellowHold = 0;
    let purpleHold = 0;
    let blackHold = 0; 

    // Resource card variables
    let resourcesProductsHold = 0;
    let resourcesRedHold = 0;
    let resourcesGreenHold = 0;
    let resourcesYellowHold = 0;
    let resourcesPurpleHold = 0;
    let resourcesBlackHold = 0;

    //Temporary Resources
    

    //Update Temporary Resources Values
    

    
  // Create Contract Cards 
 /*   var i;
    for (i = 0; i < 4; i++) {
        
        let contractCard = document.createElement('div');
        contractCard.classList.add('contract_card');
        contractCard.classList.add('hoverable');

        // re-declare variables
        valueHold = DataFromDatabase.z00contractCards[i].Value;
        cashHold = DataFromDatabase.z00contractCards[i].Cash;
        debtorsHold = DataFromDatabase.z00contractCards[i].Debtors;
        productsHold = DataFromDatabase.z00contractCards[i].Production;
        redHold = DataFromDatabase.z00contractCards[i].CostRed;
        greenHold =  DataFromDatabase.z00contractCards[i].CostGreen;
        yellowHold =  DataFromDatabase.z00contractCards[i].CostYellow;
        purpleHold =  DataFromDatabase.z00contractCards[i].CostPurple;
        blackHold = DataFromDatabase.z00contractCards[i].CostBlack;
        contractCardId = DataFromDatabase.z00contractCards[i].Ref;


        contractCard.innerHTML =
            `<div class="contract_details" id=${contractCardId}>
        <div class="contractValue"> ${valueHold} </div >
        <div class="contractCash"> ${cashHold} </div>
        <div class="contractDebtors"> ${debtorsHold} </div>
        <div class="redValue"> ${redHold} </div>
        <div class="greenValue"> ${greenHold} </div>
        <div class="yellowValue"> ${yellowHold} </div>
        <div class="purpleValue"> ${purpleHold} </div>
        <div class="blackValue"> ${blackHold} </div>
        <div class="productValue"> ${productsHold} </div>
        </div > `;
        //contractContainer.appendChild(contractCard);
        contractContainer.insertBefore(contractCard, tokensHolder);
        }

    // Create Green Cards 
    var g;
    for (g = 0; g < 3; g++) {

        let ResourceCard = document.createElement('div');
        ResourceCard.classList.add('resource_card');
        ResourceCard.classList.add('greenResource');
        ResourceCard.classList.add('hoverable');

        // re-declare variables
        resourcesProductsHold = DataFromDatabase.z01greenCards[g].Production;
        resourcesRedHold = DataFromDatabase.z01greenCards[g].CostRed;
        resourcesGreenHold = DataFromDatabase.z01greenCards[g].CostGreen;
        resourcesYellowHold = DataFromDatabase.z01greenCards[g].CostYellow;
        resourcesPurpleHold = DataFromDatabase.z01greenCards[g].CostPurple;
        resourcesBlackHold = DataFromDatabase.z01greenCards[g].CostBlack;
        resourcesGreenCardId = DataFromDatabase.z01greenCards[g].Ref;



        ResourceCard.innerHTML =
            `<div class="card_details" id=${resourcesGreenCardId}>
        <div class="productsValue">${resourcesProductsHold}</div>
        <div class="redCost">${resourcesRedHold}</div>
        <div class="greenCost">${resourcesGreenHold}</div>
        <div class="yellowCost">${resourcesYellowHold}</div>
        <div class="purpleCost">${resourcesPurpleHold}</div>
        <div class="blackCost">${resourcesBlackHold}</div>
    </div> `;
        
        resourceContainer1.appendChild(ResourceCard);
    } 

    // Create Yellow Cards 
    var g;
    for (g = 0; g < 3; g++) {

        let ResourceCard = document.createElement('div');
        ResourceCard.classList.add('resource_card');
        ResourceCard.classList.add('yellowResource');
        ResourceCard.classList.add('hoverable');

        // re-declare variables
        resourcesProductsHold = DataFromDatabase.z02yellowCards[g].Production;
        resourcesRedHold = DataFromDatabase.z02yellowCards[g].CostRed;
        resourcesGreenHold = DataFromDatabase.z02yellowCards[g].CostGreen;
        resourcesYellowHold = DataFromDatabase.z02yellowCards[g].CostYellow;
        resourcesPurpleHold = DataFromDatabase.z02yellowCards[g].CostPurple;
        resourcesBlackHold = DataFromDatabase.z02yellowCards[g].CostBlack;
        resourcesYellowCardId = DataFromDatabase.z02yellowCards[g].Ref;

        ResourceCard.innerHTML =
            `<div class="card_details" id=${resourcesYellowCardId}>
        <div class="productsValue">${resourcesProductsHold}</div>
        <div class="redCost">${resourcesRedHold}</div>
        <div class="greenCost">${resourcesGreenHold}</div>
        <div class="yellowCost">${resourcesYellowHold}</div>
        <div class="purpleCost">${resourcesPurpleHold}</div>
        <div class="blackCost">${resourcesBlackHold}</div>
    </div> `;
        
        resourceContainer1.appendChild(ResourceCard);
    }

    // Create Red Cards 
    var g;
    for (g = 0; g < 3; g++) {

        let ResourceCard = document.createElement('div');
        ResourceCard.classList.add('resource_card');
        ResourceCard.classList.add('redResource');
        ResourceCard.classList.add('hoverable');

        // re-declare variables
        resourcesProductsHold = DataFromDatabase.z03redCards[g].Production;
        resourcesRedHold = DataFromDatabase.z03redCards[g].CostRed;
        resourcesGreenHold = DataFromDatabase.z03redCards[g].CostGreen;
        resourcesYellowHold = DataFromDatabase.z03redCards[g].CostYellow;
        resourcesPurpleHold = DataFromDatabase.z03redCards[g].CostPurple;
        resourcesBlackHold = DataFromDatabase.z03redCards[g].CostBlack;
        resourcesRedCardId = DataFromDatabase.z03redCards[g].Ref;

        ResourceCard.innerHTML =
            `<div class="card_details" id=${resourcesRedCardId}>
        <div class="productsValue">${resourcesProductsHold}</div>
        <div class="redCost">${resourcesRedHold}</div>
        <div class="greenCost">${resourcesGreenHold}</div>
        <div class="yellowCost">${resourcesYellowHold}</div>
        <div class="purpleCost">${resourcesPurpleHold}</div>
        <div class="blackCost">${resourcesBlackHold}</div>
    </div> `;

        resourceContainer2.appendChild(ResourceCard);
    }

    // Create Purple Cards 
    var g;
    for (g = 0; g < 3; g++) {

        let ResourceCard = document.createElement('div');
        ResourceCard.classList.add('resource_card');
        ResourceCard.classList.add('purpleResource');
        ResourceCard.classList.add('hoverable');

        // re-declare variables
        resourcesProductsHold = DataFromDatabase.z04purpleCards[g].Production;
        resourcesRedHold = DataFromDatabase.z04purpleCards[g].CostRed;
        resourcesGreenHold = DataFromDatabase.z04purpleCards[g].CostGreen;
        resourcesYellowHold = DataFromDatabase.z04purpleCards[g].CostYellow;
        resourcesPurpleHold = DataFromDatabase.z04purpleCards[g].CostPurple;
        resourcesBlackHold = DataFromDatabase.z04purpleCards[g].CostBlack;
        resourcesPurpleCardId = DataFromDatabase.z04purpleCards[g].Ref;

        ResourceCard.innerHTML =
            `<div class="card_details" id=${resourcesPurpleCardId}>
        <div class="productsValue">${resourcesProductsHold}</div>
        <div class="redCost">${resourcesRedHold}</div>
        <div class="greenCost">${resourcesGreenHold}</div>
        <div class="yellowCost">${resourcesYellowHold}</div>
        <div class="purpleCost">${resourcesPurpleHold}</div>
        <div class="blackCost">${resourcesBlackHold}</div>
    </div> `;

        resourceContainer2.appendChild(ResourceCard);
    }

    // Create Black Cards 
    var g;
    for (g = 0; g < 3; g++) {

        let ResourceCard = document.createElement('div');
        ResourceCard.classList.add('resource_card');
        ResourceCard.classList.add('blackResource');
        ResourceCard.classList.add('hoverable');

        // re-declare variables
        resourcesProductsHold = DataFromDatabase.z05blackCards[g].Production;
        resourcesRedHold = DataFromDatabase.z05blackCards[g].CostRed;
        resourcesGreenHold = DataFromDatabase.z05blackCards[g].CostGreen;
        resourcesYellowHold = DataFromDatabase.z05blackCards[g].CostYellow;
        resourcesPurpleHold = DataFromDatabase.z05blackCards[g].CostPurple;
        resourcesBlackHold = DataFromDatabase.z05blackCards[g].CostBlack;
        resourcesBlackCardId = DataFromDatabase.z05blackCards[g].Ref;

        ResourceCard.innerHTML =
            `<div class="card_details" id=${resourcesBlackCardId}>
        <div class="productsValue">${resourcesProductsHold}</div>
        <div class="redCost">${resourcesRedHold}</div>
        <div class="greenCost">${resourcesGreenHold}</div>
        <div class="yellowCost">${resourcesYellowHold}</div>
        <div class="purpleCost">${resourcesPurpleHold}</div>
        <div class="blackCost">${resourcesBlackHold}</div>
    </div> `;

        
        resourceContainer3.insertBefore(ResourceCard, threeHolderCards);
    }
     */

}

/*
createForm.addEventListener('submit', (e)=> {
    e.preventDefault();


    // get information from the form
    var user = firebase.auth().currentUser.uid;
    const gameName = createForm['create-name'].value;
    const numPlayers = parseInt(createForm['create-numberOfPlayers'].value);
    const gameState = 0;
    const shuffledContractCards = shuffle(resetContractCards);
    const shuffledGreenCards = shuffle(resetGreenCards);
    const shuffledYellowCards = shuffle(resetYellowCards);
    const shuffledRedCards = shuffle(resetRedCards);
    const shuffledPurpleCards = shuffle(resetPurpleCards);
    const shuffledBlackCards = shuffle(resetBlackCards);
    const playerScoreCash = new Array(numPlayers).fill(playerStartCash);
    const playerScoreProduction = new Array(numPlayers).fill(playerStartProduction);
    const playerScoreContractValue = new Array(numPlayers).fill(playerStartValue);
    const playerScoreContractCost = new Array(numPlayers).fill(playerStartCost);
    const playerScoreContractDebtors = new Array(numPlayers).fill(playerStartDebtors);
    const playerScoreTempRed = new Array(numPlayers).fill(playerTempRed);
    const playerScoreTempGreen = new Array(numPlayers).fill(playerTempGreen);
    const playerScoreTempYellow = new Array(numPlayers).fill(playerTempYellow);
    const playerScoreTempPurple = new Array(numPlayers).fill(playerTempPurple);
    const playerScoreTempBlack = new Array(numPlayers).fill(playerTempBlack);
    const playerScorePermRed = new Array(numPlayers).fill(playerPermRed);
    const playerScorePermGreen = new Array(numPlayers).fill(playerPermGreen);
    const playerScorePermYellow = new Array(numPlayers).fill(playerPermYellow);
    const playerScorePermPurple = new Array(numPlayers).fill(playerPermPurple);
    const playerScorePermBlack = new Array(numPlayers).fill(playerPermBlack);


    console.log(gameName, numPlayers, gameState);
    return db.collection('games').doc().set({
        // Variables written into Firebase database
            gstate: gameState,
            creator: user,
            gname: gameName,
            numPlayers: numPlayers,
            z00contractCards: shuffledContractCards,
            z01greenCards: shuffledGreenCards,
            z02yellowCards: shuffledYellowCards,
            z03redCards: shuffledRedCards,
            z04purpleCards: shuffledPurpleCards,
            z05blackCards: shuffledBlackCards,
            z06holderCards: [0, 0, 0],
            z07marketRedTokens: marketTempRed,
            z08marketGreenTokens: marketTempGreen,
            z09marketYellowTokens: marketTempYellow,
            z10marketPurpleTokens: marketTempPurple,
            z11marketBlackTokens: marketTempBlack,
            z12playerCash: playerScoreCash,
            z13playerProduction: playerScoreProduction,
            z14playerContractValue: playerScoreContractValue,
            z15playerContractCost: playerScoreContractCost,
            z16playerContractDebtors: playerScoreContractDebtors,
            z17playerTempRed: playerScoreTempRed,
            z18playerTempGreen: playerScoreTempGreen,
            z19playerTempYellow: playerScoreTempYellow,
            z20playerTempPurple: playerScoreTempPurple,
            z21playerTempBlack: playerScoreTempBlack,
            z22playerPermRed: playerScorePermRed,
            z23playerPermGreen: playerScorePermGreen,
            z24playerPermYellow: playerScorePermYellow,
            z25playerPermPurple: playerScorePermPurple,
            z26playerPermBlack: playerScorePermBlack


    }).then(() => {

    // Get modal and close it
        const modal = document.querySelector('#modal-create');
        M.Modal.getInstance(modal).close();

        // Reset form
        createForm.reset();

        M.toast({html: 'You game has been created.', classes: 'rounded teal', displayLength: 3000});
        
    });

    })

    */