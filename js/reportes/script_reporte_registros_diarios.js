axios.defaults.headers.common['Authorization'] = 'Bearer ' + (localStorage.getItem("token_jwt_parking") == null?"":localStorage.getItem("token_jwt_parking"));
let role = null;

axios({
    method: 'get',
    url: API_URL_SCHEMA.replace("{SERVICE}", "auth/verify_view")+"/report_register_daily"
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
    let fecha = document.querySelector("#fecha").value;
    let sedeSeleccionada = localStorage.getItem("sede_seleccionada");
    let valid = "";
    if(sedeSeleccionada == '' || sedeSeleccionada == null || sedeSeleccionada == undefined){
        valid += "🔍"+"No ha seleccionado la sede, seleccione la opción del menu"+"<br></br>"
    }
    if(fecha == null || fecha == ''){
        valid += "🔍"+"No ha seleccionado la fecha en el formulario"
    }

    if(valid != ""){
        Swal.fire({
            title: valid,
            text: "",
            icon: '',
            confirmButtonText: 'Cerrar'
        })
        return;
    }
    axios({
        method: 'post',
        url: API_URL_SCHEMA.replace("{SERVICE}", "reportes/registros_diarios"),
        responseType: 'blob',
        data: {
            fecha: fecha,
            sede: sedeSeleccionada
        }
    }).then((response) => {
        console.log(response)
        // Crear un enlace de descarga
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Reporte de registro diario '+fecha+".pdf"; // Nombre del archivo que se descargará
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url); // Limpiar memoria
    }).catch(function (error) {
        console.log(error)
        if(error.response.status == 404){
            Swal.fire({
                title: "🔍 No hay registro de entradas o salidas en la fecha de "+fecha,
                text: "",
                icon: '',
                confirmButtonText: 'Cerrar'
            })
        }
        
    });
})


function obtenerInfoSede(){
  document.querySelector("#quesedesoy").innerHTML = ""

  if(localStorage.getItem("sede_seleccionada") == '' || localStorage.getItem("sede_seleccionada") == null || localStorage.getItem("sede_seleccionada") == undefined){
    document.querySelector("#quesedesoy").insertAdjacentHTML("beforeend",
    `<div class="text-center"><b class='text-center'>No ha seleccionado ninguna sede</b></div>`);
    document.querySelector("#loader_carga_dashboard_sede").style.display = "none"
    localStorage.setItem("sede_seleccionada", '');
  }
  axios({
      method: 'get',
      url: API_URL_SCHEMA.replace("{SERVICE}", "sedes/info/"+localStorage.getItem("sede_seleccionada"))
  }).then((response) => {
    try{

      if(response.data == ""){
        
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
document.querySelector("#fecha").value = new Date().toISOString().split("T")[0];