import { projectAuth } from '../firebase/config'
import { projectFirestore } from 'firebase'

// Keep track of User's authentication status (listen for auth status changes)
projectAuth.onAuthStateChanged(user => {
    if(user) {
        // If there is a user - it means they are logged in
        // get data from the database
        projectFirestore.collection('games').where('creator', '==', user.uid).onSnapshot(snapshot => {
        // calls the function in the app.js to setup guides
        //setupGames(snapshot.docs);
        //setupUI(user);

            projectFirestore.collection('players').doc(user.uid).get().then(doc => {
                const userHtml = `${doc.data().name} (logged in)`;
                const playerHtml = `<h4>Welcome ${doc.data().name}! </h4>`
               
                console.log('user logged in: ' + doc.data().name);
            });

        }, err => {
                console.log(err.message);
            });
        
    }else {
        // User not logged in
        // clear the data - so that nothing displays. We do this by passing an empty array in the setupGuides function
        //setupUI();
        //setupGames([]);
        
        console.log('user logged out')
    }
})

// signup form to Firebase authentication
signupForm.addEventListener('submit', (e)=> {
    e.preventDefault();

    // get user info
    const name = signupForm['signup-name'].value;
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    // sign up the user
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        

        return db.collection('players').doc(cred.user.uid).set({
            name: name,
            // skill: signupForm['signup-skill'].value

        }).then(() => {
            // Get modal and close it
        const modal = document.querySelector('#modal-signup');
        M.Modal.getInstance(modal).close();

        // Reset form
        signupForm.reset();
        });
          
        });
    });

// Logout method
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
});

// Exit game method
const exitBtn = document.querySelector('#exitCurrGame');
exitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    exitGame();
});

// logging in a registered user
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e)=>{
    e.preventDefault();

    // get the user information
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    // log the user in
    auth.signInWithEmailAndPassword(email, password).then(cred => {
        
        // Get modal and close it
        const modal = document.querySelector('#modal-login');
        M.Modal.getInstance(modal).close();

        // Reset form
        loginForm.reset();
    })
});

// create a game
const createForm = document.querySelector('#game-create-form');
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



       // Join Game with ID
const joinForm = document.querySelector('#game-join-form');
joinForm.addEventListener('submit', (e)=>{
    e.preventDefault();

    // get the user information
    const gameID = joinForm['join-game-id'].value;


        joinGame(gameID);
        
        // Get modal and close it
        const modal = document.querySelector('#modal-join');
        M.Modal.getInstance(modal).close();

        // Reset form
        joinForm.reset();
    
});

    



  // Game Logic functions
