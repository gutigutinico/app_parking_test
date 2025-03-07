axios({
    method: 'post',
    url: API_URL_SCHEMA.replace("{SERVICE}", "auth/verify"),
    data: {},
    headers:{
        'Authorization': 'Bearer ' + (localStorage.getItem("token_jwt_parking") == null?"":localStorage.getItem("token_jwt_parking"))
    }
  }).then((response) => {
    location.href = ROOT_DIR+"user/dashboard.html"
  }).catch(function (error) {
    document.querySelector("#loader_service").style.display = "none";
    document.querySelector("#app").style.display = "flex";
    setTimeout(()=>{
        document.querySelectorAll('.style-app-container')[1].classList.add('show');document.querySelectorAll('.style-app-container')[2].classList.add('show')
    }, 50)
});

document.querySelector("#ingresar").addEventListener("click", () => {
    axios({
        method: 'post',
        url: API_URL_SCHEMA.replace("{SERVICE}", "auth/login"),
        data: {
            email: document.querySelector("#usuario").value,
            password: document.querySelector("#clave").value
        }
    }).then((response) => {
        localStorage.setItem("token_jwt_parking", response.data.data.access_token)
        location.href = ROOT_DIR+"user/dashboard.html";
    }).catch(function (error) {
        console.log(error)
        try {
            if (error.response.data.message !== undefined) {
                Swal.fire({
                    title: error.response.data.message,
                    text: '',
                    icon: 'error',
                    confirmButtonText: 'Cerrar'
                })
            }
        } catch (error_) { }
    });
})


$("#usuario").keyup(function(event) {
    if (event.keyCode === 13) {
        $("#ingresar").click();
    }
});

$("#clave").keyup(function(event) {
    if (event.keyCode === 13) {
        $("#ingresar").click();
    }
});