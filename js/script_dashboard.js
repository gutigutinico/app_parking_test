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

function obtenerVehiculo(tipo,contentTipo){
  let placa = document.getElementById(tipo).value.trim().toUpperCase();
  document.getElementById(contentTipo).innerHTML = ""
  if(placa != "" && !placa.includes(".") && !placa.includes("/") && !placa.includes("\\")){
    document.getElementById(contentTipo).innerHTML = `
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
      </div>`
    axios({
        method: 'get',
        url: API_URL_SCHEMA.replace("{SERVICE}", "sedes/obtenerVehiculo/"+placa+"/"+localStorage.getItem("sede_seleccionada"))
    }).then((response) => {
      try{
        let elemento = response.data
        document.getElementById(contentTipo).innerHTML = ""
        if(elemento.vehiculo_x_propietario != undefined && elemento.vehiculo_x_propietario != null){
          let tempText = `
          <div class="container">
            <div class="row">
              <div class="col-md-4 text-center">
                  <div class='row'>
                    <div class="col-md-12 text-center bg-dark text-white">
                      Vehiculo
                    </div>  
                    <div class="col-md-12 text-center">
                        ${elemento.vehiculo_x_propietario.vehiculo.placa}<br>
                        ${elemento.vehiculo_x_propietario.vehiculo.tipo_vehiculo.tipo}
                    </div>  
                  </div>  
                </div>
                <div class="col-md-4 text-center">
                  <div class='row'>
                    <div class="col-md-12 text-center bg-dark text-white">
                      Propietario
                    </div>  
                    <div class="col-md-12 text-center">
                        ${elemento.vehiculo_x_propietario.propietario.nombre}<br>
                        ${elemento.vehiculo_x_propietario.propietario.tipo_documento?.sigla || '' } ${elemento.vehiculo_x_propietario.propietario.numero_documento || ''}`
          if((elemento.vehiculo_x_propietario.propietario.codigo || '') ==''){

          }else{
            tempText += `<br>Id: ${elemento.vehiculo_x_propietario.propietario.codigo} `
            
          }
          
          tempText += `</div>  
                  </div>  
                </div>
                <div class="col-md-4 text-center">
                  <div class='row'>
                    <div class="col-md-12 text-center bg-dark text-white">
                      Contacto del propietario
                    </div>  
                    <div class="col-md-12 text-center">
                        ${elemento.vehiculo_x_propietario.propietario.correo_electronico}<br>
                        ${elemento.vehiculo_x_propietario.propietario.numero_contacto}<br>
                    </div>  
                  </div>  
                </div>
              </div>
          </div>`

          document.getElementById(contentTipo).innerHTML = tempText
          if(elemento.estado_estacinamiento == null){
            if(contentTipo == 'cuerpo_modal_vehiculo_entrada'){
              document.getElementById(contentTipo).insertAdjacentHTML("beforeend", `
                <hr>
                <div class="container">
                  <div class="row d-flex justify-content-center align-items-center">
                    <div class="col-md-12 mb-3 text-center" id="control_registrar_boton_entrada_vehiculo">
                        <button class="btn btn-success" type="button" onclick="entradaVehiculo('${elemento.vehiculo_x_propietario.placa}',${elemento.vehiculo_x_propietario.id} )">Registrar entrada del vehiculo</button>
                    </div>
                  </div>
                </div>
                <div class="col-md-12 d-flex text-center align-items-center">
                    <div class="col-md-12 text-center" id="control_loader_registrar_boton_entrada_vehiculo" style='display:none !important'>
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
              `)
            }else if(contentTipo == 'cuerpo_modal_vehiculo_salida'){
              document.getElementById(contentTipo).insertAdjacentHTML("afterbegin", `
                <div class="alert alert-warning text-center" role="alert">
                  Este vehiculo no ha entrado en las instalaciones
                </div>
              `)
            }
          }else{
            if(contentTipo == 'cuerpo_modal_vehiculo_entrada'){
              document.getElementById(contentTipo).insertAdjacentHTML("afterbegin", `
                <div class="alert alert-warning text-center" role="alert">
                  Este vehiculo esta dentro de las instalaciones
                  <br><b>Ingreso el vehiculo</b><br> ${elemento.estado_estacinamiento.hora_de_ingreso}
                </div>
              `)
            }else if(contentTipo == 'cuerpo_modal_vehiculo_salida'){
              document.getElementById(contentTipo).insertAdjacentHTML("beforeend", `
                <hr>
                <div class="container">
                  <div class="row d-flex justify-content-center align-items-center">
                    <div class="col-md-12 mb-3 text-center" id="control_registrar_boton_salida_vehiculo">
                        <button class="btn btn-success" type="button" onclick="salidaVehiculo('${elemento.vehiculo_x_propietario.placa}',${elemento.vehiculo_x_propietario.id} )">Registrar salida del vehiculo</button>
                    </div>
                  </div>
                </div>
                <div class="col-md-12 d-flex text-center align-items-center">
                    <div class="col-md-12 text-center" id="control_loader_registrar_boton_salida_vehiculo" style='display:none !important'>
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
              `)
            }
          }
        }else{
          if(contentTipo == 'cuerpo_modal_vehiculo_entrada'){

            let text = ``;
            //HOY
            
            text += `<div class="row bg-dark text-white text-center shadow mb-3">
                        <h4 style='margin-top: .5rem;'>Información del vehiculo</h4>
                    </div>`;
            
            if(elemento.vehiculo == null){
              text += `
                  <div class="row">
                      <div class="mb-3 col-lg-6">
                        <label for="registro_tipo_vehiculo" class="form-label">Tipo de vehiculo <span style='color:red'>(*)</span></label>
                        <select id="registro_tipo_vehiculo" class="form-select">
                          <option value=''>Seleccione el tipo de vehiculo</option>
                          ${elemento.tipo_vehiculo.map((value)=> `<option value='${value.id}'>${value.tipo}</option>`)}
                        </select>
                      </div>
                      <div class="mb-3 col-lg-6">
                        <label for="registro_placa_vehiculo" class="form-label">Placa del vehiculo <span style='color:red'>(*)</span></label>
                        <input type="text" class="form-control" id="registro_placa_vehiculo" value='${placa}' disabled>
                      </div>
                  </div>`;
            }else{
              text += `
                  <div class="row">
                      <div class="mb-3 col-lg-6">
                        <label for="registro_tipo_vehiculo" class="form-label">Tipo de vehiculo <span style='color:red'>(*)</span></label>
                        <input type="text" class="form-control" id="registro_tipo_vehiculo" value='${elemento.vehiculo.tipo_vehiculo.tipo}' disabled>
                      </div>
                      <div class="mb-3 col-lg-6">
                        <label for="registro_placa_vehiculo" class="form-label">Placa del vehiculo <span style='color:red'>(*)</span></label>
                        <input type="text" class="form-control" id="registro_placa_vehiculo" value='${elemento.vehiculo.placa}' disabled>
                      </div>
                  </div>`;
            }
            text += `<div class="row bg-dark text-white text-center shadow mb-3">
                        <h4 style='margin-top: .5rem;'>Información del propietario</h4>
                    </div>`;
            text += `
            <div class="row">
                <div class="mb-3 col-lg-6">
                  <label for="registro_tipo_documento" class="form-label">Tipo de documento <span style='color:red'>(*)</span></label>
                  <select id="registro_tipo_documento" class="form-select">
                    ${elemento.tipo_documento.map((value)=> `<option value='${value.id}'>${value.nombre}</option>`)}
                  </select>
                </div>
                <div class="mb-3 col-lg-6">
                  <label for="registro_numero_documento" class="form-label">Numero de documento <span style='color:red'>(*)</span></label>
                  <input type="text" class="form-control" id="registro_numero_documento">
                </div>
            </div>`;
            text += `
            <div class="row">
                <div class="mb-3 col-lg-6">
                  <label for="registro_id" class="form-label">ID <span style='color:red'>(*)</span></label>
                  <input type="text" class="form-control" id="registro_id">
                </div>
                <div class="mb-3 col-lg-6">
                  <label for="registro_nombre" class="form-label">Nombres y apellidos <span style='color:red'>(*)</span></label>
                  <input type="text" class="form-control" id="registro_nombre">
                </div>
            </div>`;
            text += `
            <div class="row">
                <div class="mb-3 col-lg-6">
                  <label for="registro_correo" class="form-label">Correo electronico <span style='color:red'>(*)</span></label>
                  <input type="text" class="form-control" id="registro_correo">
                </div>
                <div class="mb-3 col-lg-6">
                  <label for="registro_numero_contacto" class="form-label">Numero de contacto <span style='color:red'>(*)</span></label>
                  <input type="text" class="form-control" id="registro_numero_contacto">
                </div>
            </div>`;
            text += `
              <div class="container">
                <div class="row d-flex justify-content-center align-items-center">
                  <div class="col-md-12 mb-3 text-center" id="control_registrar_boton_entrada_vehiculo">
                      <button class="btn btn-success" type="button" onclick="registrarPropietarioYvehiculo()">Registrar vehiculo, propietario y entrada al establecimiento</button>
                  </div>
                </div>
              </div>
              <div class="col-md-12 d-flex text-center align-items-center">
                  <div class="col-md-12 text-center" id="control_loader_registrar_boton_entrada_vehiculo" style='display:none !important'>
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
            `
            document.getElementById(contentTipo).insertAdjacentHTML("beforeend", text)
          }else if(contentTipo == 'cuerpo_modal_vehiculo_salida'){
            document.getElementById(contentTipo).insertAdjacentHTML("afterbegin", `
              <div class="alert alert-warning text-center" role="alert">
                Este vehiculo no esta registrado en el sistema, el registro de un nuevo vehiculo se hace en la entrada.
              </div>
            `)
          }
        }
      }catch(e){
        console.log(e)
      }
    }).catch(function (error) {
    });
  }
}

