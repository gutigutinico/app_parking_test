axios.defaults.headers.common['Authorization'] = 'Bearer ' + (localStorage.getItem("token_jwt_parking") == null?"":localStorage.getItem("token_jwt_parking"));
let role = null;
axios({
  method: 'get',
  url: API_URL_SCHEMA.replace("{SERVICE}", "auth/verify_view")+"/dashboard"
}).then((response) => {
  try{
      if(response.data.Autorizado === true){
          document.querySelector("#loader_service").style.display = "none";
          document.querySelector("#app").style.display = "flex";
          setTimeout(()=>{
            document.querySelector("#style_add").innerHTML = "<style>body {align-items: unset !important;}</style>";
            document.querySelector("body").style.paddingTop = "130px";
            document.querySelectorAll('.style-app-container')[1].classList.add('show')
            role = response.data.role;
            renderMenu(response.data.role, response.data.name)
          }, 50)
      }else{
          location.href = ROOT_DIR+'index.html'
      }
  }catch(e){

  }
}).catch(function (error) {
  
});

function obtenerInfoSede(){
  document.querySelector("#quesedesoy").innerHTML = ""
  axios({
      method: 'get',
      url: API_URL_SCHEMA.replace("{SERVICE}", "sedes/info/"+localStorage.getItem("sede_seleccionada"))
  }).then((response) => {
    try{

      if(response.data == ""){
        document.querySelector("#quesedesoy").insertAdjacentHTML("beforeend",
          `<div class="text-center"><b class='text-center'>No ha seleccionado ninguna sede</b></div>`);
          document.querySelector("#loader_carga_dashboard_sede").style.display = "none"
          localStorage.setItem("sede_seleccionada", "")
      }else{
        document.querySelector("#quesedesoy").insertAdjacentHTML("beforeend",
        `<div class="container col-md-12">
            <div class="row shadow" style="margin-bottom: 3px;">
                <div class="col-md-4 bg-dark text-white">
                    <h5 class="text-center">Sede</h5>
                </div>
                <div class="col-md-7">
                    <h6 class="text-center">${response.data.nombre}</h6>
                </div>
            </div>

            <div class="row shadow">
                <div class="col-md-4 bg-dark text-white">
                    <h5 class="text-center">Dirección</h6>
                </div>
                <div class="col-md-7">
                    <h6 class="text-center">${response.data.direccion}</h6>
                </div>
            </div>
        </div>`);
        cargarEstadoDeOcupacionSegunSede()
      }
    }catch(e){
    
    }
  }).catch(function (error) {
  
  });
}


obtenerInfoSede()