function AgregarVentana(){
  var tabs=document.getElementById('headerp');
  var tab=document.createElement('li');
  var atributo=document.createAttribute('class');
  atributo.value="nav-item";
  tab.setAttributeNode(atributo);

  var link=document.createElement('a');
  link.setAttribute("class","nav-link");
  link.setAttribute("data-toggle","tab");
  link.setAttribute("href","#tab"+cont);
  link.setAttribute("ondragend","eliminarTab(this);");
  link.setAttribute("onfocus","CambiarText(this);");
  link.innerText="tab"+cont;
  tab.appendChild(link);
  tabs.appendChild(tab);

  //se crea el textarea
  var content=document.getElementById('myTabContent');
  var div=document.createElement('div');
  div.setAttribute("class","tab-pane fade");
  div.setAttribute("id","tab"+cont);

  var text=document.createElement('textarea');
  text.setAttribute("id","pestania"+cont);
  text.setAttribute("rows","21");
  text.setAttribute("cols","60");
  div.appendChild(text);
  content.appendChild(div);
  cont2=cont;
  cont++;
  return link;
}
var pActual="tab1";
function CambiarText(e){
  var name=e.getAttribute('href');
  name=name.replace("#","");
  var content=document.getElementById("myTabContent");
  var tabs=content.children;
  for (let i = 0; i < tabs.length; i++) {
    const element = tabs[i];
    var id=element.getAttribute("id");
    if(id==name){
      pActual=id;
      break;
    }
    
  }
}
function eliminarTab(tab){

  var nombre=tab.getAttribute("href");
  var nombre2=nombre.replace("#","");
  var hijos=document.getElementById('headerp').children;
  for (let i = 0; i < hijos.length; i++) {
    const element = hijos[i];
    var id=element.children[0].getAttribute("href");
    if(id==nombre){
      element.remove();
      break;
    }   
  }
  var content=document.getElementById("myTabContent").children;
  for (let i = 0; i< content.length; i++) {
    const element = content[i];
    var id=element.getAttribute("id");
    if(nombre2==id){
      element.remove();
      break;
    }
  }
}
var cont=2;
function doClick() {
    var e = document.getElementById("file-input");
    if (e) {
      e.click();
    }
  }
  function readSingleFile(e) {
    var file = e.target.files[0];
    if (!file) {
      return;
    }
    
    var reader = new FileReader();
    reader.onload = function(file) {
      var contents = file.target.result;
      var nombre=document.getElementById('file-input').files[0].name;
      var name=nombre.split(".");
      displayContents(name[0],contents);        
    };
    reader.readAsText(file);
  }
  
 
  function displayContents(nombre,contents){
    var content=document.getElementById('headerp');
    var item=content.childNodes;
    item.forEach(element=>{
      if(element!=null){
          var child=element.childNodes;
          child.forEach(chl=>{
            var aux=chl.innerText;
            if(chl!=null && aux!=undefined){
              if(aux!="tab1"){
                chl=AgregarVentana();
             }

               chl.setAttribute("href","#"+nombre);
               aux=chl.innerText;
               chl.innerText=nombre+".java";
               var sub=aux.substring(3,aux.lenght);
               var info=document.getElementById(aux);
                 info.setAttribute("id",nombre);
                 var data=document.getElementById("pestania"+sub);
                 
                 if(data!=null){
                   data.textContent=contents;
                 }
               return null;
            }
          });
        }
    });
  }
document.getElementById('file-input').addEventListener('change',readSingleFile,false);
var cont2=1;

function ObtenerTexto(){
  var url="../Analiza";
  var divtexto=document.getElementById(pActual);
  console.log(pActual);
  var texto=divtexto.children[0];
  console.log(texto.value);
  var valor={"Value":texto.value}
  var defaultBody={
    method:'POST',
    body:JSON.stringify(valor),
    headers:{
      "Content-Type":"application/json"
    }
  };
  function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}
  fetch(url,defaultBody).then(res=>res.json())
  .catch(error => console.log('Error:', error))
  .then(response => view(response));

}

