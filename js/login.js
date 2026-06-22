function handleLogin() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorMsg = document.getElementById('error-msg');

  if (email === '' || password === '') {
    errorMsg.innerText = 'Please fill in both fields.';
    return;
  }

  if (email === 'sarah@mail.com' && password === 'pw123') {
    
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('userName', 'Sarah Ahmad');
    
    window.location.href = '../index.html';
  } else {
    errorMsg.innerText = 'Incorrect email or password.';
  }
}