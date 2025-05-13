

function post() {

    checkUsername();
    const username = getUsername();
    //Select the form
    const form = document.querySelector('form');
    const formData = new FormData(form);

    //Get the form data
    const titleData = formData.get("title");
    const addressData = formData.get("address");
    const zipData = formData.get("zip")
    const priceData = formData.get("price");
    const distanceData = formData.get("distance");
    const contactData = formData.get("contact");
    const descData = formData.get("description");
    const mainImgFile = formData.get("main-image");
    const reader = new FileReader();
  
    //Check for the uploaded files
    if (mainImgFile) {
      reader.readAsDataURL(mainImgFile);
    }
    reader.onload = function() {
      //Get the string data of the file
      const mainImgData = reader.result;
        //Create the object where we store data
        const postData = {
            email: username,
            title: titleData,
            address: addressData,
            zip: zipData,
            price: +priceData,
            distance: +distanceData,
            contactInfo: contactData,
            description_house: descData,
            mainImg: mainImgData
        }
        
        console.log(JSON.stringify(postData));

        //Fetch request
        fetch('https://2uktvgs167.execute-api.us-east-2.amazonaws.com/put', {
          method: 'PUT',
          headers: {
            'Content-type': 'application/json; charset=UTF-8'
          },
          body: JSON.stringify(postData)
        }).then(resp => {
          // Error handling
          if (resp.ok) {
            console.log('Success');
            window.location = "../ListingPage/ListingPage.html";
          } else {
            console.log('Fail');
          }
        });
    }
  }

// Make sure user is signed in
function checkUsername() {
  username = getUsername();
  if(username === '')
  {
    alert("Please sign in redirecting to sign in page!")
    window.location = "../LoginPage/LoginPage.html";
  }
}

//Get username in from document cookie
function getUsername(){
  // Get the value of the "username" cookie
  var username='';

  if (document.cookie !== ''){
    const cookie = document.cookie;
    const cookieData = cookie.split(';');
    const cookiePair = cookieData[0].split('=');

    if (cookiePair[0] === "username") {
      username = cookiePair[1];
    }
  }
  return username;
}

//Reset cookie
function signOut() {
  document.cookie = "username=";
}

function backButton() {
  window.location = "../ListingPage/ListingPage.html";
}

// Check cookies for debugging
function checkCookies(){
  console.log(document.cookie);
}