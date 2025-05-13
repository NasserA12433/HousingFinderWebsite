//Default username for testing please make a method that will populate this variable

// This is the data of all tile listings
var globalTiles = {};
// This function will load tiles from the back end 
function loadTiles(text, price, distance, myListing, userEmail) {
  // Log for the test code
  if(price != "")
    price = +price;
  if(distance != "")
    distance = +distance;
  const data = {        
    text_search: text,
    max_price: price,
    max_distance: distance,
    my_listing: myListing,   
    user_email: userEmail
  }
  console.log(data);
  fetch('https://tmoyfvn2eg.execute-api.us-east-2.amazonaws.com/default/post', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify(data)
  }).then(resp => resp.json())
    .then(data => {
      globalTiles = data;
      console.log(data);
      createTiles(data);
    });
  
    //Helper Function to create the tiles
    function createTiles(tilesData) {
      const tilesContainer = document.querySelector('.tile-container');
      tilesContainer.innerHTML = ''; 
      
      //Loop through tile data
      tilesData.forEach(Tile => {
        const tile = document.createElement('div');
        tile.classList.add('tile');
  
        //Load tile title
        const tileTitle = document.createElement('h2');
        tileTitle.textContent = Tile.title;
        
        //Load tile image
        const tileImage = document.createElement('img');
        tileImage.src = Tile.mainImg;
        
        //Load tile price
        const tilePrice = document.createElement('p');
        tilePrice.classList.add('price');
        tilePrice.textContent = "Price: $" + Tile.price;
  
        //Load tile distance
        const tileDistance = document.createElement('p');
        tileDistance.classList.add('distance');
        tileDistance.textContent = "Distance: " + Tile.distance + " miles";
        
        //Append children
        tile.appendChild(tileTitle);
        tile.appendChild(tileImage);
        tile.appendChild(tilePrice);
        tile.appendChild(tileDistance)
        tilesContainer.appendChild(tile);
  
        //Adding on click to display detailed listing
        tile.addEventListener('click', ()=>{
          const username = getUsername();
          const container = document.querySelector('.filters-listings-container');
          container.innerHTML = '';
  
          const detailedListing = document.createElement('div');
          detailedListing.classList.add('detailed-listing');

          //Add back button
          const backButton = document.createElement('button');
          backButton.innerText = "Back";
          backButton.classList.add('button');
          backButton.id = "back";
          backButton.onclick = back;
          container.appendChild(backButton);


          //Add delete button if username matches post username
          if(username !== ''){
            if(username===Tile.email)
            {
              const deleteButton = document.createElement('button');
              deleteButton.innerText = "Delete";
              deleteButton.classList.add('button');
              deleteButton.id = "delete";
              deleteButton.onclick = () => deleteListing(Tile.id);
              container.appendChild(deleteButton);
            }
          }

          const br = document.createElement('br');
          container.appendChild(br);

          const singleTitle = document.createElement('h1');
          singleTitle.textContent = Tile.title;
  
          const singleAddress = document.createElement('p');
          singleAddress.textContent = "Address: " + Tile.address + ", " + Tile.zip;
  
          const singlePrice = document.createElement('p');
          singlePrice.textContent = "Price: " + Tile.price;
  
          const singleDistance = document.createElement('p');
          singleDistance.textContent = "Distance: " + Tile.distance + " miles";
  
          const singleContact = document.createElement('p');
          singleContact.textContent = "Contact Information: " + Tile.contactInfo;
  
          const singleDescription = document.createElement('p');
          singleDescription.textContent = "Description:\n\n" + Tile.description_house;
  
          const singleImg = document.createElement('img');
          singleImg.src = Tile.mainImg;
  
          detailedListing.appendChild(singleTitle);
          detailedListing.appendChild(singleImg);
          detailedListing.appendChild(singleAddress);
          detailedListing.appendChild(singlePrice);
          detailedListing.appendChild(singleDistance);
          detailedListing.appendChild(singleContact);
          detailedListing.appendChild(singleDescription);
          container.appendChild(detailedListing);

          // Add edit button if username matches post username
          if(username !== '') {
            if(username==Tile.email) {
              const editButton = document.createElement('button');
              editButton.innerText = "Edit";
              editButton.classList.add('button');
              editButton.id = "edit";
              editButton.onclick = () => editListing(Tile);
              detailedListing.appendChild(editButton);
            }
          }
        })
      });
    }
}

