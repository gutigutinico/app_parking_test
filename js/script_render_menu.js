axios.defaults.headers.common['Authorization'] = 'Bearer ' + (localStorage.getItem("token_jwt_parking") == null?"":localStorage.getItem("token_jwt_parking"));

function getHTMLMenuApp(inyect) {
    return `
    <div class="modal fade" id="seleccion_sede_modal" tabindex="-1" aria-labelledby="seleccion_sede_modalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header bg-dark text-white">
                <h1 class="modal-title fs-5" id="seleccion_sede_modalLabel">Seleccionar sede</h1>
            </div>
            <div class="modal-body">
                <div class="row" id="loader_carga_seleccion_sede">
                    <div class="col-md-12 d-flex text-center align-items-center">
                        <div class="col-md-12 text-center">
                            <div class="spinner-grow text-dark" role="status">
                                <span class="sr-only"></span>
                            </div>
                            <div class="spinner-grow text-dark" role="status">
                                <span class="sr-only"></span>
                            </div>
                            <div class="spinner-grow text-dark" role="status">
                                <span class="sr-only"></span>
                            </div>
                            <div class="spinner-grow text-dark" role="status">
                                <span class="sr-only"></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="list-group" id="lista_seleccion_sede">
                </div>
            </div>
            <div class="modal-footer d-flex justify-content-center">
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Cerrar</button>
            </div>
            </div>
        </div>
    </div>

    <nav class="navbar navbar-dark bg-dark fixed-top">
        <div class="container-fluid">
            <a class="navbar-brand" href="./../index.html"><img style="width: 80%;"
                                    src="https://www.uniminuto.edu/sites/default/files/logo-para-web-2024.png"
                                    alt="Imagen de ejemplo"></a>
            <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar">
            <span class="navbar-toggler-icon"></span>
            </button>
            <div class="offcanvas offcanvas-end text-bg-dark" tabindex="-1" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
            <div class="offcanvas-header">
                <img style="width: 80%;"
                                    src="https://www.uniminuto.edu/sites/default/files/logo-para-web-2024.png"
                                    alt="Imagen de ejemplo">
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
                <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
                    ${inyect}
                </ul>
            </div>
            </div>
        </div>
    </nav>`;
}

function renderItemAdmin(nameUser){
    let inyect = "";

    inyect += `
            <li class="nav-item">
                <a class="nav-link active" href="javascript:void(0)" onclick="abriModalSeleccionarSede()"><span>&nbsp;●&nbsp;</span> Seleccionar sede</a>
            </li>`
    inyect += `<li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <span>&nbsp;●&nbsp;</span> Usuarios
                    </a>
                    <ul class="dropdown-menu dropdown-menu-dark">
                        <li><a class="dropdown-item" href="${ROOT_DIR}user/create.html"> <span>➕</span> Nuevo usuario</a></li>
                    </ul>
                </li>`
    inyect += `<li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        👨‍💻 ${nameUser}
                    </a>
                    <ul class="dropdown-menu dropdown-menu-dark">
                        <li class="nav-item">
                            <span class="nav-link active" style='color: black;'>&nbsp;&nbsp;&nbsp;&nbsp;Perfil de administrador</span>
                        </li>
                        <li><a class="dropdown-item" href="javascript:void(0)" onclick="cerrarSesion()"> <span>➥</span> Cerrar sesion</a></li>
                    </ul>
                </li>`
    return inyect;
}



function seleccionarSede(idSede){
    $('#seleccion_sede_modal').modal('hide');
    document.querySelector("button[data-bs-dismiss='offcanvas']").click();
    localStorage.setItem("sede_seleccionada", idSede);
    obtenerInfoSede()
}

function abriModalSeleccionarSede(){
    $('#seleccion_sede_modal').modal('show');
    let text = ``
    document.querySelector("#loader_carga_seleccion_sede").style.display = "flex"
    document.querySelector("#lista_seleccion_sede").innerHTML=""
    axios({
        method: 'get',
        url: API_URL_SCHEMA.replace("{SERVICE}", "sedes/lista")
      }).then((response) => {
        try{
          response.data.forEach(elemento => {
            text += `<a href="javascript:void(0)" class="list-group-item list-group-item-action" onclick="seleccionarSede(${elemento.id})"><h3 class="modal-title fs-5" id="seleccion_sede_modalLabel"><b>${elemento.nombre}</b></h3><p>${elemento.direccion}</p></a>`
          });
          document.querySelector("#lista_seleccion_sede").insertAdjacentHTML("beforeend", text)
          document.querySelector("#loader_carga_seleccion_sede").style.display = "none"
        }catch(e){
            console.log(e)
        }

      }).catch(function (error) {
        
      });
      
}
function renderItemPortero(nameUser){
    let inyect = "";
    inyect += `
        <li class="nav-item">
            <a class="nav-link active" href="javascript:void(0)" onclick="abriModalSeleccionarSede()"><span>&nbsp;●&nbsp;</span> Seleccionar sede</a>
        </li>`

    inyect += `<li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        👨‍💻 ${nameUser}
                    </a>
                    <ul class="dropdown-menu dropdown-menu-dark">
                        <li class="nav-item">
                            <span class="nav-link active" style='color: black;'>&nbsp;&nbsp;&nbsp;&nbsp;Perfil de portero</span>
                        </li>
                        <li><a class="dropdown-item" href="javascript:void(0)" onclick="cerrarSesion()"> <span>🔐</span> Cerrar sesion</a></li>
                    </ul>
                </li>`
    return inyect;
}

