function setCookie(username) {
  document.cookie = "username=" + username + "; path =/";
  console.log(document.cookie);
}

//Send login data to console
function sendLoginData() {
  usernameData = document.getElementById("username").value;
  passwordData = document.getElementById("password").value;

  console.log(usernameData, passwordData);

  fetch('https://94mzjd1j0h.execute-api.us-east-2.amazonaws.com/post', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify({
      email: usernameData,
      password: passwordData
    })
  }).then(resp => {
    // Error handling
    if (resp.ok) {

      return resp.json();
    } 
    else {
      console.log('Fail');
    }
  }).then(data => {
    console.log(data);
    if(data.result === true){
      console.log('Success');
      setCookie(usernameData);
      window.location = "../ListingPage/ListingPage.html";
    } else {
      document.getElementById("error").innerText = "Email or password wrong... Try again";
    }
  });
}

// API call for user registration
function userRegistration() {
  console.log("User Registration called");
  email = document.getElementById('register-email').value;
  password = document.getElementById('register-password').value;

  console.log(email, password);
  fetch('https://ac8j8y6b40.execute-api.us-east-2.amazonaws.com/put', { 
  method: 'PUT',
  headers: {
    'Content-type': 'application/json; charset=UTF-8'
  },
  body: JSON.stringify({
    email: email,
    password: password
  })
}).then(resp => {
  // Error handling
  if (resp.ok) {
    return resp.json();
  } 
  else {
    console.log('Fail');
  }
}).then(data => {
  console.log(data);
  if(data.result === true){
    console.log('Success');
    window.location = "../LoginPage/LoginPage.html";
  } else if(data.result === false) {
    document.getElementById("title-reg").innerText = "Email already exists";
  }
});
}
