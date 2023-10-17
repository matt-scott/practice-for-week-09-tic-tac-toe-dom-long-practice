// UI construction

// Create main page container
const createSiteContainer = (inputElement) => {
    const siteContainer = document.createElement('div');
    siteContainer.className = ('siteContainer');
    inputElement.appendChild(siteContainer);
    return siteContainer;
}

const createMainContentContainer = (inputElement) => {
    const mainContentContainer = document.createElement('div');
    mainContentContainer.className = ('mainContentContainer');
    inputElement.appendChild(mainContentContainer);
    return mainContentContainer;
}

// Create header (win or tie)
const createPageHeader = (inputElement, gameStatus) => {
    const pageHeader = document.createElement('h1');
    pageHeader.className = ('header');
    pageHeader.id = ('pageHeader');

    if (gameStatus === 'x') {
        pageHeader.innerText = ("Winner: X");
    }
    else if (gameStatus === 'o') {
        pageHeader.innerText = ("Winner: O");
    }
    else {
        pageHeader.innerText = ("Winner: None");
    }

    inputElement.insertBefore(pageHeader, inputElement.children[0]);
    return pageHeader;
}

// Create tic tac toe grid container
const createGameGrid = (inputElement) => {
    const gameGrid = document.createElement('div');
    gameGrid.className = ('grid');
    gameGrid.id = ('grid');
    inputElement.appendChild(gameGrid);
    return gameGrid;
}

// Create tic tac toe boxes
// Grid numbering system. e.g. g0 = top left grid
//         0 | 1 | 2
//         ---------
//         3 | 4 | 5
//         ---------
//         6 | 7 | 8
const createGameBoxes = (inputElement) => {
    let gameBoxStatuses = []
    // create game boxes
    for (let i = 0; i < 9; i++) {
        let x = document.createElement('div');
        x.className = (`b${i}`);
        x.id = (i);
        inputElement.appendChild(x);

        // set each box status based on session storage
        let storedBox = sessionStorage.getItem(i);

        // set value as what is located in storage
        if (storedBox) {
            gameBoxStatuses[i] = storedBox;
            x.setAttribute("data-status", storedBox);
        }
        else {
            // nothing in session storage, set value as blank
            gameBoxStatuses[i] = ('blank');
            x.setAttribute("data-status", "blank");
        }
    }
    return gameBoxStatuses;
}

// Create action buttons container
const createActionButtonsContainer = (inputElement) => {
    const actionButtonsContainer = document.createElement('div');
    actionButtonsContainer.className = ('button-container');
    inputElement.appendChild(actionButtonsContainer);
    return actionButtonsContainer;
}

// Create bottom row action buttons (new game / give up)
const createActionButtons = (inputElement) => {
    const newGameButton = document.createElement('button');
    newGameButton.className = ('button');
    newGameButton.type = ('button');
    newGameButton.disabled = true;
    newGameButton.innerText = ('New Game');
    inputElement.appendChild(newGameButton);

    const giveUpButton = document.createElement('button');
    giveUpButton.className = ('button');
    giveUpButton.type = ('button');
    giveUpButton.innerText = ('Give Up');
    inputElement.appendChild(giveUpButton);

    return ([newGameButton, giveUpButton]);
}

// Entire HTML UI
const createUi = () => {
    // Create reference to DOM body
    const htmlBody = document.body;
    
    // Create main site container
    const siteContainer = createSiteContainer(htmlBody);

    // Create inner container for site content
    const mainContentContainer = createMainContentContainer(siteContainer);

    // Create game grid
    const gameGrid = createGameGrid(mainContentContainer);

    // Create game boxes
    const gameBoxStatuses = createGameBoxes(gameGrid);

    // Create action buttons container
    const actionButtonsContainer = createActionButtonsContainer(mainContentContainer);

    // Create action buttons
    const [newGameButton, giveUpButton] = createActionButtons(actionButtonsContainer);

    // return necessary elements for game logic
    return ([gameBoxStatuses, mainContentContainer, gameGrid, newGameButton, giveUpButton]);
}

