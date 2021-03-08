if(localStorage.getItem('refreshToken') || localStorage.getItem('token')){
    location.href = '/home'
  }