function salidaVehiculo(placa, id){

  document.querySelector("#formulario_salida button[aria-label='Close']").disabled = true;
  document.querySelector("#placa_vehiculo_salida").disabled = true;
  document.querySelector("#boton_buscar_para_salida_vehiculo").disabled = true;

  document.querySelector("#control_loader_registrar_boton_salida_vehiculo").style.display = "block";
  document.querySelector("#control_registrar_boton_salida_vehiculo").style.display = "none";

  axios({
      method: 'post',
      url: API_URL_SCHEMA.replace("{SERVICE}", "sedes/salidaVehiculo/"+id+"/"+localStorage.getItem("sede_seleccionada"))
  }).then((response) => {
    try{
      if(response.data == "Ok"){
        Swal.fire({
          title: "Se registro la salida del vehiculo con placa "+ placa,
          text: '',
          icon: 'success',
          confirmButtonText: 'Cerrar',
          allowOutsideClick: false
        })
      }else{
        Swal.fire({
          title: response.data,
          text: '',
          icon: 'warning',
          confirmButtonText: 'Cerrar',
          allowOutsideClick: false
        })
      }
      document.querySelector("#formulario_salida button[aria-label='Close']").disabled = false;
      document.querySelector("#placa_vehiculo_salida").disabled = false;
      document.querySelector("#boton_buscar_para_salida_vehiculo").disabled = false;
      document.querySelector("#formulario_salida button[aria-label='Close']").click()
      cargarEstadoDeOcupacionSegunSede()
    }catch(e){
      Swal.fire({
        title: "No es posible procesar la salida del vehiculo en estos momentos",
        text: '',
        icon: 'error',
        confirmButtonText: 'Cerrar',
        allowOutsideClick: false
      })
    }
  }).catch(function (error) {
    document.querySelector("#formulario_salida button[aria-label='Close']").disabled = false;
    document.querySelector("#placa_vehiculo_salida").disabled = false;
    document.querySelector("#boton_buscar_para_salida_vehiculo").disabled = false;

    document.querySelector("#control_loader_registrar_boton_salida_vehiculo").style.display = "none";
    document.querySelector("#control_registrar_boton_salida_vehiculo").style.display = "block";
    Swal.fire({
      title: "No es posible procesar la salida del vehiculo en estos momentos",
      text: '',
      icon: 'error',
      confirmButtonText: 'Cerrar',
      allowOutsideClick: false
    })
  });
}