const checkGameEnding = (gameBoxStatuses) => {
    const winArrays = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

    let gameState;
    // go through each win array combination
    for (let i = 0; i < winArrays.length; i++) {
        let winArray = winArrays[i];
        let box0 = gameBoxStatuses[winArray[0]];
        let box1 = gameBoxStatuses[winArray[1]];
        let box2 = gameBoxStatuses[winArray[2]];
        
        // make sure a win state isn't set if all boxes equal 'blank'
        if (box0 !== 'blank' && box1 !== 'blank' && box2 !== 'blank') {
            // if boxes are all equal (x or o), set game state to that value
            if (box0 === box1 && box1 === box2) {
                gameState = box0;
            }
        }
    }

    // if no blanks are found, then win hasn't been determined which means game ended in a tie
    if (!gameBoxStatuses.find((element) => element === 'blank')) {
        gameState = ('tie');
    }

    //return gameState, will be either x, o, tie, or undefined.
    return(gameState);
};

// Run code after DOM and assets loaded
window.onload = () => {
    // create UI and retrieve necessary elements for game logic
    let [gameBoxStatuses, mainContentContainer, gameGrid, newGameButton, giveUpButton] = createUi();

    // set each box status based on session storage
    let gamePiece = sessionStorage.getItem("gamePiece");

    // set value as what is located in storage
    if (!gamePiece) {
        // variable to track x's and o's
        gamePiece = ('x');
    }

    // Player click listener function
    // first click starts as x and alternates thereafter with o
    const gameGridListener = (event) => {
        // examine specific box that was clicked
        // if box already set to x or o, nothing happens
        if (event.target.dataset.status === 'blank') {
            // when clicked, box changes data-status attribute to x or o;
            event.target.setAttribute("data-status", gamePiece);

            // acquire box number clicked to update gameBoxStatus array
            let boxNumber = event.target.id;

            // update gameBoxStatus array
            gameBoxStatuses[boxNumber] = gamePiece;

            // update game state in session storage
            sessionStorage.setItem(boxNumber,gamePiece);
            
            // see if a win or tie scenario has been created
            let gameStatus = checkGameEnding(gameBoxStatuses);

            // if win or tie scenario has been created, end the game
            if (gameStatus !== undefined) {
                // remove clicking ability from game grid
                gameGrid.removeEventListener("click", gameGridListener);
                // Create header
                createPageHeader(mainContentContainer, gameStatus);
                // Enable "new game" button
                newGameButton.disabled = false;
                // Disable the "Give Up" button.
                giveUpButton.disabled = true;
            }

            if (gamePiece === 'x') {
                gamePiece = ('o');
            }
            else {
                gamePiece = ('x');
            }

            // update game piece in session storage
            sessionStorage.setItem("gamePiece",gamePiece);
        }
    };

    // Create player click listener
    gameGrid.addEventListener("click", gameGridListener);


    // new game listener function
    const newButtonListener = () => {
        // clears the board
        // clears the game status
        for (let i = 0; i < 9; i++) {
            const x = document.getElementById(i);
            x.setAttribute("data-status", "blank");
            gameBoxStatuses[i] = ('blank');
            // update game state in session storage
            sessionStorage.setItem(i,'blank');
        }

        // update game piece in session storage
        sessionStorage.setItem("gamePiece","x");

        // clears the header
        document.getElementById('pageHeader').remove();

        // makes it so the next click of the tic-tac-toe board is an "X"
        gamePiece = ('x');

        // disables the "New Game" button
        newGameButton.disabled = true;
        // enable the "Give Up" button.
        giveUpButton.disabled = false;

        // Create player click listener
        gameGrid.addEventListener("click", gameGridListener);
    };

    // new game button listener
    newGameButton.addEventListener("click", newButtonListener);

    // player gives up button function
    const giveUpButtonListener = () => {
        // Show the winner status as won by the "other" player.
        let winner;
        if (gamePiece === 'x') {
            winner = ('o');
        }
        else if (gamePiece === 'o') {
            winner = ('x');
        }
        createPageHeader(mainContentContainer, winner);

        // Disable the "Give Up" button.
        giveUpButton.disabled = true;

        // Enable the "New Game" button.
        newGameButton.disabled = false;
    };

    // give up button listener
    giveUpButton.addEventListener("click", giveUpButtonListener);


    // store content in browser session storage
    // sessionStorage.setItem("",)
}