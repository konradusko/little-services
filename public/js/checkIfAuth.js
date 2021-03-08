function check(urlPath) {
    fetch(urlPath, {
            method: 'post',
            headers: {
                "authorization": "Bearer " + localStorage.getItem('token'),
                "Content-type": "application/json"
            },
        })
        .then(response => response.json()) // convert to json
        .then((json) => {
            if (json.error && json.error.message == "invalid token" || json.error.message == "TokenNull") {
                //token niepoprawny usunac wgl tokeny i przekierowac do '/login'
                //lub tokena nie ma wcale
                localStorage.removeItem('token')
                //jeśli bedzie refresh token
                sendRefresh();
            } else if (json.error && json.error.message == "jwt expired") {
                //jesli token wygasł zobacz czy jest refresh i sprobuj refresh
                localStorage.removeItem('token')
                sendRefresh();

            } else if (!json.error) {
                //bez errora i normalnie generujemy stronke
                document.getElementById('content').innerHTML = json.template
                console.log(json)
                document.getElementById('test_menu').innerHTML = json.user
                notePadTrue()//uruchamia js dla notatnika
            } else {
                //jesli jakis inny error lub blad
                //usunac tokeny i na login
                localStorage.removeItem('token')
                localStorage.removeItem('refreshToken')
                location.href = '/login'
            }
        })
        .catch((err) => {
            // niewiadomy error
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
            location.href = '/login'
        }); // Catch errors
    function sendRefresh() {
        if (localStorage.getItem('refreshToken')) {
            //mamy refresh token i prosimy o inny token
            fetch('http://localhost:4000/refreshToken', {
                    method: 'post',
                    headers: {
                        "authorization": "Bearer " + localStorage.getItem('refreshToken'),
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({
                        path: urlPath
                    })
                })
                .then(response => response.json()) // convert to json
                .then((json) => {
                    // tutaj dostajemy nowy token i odrazu templatke
                    if (json.error) {
                        //nieprawidlowy token usuwamy stare i na /login
                        localStorage.removeItem('token')
                        localStorage.removeItem('refreshToken')
                        location.href = "/login"
                    } else if (json.token) {
                        //mamy nowy token i templatke
                        localStorage.setItem('token', json.token)
                        document.getElementById('content').innerHTML = json.template
                        console.log(json)
                        document.getElementById('test_menu').innerHTML = json.user
                        notePadTrue()//uruchamia js dla notatnika
                    }
                })
                .catch((err) => {
                    console.log('Request Failed', err)
                    localStorage.removeItem('token')
                    localStorage.removeItem('refreshToken')
                    location.href = '/login'
                }); // Catch errors
        } else {
            //nie ma refresh tokena ani zwyklego tokena
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
            location.href = '/login'
        }
    }
}