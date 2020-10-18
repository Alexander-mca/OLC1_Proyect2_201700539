function doClick() {
    var el = document.getElementById("file-input");
    if (el) {
      el.click();
    }
  }
function leerArchivo(e) {
    var archivo = e.target.files[0];
    if (!archivo) {
      return;
    }
    var lector = new FileReader();
    lector.onload = function(e) {
      var contenido = e.target.result;
      mostrarContenido(contenido);
    };
    lector.readAsText(archivo);
  }
  
  function mostrarContenido(contenido) {
    var elemento = document.getElementById('javatext');
    elemento.innerHTML = contenido;
  }
var _validFileExtensions = [".java", ".mia", ".txt"];    
function ValidateSingleInput(oInput) {
       if (oInput.type == "file") {
           var sFileName = oInput.value;
           var extension=sFileName.split(".")
            if (sFileName.length > 0) {
               var blnValid = false;
               for (var j = 0; j < _validFileExtensions.length; j++) {
                   var sCurExtension = _validFileExtensions[j];
                   if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
                       blnValid = true;
                       break;
                   }
               }
                
               if (!blnValid) {
                   alert("Lo sentimos; pero '." + extension[1] + "' no es una extension valida, extensiones validas: " + _validFileExtensions.join(", "));
                   oInput.value = "";
                   return false;
               }else{
                leerArchivo(oInput);
               }
           }
       }
}

//   document.getElementById('file-input')
//     .addEventListener('change', ValidateSingleInput, false);