//Function to handle filter sidebar
function filter() {
    const keywords = document.getElementById("keywords").value;
    const distance = document.getElementById("distance").value;
    const price = document.getElementById("price").value;
    const myListings = document.getElementById("my-listings-check").checked;

    //sending correct parameters so far
    console.log(keywords, distance, price, myListings);
    loadTiles(keywords, price, distance, myListings, getUsername());
}

// Function to handle search filter
function search() {    
    const keywords = document.getElementById("search-input").value;
    console.log(keywords);
    loadTiles(keywords, "", "", false, getUsername());
}

// Function to handle delete listing
function deleteListing(idData) {
  //Get the id 
  data = {id: idData}
  console.log(data);

  //Fetch using id data
  fetch('https://nfy8ejmcnb.execute-api.us-east-2.amazonaws.com/post', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify(data)
  }).then(resp => {
    //Error handling
    if (resp.ok) {
      console.log('Success');
      window.location = "../ListingPage/ListingPage.html";
    } else {
      console.log('Fail');
    }
  });
}

// Function that dynamically loads edit listing on to the page
function editListing(Tile) {
  // Select the container
  const container= document.querySelector('.filters-listings-container');
  // Get the html from our post page
  fetch('../PostPage/PostPage.html')
  .then(resp => resp.text())
  .then(html => {
    //Reuse html from post page
    container.innerHTML = html;
    
    //Adjust form to be edit 
    editFormAdjust(Tile);
    //Fill the form with prexsisting data
    editFormFill(Tile);
  });

  //Editing the Post From to be the Edit form
  function editFormAdjust(Tile) {
    //Change to edit listing
    document.getElementById('header').innerHTML = "Edit Listing";
    //Remove post script
    document.getElementById('post').remove();
    //Remove back button
    document.getElementById('input-field-button').remove();
    
    // Change on submit 
    const form = document.getElementById('form');
    // Link the submit to the actual API call function give it the index of the tile
    const submit = "event.preventDefault(); editCall(" + globalTiles.indexOf(Tile) + ")";
    form.setAttribute("onsubmit", submit);

    // We won't make uploading an image required
    document.getElementById("main-image").removeAttribute("required");
  }

  function editFormFill(Tile){
    const tileData = {
      title: Tile.title,
      address: Tile.address,
      zip: Tile.zip,
      price: Tile.price,
      distance: Tile.distance,
      contact: Tile.contactInfo,
      description: Tile.description_house
    };
    Object.keys(tileData).forEach(key => {
      const formElement = document.getElementById(key);
      formElement.value = tileData[key];
    });
  }
}

//This is the call that will get the data from the form and excute the api call
function editCall(index){

    //Check if an image is loaded
    const mainImgFile = document.getElementById("main-image").files[0];
    const reader = new FileReader();
  
    //If an image is loaded convert to string and excecute fetch
    if (mainImgFile) {
      reader.readAsDataURL(mainImgFile);
      reader.onload = function() {
        //Get the string data of the file
        const mainImgData = reader.result;
        editFetchRequest(globalTiles[index].id, mainImgData);
      }
    }
    // Execute edit with old image
    else {
      editFetchRequest(globalTiles[index].id, globalTiles[index].mainImg);
    }

    //Fetch request
    function editFetchRequest(idData, mainImgData){
      //Get the form data
      const titleData = document.getElementById("title").value;
      const addressData = document.getElementById("address").value;
      const zipData = document.getElementById("zip").value;
      const priceData = document.getElementById("price").value;
      const distanceData = document.getElementById("distance").value;
      const contactData = document.getElementById("contact").value;
      const descData = document.getElementById("description").value;
  
      //Create the object where we store data
      const postData = {
        id: idData,
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
      fetch('https://lnooc9yf83.execute-api.us-east-2.amazonaws.com/post', {
        method: 'POST',
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

// Function to return to main menu
function back(){
  location.reload(true);
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
  document.cookie = "username=; path=/;";
  location.reload();
}

// Check cookies for debugging
function checkCookies(){
  console.log(document.cookie);
}

function userCheck(){
  if(getUsername() !== ''){
    document.getElementById('login-button').remove()

    const topbar = document.getElementById("topbar");

    //Make logout element
    const logout = document.createElement("a");
    logout.innerHTML = "Logout"
    logout.setAttribute("onclick", "signOut()");  

    const post = document.createElement("a");
    post.innerHTML = "Post";
    post.setAttribute("href", "../PostPage/PostPage.html");  

    topbar.appendChild(logout);
    topbar.appendChild(post);
  }
}