function cerrarSesion(){
    localStorage.removeItem("token_jwt_parking")
    location.href = ROOT_DIR+'index.html'
}


function renderMenu(role, nameUser) {
    const typeRender = {1:renderItemAdmin, 2: renderItemPortero }
    document.querySelector("#app_menu").innerHTML = getHTMLMenuApp(typeRender[role](nameUser));
    setTimeout(()=>{
        document.querySelector('#app_menu nav').classList.add('show')
    },50)
}

function cargaInterfazControlDashboardNormal(text){
    
    insert = `<hr>
    <div class="container">
        <div class="row d-flex justify-content-center align-items-center">
            <div class="col-md-4 mb-3 text-center">
                <button class="btn btn-primary" type="button" onclick="location.reload()">Recargar panel</button>
            </div>
               
    `

    document.querySelector("#controles").innerHTML = ""

    if(role == 2 && text != ""){
        insert += `
                <div class="col-md-4 mb-3 text-center">
                    <button onclick="limpliarFormulariosEntradasSalidas('placa_vehiculo_entrada','cuerpo_modal_vehiculo_entrada')" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#formulario_entrada">
                        Entrada de vehiculo
                    </button>
                </div>
                <div class="col-md-4 mb-3 text-center">
                    <button onclick="limpliarFormulariosEntradasSalidas('placa_vehiculo_salida','cuerpo_modal_vehiculo_salida')" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#formulario_salida">
                        Salida de vehiculo
                    </button>
                </div>
            </div>
        </div>
        `
    }else{
        insert += `
            </div>
        </div>
        `
    }

    document.querySelector("#controles").insertAdjacentHTML('beforeend', insert)

}

function limpliarFormulariosEntradasSalidas(campo, content){
    console.log([campo, content])
    document.getElementById(campo).value = "";
    document.getElementById(content).innerHTML = ""
}

function cerrarElOtroCollapse(otro){
    const elemento = document.getElementById(otro);
    if (elemento.classList.contains("show")) {
        
        elemento.classList.remove("show")

    }
}

function cargarEstadoDeOcupacionSegunSede(){

    document.querySelector("#dashboard_por_sede_vehiculos").innerHTML = ""
    document.querySelector("#loader_carga_dashboard_sede").style.display = "flex"
    axios({
        method: 'get',
        url: API_URL_SCHEMA.replace("{SERVICE}", "sedes/ocupacion/"+localStorage.getItem("sede_seleccionada"))
    }).then((response) => {
    try{

        const tipoIcon = function (text){
            if(text == "Moto"){
                return "fa-motorcycle";
            }
            if(text == "Carro"){
                return "fa-car";
            }
            return "";
        }

        const porcentaje = function(a, b){
            if(b == 0){
                return 0
            }else{
                return parseInt(100 * a /b)
            }
        }
        let text = ""
        response.data.forEach(elemento => {
            text += `<div class="col-md-6 mb-4">
                <div class="card border-left-info shadow h-100 py-2">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-info text-uppercase mb-3 text-center"><h4>${elemento.tipo_de_vehiculo.tipo}s</h4></div>
                                
                                <div class="row no-gutters align-items-center">
                                    <div class="col mr-3 mb-2">
                                        <div class="text-xs font-weight-bold text-success text-uppercase mb-1">Disponibilidad</div>
                                        <div class="h5 mb-0 font-weight-bold text-gray-800">${ elemento.sede_x_tipo_vehiculo.maximo - elemento.gestion_entrada_salida }</div>
                                    </div>
                                    <div class="col mr-3 mb-2">
                                    <div class="text-xs font-weight-bold text-success text-uppercase mb-1">Capacidad</div>
                                    <div class="h5 mb-0 font-weight-bold text-gray-800">${elemento.sede_x_tipo_vehiculo.maximo}</div>
                                    </div>
                                    <div class="col mr-3 mb-2">
                                        <div class="text-xs font-weight-bold text-success text-uppercase mb-1">Uso</div>
                                        <div class="h5 mb-0 font-weight-bold text-gray-800">${elemento.gestion_entrada_salida}</div>
                                    </div>
                                    <div class="col mr-3 mb-2">
                                        <div class="text-xs font-weight-bold text-success text-uppercase mb-1">Uso (%)</div>
                                        <div class="h5 mb-0 mr-3 font-weight-bold text-gray-800">${porcentaje(elemento.gestion_entrada_salida, elemento.sede_x_tipo_vehiculo.maximo)}%</div>
                                    </div>
                                    <div class="col">
                                        <div class="progress progress-sm mr-2">
                                            <div class="progress-bar bg-info" role="progressbar" style="width: ${porcentaje(elemento.gestion_entrada_salida, elemento.sede_x_tipo_vehiculo.maximo)}%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-auto">
                                <i class="fas ${tipoIcon(elemento.tipo_de_vehiculo.tipo)} fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
        })
        if(text == ""){
            document.querySelector("#dashboard_por_sede_vehiculos").insertAdjacentHTML("beforeend", "<b class='text-center'>No tipos de vehiculos parametrizados para esta sede</b>")
        }else{
            document.querySelector("#dashboard_por_sede_vehiculos").insertAdjacentHTML("beforeend", text)
        }
        document.querySelector("#loader_carga_dashboard_sede").style.display = "none"
        cargaInterfazControlDashboardNormal(text)
    }catch(e){
    
    }
    }).catch(function (error) {
    
    });
}
