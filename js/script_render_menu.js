function getHTMLMenuApp(inyect) {
    return `<nav class="navbar navbar-dark bg-dark fixed-top">
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

function renderItemPortero(nameUser){
    let inyect = "";

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
