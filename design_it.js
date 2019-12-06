
//const apilUrl = '';


//REST Calls to define here
const design_it = {




};



//Main Function to Enter
(function() {  


// Function to take Image and send to Backend using "Drag and Drop Button"

//Call ADD function

  $(document).on('submit', '#addEntry', function(e) {
    e.preventDefault();

    design_it.add(
      $('#name').val().trim(),
      $('#email').val().trim(),
      $('#comment').val().trim()
    ).done(function(result) {
      // reload entries
      loadEntries();
    }).error(function(error) {
      console.log(error);
    });
  });


//Function to get Image details from Backend and Post it to Frontend after scroll and Show the Preferences.

//Call GET function





//Function to Take Preferences from User and Send to Backend

//Call POST/PUT function





//Function to Retrieve Recommendation results from Backend and Post it to Frontend After Scrolling with images

//Call GET function



//Function for Login
//Take input from user and POST to Backend




//Success Message after Account Creation
//Call Get function for Retreiving Details of User Login Details




})();