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
  cont++;
  return link;
}
function eliminarTab(tab){

  var nombre=tab.innerText;
  var tabs=document.getElementById('headerp');
  tabs.childNodes.forEach(element => {
      if(element.firstChild!=null){
        var name=element.firstChild.innerText;
        if(nombre==name){
          element.remove();
        }
      }
      
  });
  var content=document.getElementById(nombre);
  var name=content.getAttribute("id");
  if(content!=null && name==nombre){
    content.remove();
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


function ObtenerTexto(){
  var url="../Analiza";
  var texto=document.getElementById("pestania1").value;
  var valor={"Value":texto}
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
