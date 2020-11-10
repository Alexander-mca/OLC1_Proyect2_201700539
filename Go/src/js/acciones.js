var urljs="182.18.7.5:3080";
var urlpy="182.18.7.7:3000";
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
  text.setAttribute('style','display:none;max-height:34rem;');
  text.setAttribute('class','ta');
  div.appendChild(text);
  content.appendChild(div);
  try{
  var act=document.getElementById('tab'+cont);
  var tact=document.getElementById('pestania'+cont);
  while (act.firstChild) {
    act.removeChild(act.firstChild);
  }
  act.appendChild(tact);
  var editor=CodeMirror(act, {
        lineNumbers: true,
        value: tact.value,
        matchBrackets: true,
        styleActiveLine: true,
        theme: "eclipse",
        mode: "text/x-java"
    }).on('change', editor => {
        tact.value=editor.getValue();
    });
  }catch(error){}
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
var tab=document.getElementById('tab1');
            var editor=CodeMirror(tab, {
                lineNumbers: true,
                value: "",
                matchBrackets: true,
                styleActiveLine: true,
                theme: "eclipse",
                extend:true,
                tabSize:20,
                smartIndent:true,
                mode: "text/x-java"
            }).on('change', editor => {
                tab.children[0].value=editor.getValue();
            });
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
    pActual=name[0];   
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
               
                 
                   try {
                    var act=document.getElementById(aux);
                    act.setAttribute("id",nombre);
                    var tact=document.getElementById("pestania"+sub);                 
                    tact.value=contents;
                    while (act.firstChild) {
                        act.removeChild(act.firstChild);
                    }
            
                    act.appendChild(tact);
                    var editor=CodeMirror(act, {
                        lineNumbers: true,
                        value: tact.value,
                        matchBrackets: true,
                        styleActiveLine: true,                        
                        extend:true,
                        tabSize:20,
                        smartIndent:true,
                        indentWithTabs:true,
                        theme: "eclipse",
                        mode: "text/x-java"
                    }).on('change', editor => {
                        tact.value=editor.getValue();
                    });
                }catch(error) {}
                 
               return null;
            }
          });
        }
    });
  }
document.getElementById('file-input').addEventListener('change',readSingleFile,false);
var cont2=0;

function ObtenerTexto(){
  var url="../Analiza";
  var divtexto=document.getElementById(pActual);
  console.log(pActual);
  var texto=divtexto.children[0];
  var valor={"Value":texto.value}
  var defaultBody={
    method:'POST',
    body:JSON.stringify(valor),
    headers:{
      "Content-Type":"application/json"
    }
  };
  
  fetch(url,defaultBody).then(res=>res.json())
  .catch(error => console.log('Error:', error))
  .then(response => view(response));

}
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
function view(response){
    var js=response.Javascript;
    var py=response.Python;
    console.log("--------------------------------------\n"+js);
    console.log("--------------------------------------\n"+py);
    var consolapy=document.getElementById('cmdpy');
    var consolajs=document.getElementById('cmdjs');
    consolapy.removeAttribute('disabled');
    consolajs.removeAttribute('disabled');
    consolajs.value ="";
    consolapy.value="";
    consolapy.value = py;
    consolajs.value = js;
    consolajs.setAttribute('disabled','');
    consolapy.setAttribute('disabled','');
    console.log("Si ***********************************\n");
    window.open("http://"+urljs+"/Arbol","Arbol");
    window.open("http://"+urlpy+"/Tokens","Tokens");
    window.open("http://"+urljs+"/ErroresJS","ErroresJS");
    window.open("http://"+urlpy+"/ErroresPY","ErroresPY");
    cont2++;
}
async function downloadTraduccionJs(){
  var consolajs=document.getElementById('cmdjs');
  consolajs.removeAttribute('disabled');
  var contenido=consolajs.value;
  var blob=new Blob([contenido],{type:"text/plain;charset=utf-8"});
  var date=new Date();
  var fecha=""+date.getDay()+date.getMonth()+date.getFullYear()+date.getMilliseconds();
  //saveAs(blob,fecha+".js");
  download(fecha+".js",contenido);
  consolapy.setAttribute('disabled','');
}
function guardar(){
  var cmdjava=document.getElementById(pActual);
  var contenido=cmdjava.children[0].value;
  var blob=new Blob([contenido],{type:"text/plain;charset=utf-8"});
  //saveAs(blob,fecha+".js");
  download(pActual+".java",contenido);
}
function guardarComo(){
  var nombre=prompt("Por favor ingrese el nombre del archivo:","");
  if(nombre!=null || nombre!=""){
    var cmdjava=document.getElementById(pActual);
    var contenido=cmdjava.children[0].value;
    var blob=new Blob([contenido],{type:"text/plain;charset=utf-8"});
    //saveAs(blob,nombre+".js");
    download(nombre+".java",contenido);
  }else{
    alert("No ingreso ningun nombre para el archivo");
  }
}
async function downloadTraduccionPy(){
  var consolapy=document.getElementById('cmdpy');
  consolapy.removeAttribute('disabled');
  var contenido=consolapy.value;
  var blob=new Blob([contenido],{type:"text/plain;charset=utf-8"});
  var date=new Date();
  var fecha=""+date.getDay()+date.getMonth()+date.getFullYear()+date.getMilliseconds();
  //saveAs(blob,fecha+".py");
  download(fecha+".py",contenido);
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
      "Content-Type":"text/html"
    }
  };

  fetch(url,defaultBody).then(res=>res.text())
  .catch(error => console.log('Error:', error))
  .then(response => Tokens_(response));
}
function DownloadTree(){
  var url="../arbol";
  var defaultBody={
    method:'GET',
    headers:{
      "Content-Type":"text/plain"
    }
  };

  fetch(url,defaultBody).then(res=>res.text())
  .catch(error => console.log('Error:', error))
  .then(response => Arbol(response));
}
function Arbol(response){
  //var blob=new Blob([response],{type:"text/plain;charset=utf-8"});
  //saveAs(blob,"ArbolSintacito.svg");
  var valor=response;
  console.log(valor);
  download("ArbolSintactico"+cont2+".svg",valor);
}
function Tokens_(response){
  //var blob=new Blob([response],{type:"text/html;charset=utf-8"});
  //saveAs(blob,"tokens.html");
  var valor=response;
  download("Tokens"+cont2+".html",valor);
}
function Err_(response){
//   var blob=new Blob([response.JS],{type:"text/html;charset=utf-8"});
//  //saveAs(blob,"ErroresJs.html");
//   var blob2=new Blob([response.Py],{type:"text/html;charset=utf-8"});
  //saveAs(blob2,"ErroresPy.html");
  var js=response.Js;
  var py=response.Py;
  download("ErroresJs"+cont2+".html",js);
  download("ErroresPy"+cont2+".html",py);
}