function entradaVehiculo(placa, id){

  document.querySelector("#formulario_entrada button[aria-label='Close']").disabled = true;
  document.querySelector("#placa_vehiculo_entrada").disabled = true;
  document.querySelector("#boton_buscar_para_entrada_vehiculo").disabled = true;

  document.querySelector("#control_loader_registrar_boton_entrada_vehiculo").style.display = "block";
  document.querySelector("#control_registrar_boton_entrada_vehiculo").style.display = "none";

  axios({
      method: 'post',
      url: API_URL_SCHEMA.replace("{SERVICE}", "sedes/entradaVehiculo/"+id+"/"+localStorage.getItem("sede_seleccionada"))
  }).then((response) => {
    try{
      if(response.data == "Ok"){
        Swal.fire({
          title: "Se registro la entrada del vehiculo con placa "+ placa,
          text: '',
          icon: 'success',
          confirmButtonText: 'Cerrar',
          allowOutsideClick: false
        })
      }else{
        Swal.fire({
          title: response.data,
          text: '',
          icon: 'warning',
          confirmButtonText: 'Cerrar',
          allowOutsideClick: false
        })
      }
      document.querySelector("#formulario_entrada button[aria-label='Close']").disabled = false;
      document.querySelector("#placa_vehiculo_entrada").disabled = false;
      document.querySelector("#boton_buscar_para_entrada_vehiculo").disabled = false;
      document.querySelector("#formulario_entrada button[aria-label='Close']").click()
      cargarEstadoDeOcupacionSegunSede()
    }catch(e){
      Swal.fire({
        title: "No es posible procesar la entrada del vehiculo en estos momentos",
        text: '',
        icon: 'error',
        confirmButtonText: 'Cerrar',
        allowOutsideClick: false
      })
    }
  }).catch(function (error) {
    document.querySelector("#formulario_entrada button[aria-label='Close']").disabled = false;
    document.querySelector("#placa_vehiculo_entrada").disabled = false;
    document.querySelector("#boton_buscar_para_entrada_vehiculo").disabled = false;

    document.querySelector("#control_loader_registrar_boton_entrada_vehiculo").style.display = "none";
    document.querySelector("#control_registrar_boton_entrada_vehiculo").style.display = "block";
    Swal.fire({
      title: "No es posible procesar la entrada del vehiculo en estos momentos",
      text: '',
      icon: 'error',
      confirmButtonText: 'Cerrar',
      allowOutsideClick: false
    })
  });
}


