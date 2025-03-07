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
