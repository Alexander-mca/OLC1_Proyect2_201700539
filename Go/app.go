package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"html/template"
	"io/ioutil"
	"net/http"
	"os"
	"strings"
)

const port = ""
const ip = ""

type Texto struct {
	Value string
}

var nodeURLJS = ""
var nodeURLPY = ""

type DataResponse struct {
	Javascript string
	Python     string
}
type Report struct {
	Arbol     string
	ErroresJS string
	Tokens    string
	ErroresPy string
}
type Error struct {
	Js string
	Py string
}

func main() {

	//================= NODE API JS =================//
	nodeip, defip := os.LookupEnv("NODEIPJS")
	nodeport, defport := os.LookupEnv("NODEPORTJS")

	if !defip {
		nodeip = "182.18.7.5"
	}

	if !defport {
		nodeport = "3080"
	}

	nodeURLJS = nodeip + ":" + nodeport

	//================= NODE API PY =================//
	nodeip, defip = os.LookupEnv("NODEIPPY")
	nodeport, defport = os.LookupEnv("NODEPORTPY")

	if !defip {
		nodeip = "182.18.7.7"
	}

	if !defport {
		nodeport = "3000"
	}

	nodeURLPY = nodeip + ":" + nodeport

	//==================== GO ====================//
	ip, defip := os.LookupEnv("GOIP")
	port, defport := os.LookupEnv("GOPORT")

	if !defip {
		ip = "182.18.7.9"
	}

	if !defport {
		port = "8080"
	}
	fs := http.FileServer(http.Dir("./src/"))
	http.Handle("/", fs)
	//http.HandleFunc("/", index)
	http.HandleFunc("/Analiza", getInfo)
	http.HandleFunc("/Errores", Errores)
	http.HandleFunc("/arbol", Arbol)
	http.HandleFunc("/Tokens", Tokens)

	fmt.Println("Server on " + ip + ":" + port)
	http.ListenAndServe(":"+port, nil)
}

func Arbol(w http.ResponseWriter, r *http.Request) {
	//var url1 = "http://localhost:3080/arbol"
	var url1 = "http://" + nodeURLJS + "/arbol"
	req, err := http.NewRequest("GET", url1, nil)
	req.Header.Set("Content-Type", "text/plain")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}

	defer resp.Body.Close()
	bodyBytesjs, _ := ioutil.ReadAll(resp.Body)
	arbol := string(bodyBytesjs)
	//fmt.Println(arbol)
	fmt.Fprintf(w, arbol)
}
func Tokens(w http.ResponseWriter, r *http.Request) {
	//var url = "http://localhost:3000/Tokens"
	var url = "http://" + nodeURLPY + "/Tokens"
	req, err := http.NewRequest("GET", url, nil)
	req.Header.Set("Content-Type", "text/html")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}

	defer resp.Body.Close()
	bodyBytesjs, _ := ioutil.ReadAll(resp.Body)
	tokens_ := string(bodyBytesjs)
	//fmt.Println(tokens_)
	fmt.Fprintf(w, tokens_)
}
func Errores(w http.ResponseWriter, r *http.Request) {
	//var url2 = "http://localhost:3080/ErroresJS"
	//var url4 = "http://localhost:3000/ErroresPY"
	var url2 = "http://" + nodeURLJS + "/ErroresJS"
	var url4 = "http://" + nodeURLPY + "/ErroresPY"
	//peticion 2
	req, err := http.NewRequest("GET", url2, nil)
	req.Header.Set("Content-Type", "text/html")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}

	defer resp.Body.Close()
	bodyBytesjs, _ := ioutil.ReadAll(resp.Body)
	erroresjs := string(bodyBytesjs)
	//peticion 3 errores py
	req, err = http.NewRequest("GET", url4, nil)
	req.Header.Set("Content-Type", "text/html")

	client = &http.Client{}
	resp, err = client.Do(req)
	if err != nil {
		panic(err)
	}

	defer resp.Body.Close()
	bodyBytesjs, _ = ioutil.ReadAll(resp.Body)
	errorespy := string(bodyBytesjs)
	var valores = Error{Js: erroresjs, Py: errorespy}
	respjson, error2 := json.Marshal(valores)
	if error2 != nil {
		fmt.Printf(error2.Error())
	}
	fmt.Println(string(respjson))
	fmt.Fprintf(w, string(respjson))

}
func index(w http.ResponseWriter, r *http.Request) {
	t := template.Must(template.ParseFiles("./src/index.html"))
	t.Execute(w, "")
}

func getInfo(w http.ResponseWriter, r *http.Request) {
	// var url = "http://localhost:3080/Data/"
	// var urlpy = "http://localhost:3000/Data/"
	var url = "http://" + nodeURLJS + "/Data/"
	var urlpy = "http://" + nodeURLPY + "/Data/"

	var decoder = json.NewDecoder(r.Body)
	var c Texto
	err := decoder.Decode(&c)
	if err != nil {
		panic(err)
	}
	c.Value = strings.ReplaceAll(c.Value, "\n", "\\n")
	c.Value = strings.ReplaceAll(c.Value, "\"", "\\\"")
	c.Value = strings.ReplaceAll(c.Value, "\r", "\\r")
	c.Value = strings.ReplaceAll(c.Value, "\t", "\\t")
	var jsonStr = []byte(`{"Value":"` + c.Value + `"}`)
	fmt.Println(string(jsonStr))
	//Aqui se hace la peticion a la api rest js
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonStr))
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}

	defer resp.Body.Close()
	bodyBytesjs, _ := ioutil.ReadAll(resp.Body)
	Datajs := string(bodyBytesjs)
	//aqui se hace la peticion a la api rest py
	req2, err2 := http.NewRequest("POST", urlpy, bytes.NewBuffer(jsonStr))
	req2.Header.Set("Content-Type", "application/json")

	client2 := &http.Client{}
	resp2, err2 := client2.Do(req2)
	if err2 != nil {
		panic(err2)
	}

	defer resp2.Body.Close()
	bodyBytespy, _ := ioutil.ReadAll(resp2.Body)
	datapy := string(bodyBytespy)
	//guardamos las respuestas en un struct
	response := DataResponse{Javascript: Datajs, Python: datapy}

	respjson, error2 := json.Marshal(response)
	if error2 != nil {
		fmt.Printf(error2.Error())
	}
	//fmt.Println(string(respjson))
	fmt.Fprintf(w, string(respjson))
}

func PostTextoHandler(w http.ResponseWriter, r *http.Request) {
	//var url = "/Analiza/"
	var texto Texto
	err := json.NewDecoder(r.Body).Decode(&texto)
	if err != nil {
		fmt.Printf(err.Error())
	}
	fmt.Println("Valor:", texto)
	//var jsonStr = []byte(`{"Value"`)
}
