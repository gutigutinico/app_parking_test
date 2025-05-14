axios.defaults.headers.common['Authorization'] = 'Bearer ' + (localStorage.getItem("token_jwt_parking") == null?"":localStorage.getItem("token_jwt_parking"));
let role = null;
axios({
    method: 'get',
    url: API_URL_SCHEMA.replace("{SERVICE}", "auth/roles")
  }).then((response) => {
    let text = document.querySelector("#id_tipo_usuario").innerHTML;
    response.data.data.forEach((item, index)=> {
        text += `<option value=${item.id}>${item.nombre}</option>` 
    })
    document.querySelector("#id_tipo_usuario").innerHTML = text;
}).catch(function (error) {
    
});

axios({
    method: 'get',
    url: API_URL_SCHEMA.replace("{SERVICE}", "auth/verify_view")+"/register_user"
  }).then((response) => {
    try{
        if(response.data.Autorizado === true){
            document.querySelector("#style_add").innerHTML = "<style>body {align-items: unset !important;}</style>";
            document.querySelector("body").style.paddingTop = "130px";
            document.querySelector("#loader_service").style.display = "none";
            document.querySelector("#app").style.display = "flex";
            setTimeout(()=>{
                role = response.data.role;
                renderMenu(response.data.role, response.data.name)
                document.querySelectorAll('.style-app-container')[1].classList.add('show')
            }, 50)
        }else{
            location.href = ROOT_DIR+'index.html'
        }
    }catch(e){

    }
}).catch(function (error) {
    
});

document.querySelector("#ingresar").addEventListener("click", () => {
    axios({
        method: 'post',
        url: API_URL_SCHEMA.replace("{SERVICE}", "auth/register"),
        data: {
            email: document.querySelector("#email").value,
            id_tipo_usuario: document.querySelector("#id_tipo_usuario").value,
            name: document.querySelector("#name").value,
            password: document.querySelector("#password").value,
            c_password: document.querySelector("#c_password").value
        }
    }).then((response) => {
        Swal.fire({
            title: "<br></br>✅"+response.data.message,
            text: "",
            icon: '',
            confirmButtonText: 'Cerrar'
        })
        document.querySelector("#email").value = "";
        document.querySelector("#id_tipo_usuario").value = "";
        document.querySelector("#name").value = "";
        document.querySelector("#password").value = "";
        document.querySelector("#c_password").value = "";
    }).catch(function (error) {
        console.log(error)
        try {
            if (error.response.data.errors !== undefined) {
                let text = "<br></br>";
                for (let clave in error.response.data.errors){
                    error.response.data.errors[clave].forEach((item, ind) =>{
                        text += "🔍"+item+"<br></br>"
                    })
                }
                Swal.fire({
                    title: text,
                    text: "",
                    icon: '',
                    confirmButtonText: 'Cerrar'
                })
            }
        } catch (error_) { }
    });
})