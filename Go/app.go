package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"html/template"
	"io/ioutil"
	"net/http"
	"os"
)

const port = "8080"

type Texto struct {
	Value string `json:"value"`
}

var nodeURL = ""

func main() {
	//================= NODE API =================//
	//nodeip, defip := os.LookupEnv("NODEIP")
	nodeport, defport := os.LookupEnv("NODEPORT")

	// if !defip {
	// 	nodeip = "182.18.7.7"
	// }

	if !defport {
		nodeport = "3000"
	}

	nodeURL = "http://localhost:" + nodeport

	//==================== GO ====================//
	//ip, defip := os.LookupEnv("GOIP")
	port, defport := os.LookupEnv("GOPORT")

	// if !defip {
	// 	ip = "182.18.7.9"
	// }

	if !defport {
		port = "8000"
	}
	fs := http.FileServer(http.Dir("Go/src"))
	http.Handle("/", fs)
	//http.HandleFunc("/", index)
	http.HandleFunc("/Analiza", getInfo)

	fmt.Println("Server on PORT:" + port)

	http.ListenAndServe(":"+port, nil)
}

func index(w http.ResponseWriter, r *http.Request) {
	t := template.Must(template.ParseFiles("Go/src/index.html"))
	t.Execute(w, "")
}

func getInfo(w http.ResponseWriter, r *http.Request) {
	var url = nodeURL + "/Data"

	var decoder = json.NewDecoder(r.Body)
	var c Texto
	err := decoder.Decode(&c)
	if err != nil {
		panic(err)
	}

	var jsonStr = []byte(`{"Value":"` + c.Value + `"}`)
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonStr))
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}

	defer resp.Body.Close()
	bodyBytes, _ := ioutil.ReadAll(resp.Body)

	fmt.Println(string(bodyBytes))
	fmt.Println("Se queda en getInfo")
	fmt.Fprintf(w, string(bodyBytes))
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