function view(response){
    var js=response.Javascript;
    var py=response.Python;
    console.log("--------------------------------------\n"+js);
    console.log("--------------------------------------\n"+py);
    var consolapy=document.getElementById('cmdpy');
    var consolajs=document.getElementById('cmdjs');
    consolapy.removeAttribute('disabled');
    consolajs.removeAttribute('disabled');
    consolapy.value = py;
    consolajs.value = js;
    consolajs.setAttribute('disabled','');
    consolapy.setAttribute('disabled','');
    console.log("Si ***********************************\n");
    window.open("http://localhost:3080/Arbol","Arbol");
    window.open("http://localhost:3000/Tokens","Tokens");
    window.open("http://localhost:3080/ErroresJS","ErroresJS");
    window.open("http://localhost:3000/ErroresPY","ErroresPY");
}
function downloadTraduccionJs(){
  var consolajs=document.getElementById('cmdjs');
  consolajs.removeAttribute('disabled');
  var contenido=consolajs.value;
  var blob=new Blob([contenido],{type:"text/plain;charset=utf-8"});
  var date=new Date();
  var fecha=""+date.getDay()+date.getMonth()+date.getFullYear()+date.getMilliseconds();
  download(fecha+".js",blob);
  consolapy.setAttribute('disabled','');
}
function guardar(){
  var cmdjava=document.getElementById('cmdjs');
  var contenido=cmdjava.value;
  var blob=new Blob([contenido],{type:"text/plain;charset=utf-8"});
  download(pActual+".java",blob);
}
function guardarComo(){
  var nombre=prompt("Por favor ingrese el nombre del archivo:","");
  if(nombre!=null || nombre!=""){
    var cmdjava=document.getElementById('cmdjs');
    var contenido=cmdjava.value;
    var blob=new Blob([contenido],{type:"text/plain;charset=utf-8"});
    download(nombre+".java",blob);
  }else{
    alert("No ingreso ningun nombre para el archivo");
  }
}
function downloadTraduccionPy(){
  var consolapy=document.getElementById('cmdpy');
  consolapy.removeAttribute('disabled');
  var contenido=consolajs.value;
  var blob=new Blob([contenido],{type:"text/plain;charset=utf-8"});
  var date=new Date();
  var fecha=""+date.getDay()+date.getMonth()+date.getFullYear()+date.getMilliseconds();
  download(fecha+".py",blob);
  consolapy.setAttribute('disabled','');
}
function downloadTraducciones(){
  downloadTraduccionJs();
  downloadTraduccionPy();
}
function downloadErrores(){
  var url="../Errores";
  var defaultBody={
    method:'GET',
    headers:{
      "Content-Type":"application/json"
    }
  };

  fetch(url,defaultBody).then(res=>res.json())
  .catch(error => console.log('Error:', error))
  .then(response => Err_(response));
}
function DownloadTokens(){
  var url="../Tokens";
  var defaultBody={
    method:'GET',
    headers:{
      "Content-Type":"application/json"
    }
  };

  fetch(url,defaultBody).then(res=>res.json())
  .catch(error => console.log('Error:', error))
  .then(response => Err_(response));
}
function DownloadTree(){
  var url="../arbol";
  var defaultBody={
    method:'GET',
    headers:{
      "Content-Type":"application/json"
    }
  };

  fetch(url,defaultBody).then(res=>res.json())
  .catch(error => console.log('Error:', error))
  .then(response => Arbol(response));
}
function Arbol(response){
  var blob=new Blob([response],{type:"text/plain;charset=utf-8"});
  download("ArbolSintactico.svg",blob);
}
function Tokens_(response){
  var blob=new Blob([response],{type:"text/html;charset=utf-8"});
  download("Tokens.html",blob);
}
function Err_(response){
  var blob=new Blob([response.JS],{type:"text/html;charset=utf-8"});
  download("ErroresJs.html",blob);
  var blob2=new Blob([response.Py],{type:"text/html;charset=utf-8"});
  download("ErroresPy.html",blob2);
}
