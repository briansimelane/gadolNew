// Initialisation function to bring JSON start state values
const gamesJSON = ''      

fetch('/reset.json') 
        .then(response => response.json())
        .then(data => {
           
        // Assign JSON game file to variables
            gamesJSON = data.ResetTable
            })

     console.log("On mounted: " , gamesJSON)  

     

     export default { gamesJSON}