function registrarPropietarioYvehiculo(){

  document.querySelector("#formulario_entrada button[aria-label='Close']").disabled = true;
  document.querySelector("#placa_vehiculo_entrada").disabled = true;
  document.querySelector("#boton_buscar_para_entrada_vehiculo").disabled = true;

  document.querySelector("#control_loader_registrar_boton_entrada_vehiculo").style.display = "block";
  document.querySelector("#control_registrar_boton_entrada_vehiculo").style.display = "none";

  document.querySelector("#registro_tipo_vehiculo").disabled = true
  document.querySelector("#registro_placa_vehiculo").disabled = true
  document.querySelector("#registro_tipo_documento").disabled = true
  document.querySelector("#registro_numero_documento").disabled = true
  document.querySelector("#registro_id").disabled = true
  document.querySelector("#registro_nombre").disabled = true
  document.querySelector("#registro_correo").disabled = true
  document.querySelector("#registro_numero_contacto").disabled = true

  let placa = document.querySelector("#registro_placa_vehiculo").value.trim().toUpperCase()
  axios({
      method: 'post',
      url: API_URL_SCHEMA.replace("{SERVICE}", "sedes/entradaVehiculoYPropietario/"+localStorage.getItem("sede_seleccionada")),
      data: {
        registro_tipo_vehiculo: document.querySelector("#registro_tipo_vehiculo").value.trim().toUpperCase(), 
        registro_placa_vehiculo: placa,
        registro_tipo_documento: document.querySelector("#registro_tipo_documento").value.trim().toUpperCase(),
        registro_numero_documento: document.querySelector("#registro_numero_documento").value.trim().toUpperCase(),
        registro_id: document.querySelector("#registro_id").value.trim().toUpperCase(),
        registro_nombre: document.querySelector("#registro_nombre").value.trim().toUpperCase(),
        registro_correo: document.querySelector("#registro_correo").value.trim().toUpperCase(),
        registro_numero_contacto: document.querySelector("#registro_numero_contacto").value.trim().toUpperCase()
      }
  }).then((response) => {
    try{
      if(response.data == "Ok"){
        Swal.fire({
          title: "Se registro la entrada del vehiculo con placa "+ placa,
          text: '',
          icon: 'success',
          confirmButtonText: 'Cerrar',
          allowOutsideClick: false
        })
      }else if(response.data  == "El codigo del estudiante le pertenece a otra persona"){
        Swal.fire({
          title: response.data,
          text: '',
          icon: 'warning',
          confirmButtonText: 'Cerrar',
          allowOutsideClick: false
        })
        document.querySelector("#registro_tipo_vehiculo").disabled = false
        document.querySelector("#registro_placa_vehiculo").disabled = false
        document.querySelector("#registro_tipo_documento").disabled = false
        document.querySelector("#registro_numero_documento").disabled = false
        document.querySelector("#registro_id").disabled = false
        document.querySelector("#registro_nombre").disabled = false
        document.querySelector("#registro_correo").disabled = false
        document.querySelector("#registro_numero_contacto").disabled = false
        document.querySelector("#placa_vehiculo_entrada").disabled = false;
        document.querySelector("#formulario_entrada button[aria-label='Close']").disabled = false;
        document.querySelector("#boton_buscar_para_entrada_vehiculo").disabled = false;
        document.querySelector("#control_loader_registrar_boton_entrada_vehiculo").style.display = "none";
        document.querySelector("#control_registrar_boton_entrada_vehiculo").style.display = "block";
        return;
      }else{
        Swal.fire({
          title: response.data,
          text: '',
          icon: 'warning',
          confirmButtonText: 'Cerrar',
          allowOutsideClick: false
        })
      }
      
      document.querySelector("#formulario_entrada button[aria-label='Close']").disabled = false;
      document.querySelector("#placa_vehiculo_entrada").disabled = false;
      document.querySelector("#boton_buscar_para_entrada_vehiculo").disabled = false;
      document.querySelector("#formulario_entrada button[aria-label='Close']").click()
      cargarEstadoDeOcupacionSegunSede()
    }catch(e){
      Swal.fire({
        title: "No es posible procesar la entrada del vehiculo en estos momentos",
        text: '',
        icon: 'error',
        confirmButtonText: 'Cerrar',
        allowOutsideClick: false
      })
      document.querySelector("#registro_tipo_vehiculo").disabled = false
      document.querySelector("#registro_placa_vehiculo").disabled = false
      document.querySelector("#registro_tipo_documento").disabled = false
      document.querySelector("#registro_numero_documento").disabled = false
      document.querySelector("#registro_id").disabled = false
      document.querySelector("#registro_nombre").disabled = false
      document.querySelector("#registro_correo").disabled = false
      document.querySelector("#registro_numero_contacto").disabled = false
    }
  }).catch(function (error) {
    document.querySelector("#formulario_entrada button[aria-label='Close']").disabled = false;
    document.querySelector("#placa_vehiculo_entrada").disabled = false;
    document.querySelector("#boton_buscar_para_entrada_vehiculo").disabled = false;

    document.querySelector("#control_loader_registrar_boton_entrada_vehiculo").style.display = "none";
    document.querySelector("#control_registrar_boton_entrada_vehiculo").style.display = "block";
    
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
  } catch (error_) {
    Swal.fire({
      title: "No es posible procesar la entrada del vehiculo en estos momentos",
      text: '',
      icon: 'error',
      confirmButtonText: 'Cerrar',
      allowOutsideClick: false
    })
   }
    
    document.querySelector("#registro_tipo_vehiculo").disabled = false
    document.querySelector("#registro_placa_vehiculo").disabled = false
    document.querySelector("#registro_tipo_documento").disabled = false
    document.querySelector("#registro_numero_documento").disabled = false
    document.querySelector("#registro_id").disabled = false
    document.querySelector("#registro_nombre").disabled = false
    document.querySelector("#registro_correo").disabled = false
    document.querySelector("#registro_numero_contacto").disabled = false
  });
}

obtenerInfoSede()