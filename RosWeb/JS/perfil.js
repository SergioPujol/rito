let perfil = null;
login().then((a)=>{console.log(a);perfil = a ;renderInfo(a);});
const fUsername = document.querySelector("#username")
const fFullName = document.querySelector("#full-name")
const fTelephone = document.querySelector("#telephone")
const fEmail = document.querySelector("#email")

const grUsername = document.querySelector("#gr-username")
const grFullName = document.querySelector("#gr-fullname")
const grTelephone = document.querySelector("#gr-telephone")
const grEmail = document.querySelector("#gr-email")

const modalTitle = document.querySelector("#profile-modal-title")
const modalLabel = document.querySelector("#profile-modal-label")
const inputEdit = document.querySelector("#inputEdit")

const editButton = document.querySelector("#edit")



const renderInfo = async(a)=>{
    fUsername.innerHTML = a.user.username;
    fFullName.innerHTML = a.user.name + " "+ a.user.surname;
    fTelephone.innerHTML = a.user.telephone.toString();
    fEmail.innerHTML = a.user.email;     
}

grUsername.addEventListener("click", (e)=>{
    editButton.tipoInput = "username";
    modalTitle.innerHTML = "Cambia tu nombre de usuario"
    modalLabel.innerHTML = "Nombre de usuario:"
    inputEdit.value = ""
    inputEdit.placeholder = perfil.user.username;
    console.log(perfil.user.username)
    $('#edit').modal()
})

grFullName.addEventListener("click", (e)=>{
    editButton.tipoInput = "full-name";
    modalTitle.innerHTML = "Cambia tu nombre"
    modalLabel.innerHTML = "Nombre:"
    inputEdit.value = ""
    inputEdit.placeholder = perfil.user.name + " "+ perfil.user.surname;
    console.log(perfil.user.name + " "+ perfil.user.surname)
    $("#edit").modal()
})

grTelephone.addEventListener("click", (e)=>{
    editButton.tipoInput = "telephone";
    modalTitle.innerHTML = "Cambia tu número de teléfono:"
    modalLabel.innerHTML = "Número de teléfono:"
    inputEdit.value = ""
    inputEdit.placeholder = perfil.user.telephone.toString();
    console.log(perfil.user.telephone.toString())
    $("#edit").modal()
})

grEmail.addEventListener("click", (e)=>{
    editButton.tipoInput = "email";
    modalTitle.innerHTML = "Cambia tu correo electrónico"
    modalLabel.innerHTML = "Correo:"
    inputEdit.value = ""
    inputEdit.placeholder = perfil.user.email;
    console.log(perfil.user.email)
    $("#edit").modal()
})

const editField = () => {
    let tipo = editButton.tipoInput;
    
    let newUser = perfil.user;
    if(tipo == "username"){
        newUser.username = inputEdit.value
    }else if(tipo == "full-name"){
        newUser.name = inputEdit.value.split(" ")[0];
        newUser.surname = inputEdit.value.split(" ")[1] || " ";
    }else if(tipo == "telephone"){
        newUser.telephone = inputEdit.value;
    }else if(tipo == "email"){
        newUser.email = inputEdit.value;
    }

    const perfilService = feathersClient.service('users');

    perfilService.patch(perfil.user._id, newUser);

    perfilService.on('patched', ()=>{login().then((a)=>{console.log(a);perfil = a ;renderInfo(a);$("#edit").modal('hide')});})

}