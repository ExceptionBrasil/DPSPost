///<summary>
/// Variáveis globais
///</summary>
var parameter = 0;


///<summary>
///Inicialização do documento
///Adiciona eventos aos objetos do DOM
///</summary>
$(document).ready(function () {

    //Adiciona event listeners
    btnHeader = document.querySelector("#btnHeader");
    btnHeader.addEventListener("click", addNewParameter);

    //Oculta a caixa body
    textAreaBody = document.querySelector("#Body");
    textAreaBody.hidden = true;

    btnHeader = document.querySelector("#btnBody");
    btnHeader.addEventListener("click", showBody);

    //About button
    btnAbout = document.querySelector("#About");
    btnAbout.addEventListener("click", function () {
        $('#aboutModal').modal('show');
    });

    //Tratativa do Send
    btnSend = document.querySelector("#Send");
    btnSend.addEventListener("click", Send);

})

///<summary>
///Função principal 
/// Faz o envio das informções 
///</summary>

let Send = (event) => {
    event.preventDefault();
    event.stopPropagation();


    //Faz o get dos campos
    var Url = document.querySelector("#Url");
    var Method = document.querySelector("#Method");
    var Data = document.querySelector("#Body");



    //Validações
    if (Url.value === "") {
        console.log("Url is empty");
        $(Url).addClass("border-danger");
        $(Url).attr("placeholder", "This field is required.");
        Url.focus();
        return null;
    }

    if (Method.value === "") {
        console.log("Method is empty");
        Method.outerHTML += `<div class="alert alert-warning alert-dismissible fade show" role="alert">
                              <strong>This field is required</strong>
                              <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                              </button>
                            </div>`
        Method.focus();
        return null;
    }

    if ((Method.value === "POST" || Method.value === "PUT") && Data.value === "") {
        console.log("Body is empty when Method is iqual to POST or PUT");
        $(Data).addClass("border-danger");
        $(Data).attr("placeholder", "Body is empty when Method is iqual to POST or PUT");
        Method.focus();
        return null;
    }

    //Fim das validações





    //----------------------------
    //Inicializa o Request 
    //----------------------------
    var xRequest = new XMLHttpRequest();

    
    //Mensagens de progresso 
    xRequest.addEventListener("progress", function (oEvent) {
        var percent = (oEvent.loaded / oEvent.total) * 100;

        if (isNaN(percent) || typeof (percent) === "undefined") {

            percent = 50;

        }
        var result = document.querySelector("#Result");
        addInfoModal(`<div class="progress">                          
                          <div class="progress-bar" role="progressbar" style="width: `+ percent + `%" aria-valuenow="` + percent + `" aria-valuemin="0" aria-valuemax="100">` + percent + `%</div>
                      </div>`);

    }, false);


    //Mensagem ao fim de processo 
    xRequest.addEventListener("load", function () {
        var result = document.querySelector("#Result");
        addInfoModal(`<div class="alert alert-secondary" role="alert">
                      You got success on request!
                    </div>`)
    }, false);

    //Mensagemd e erro de preocesso
    xRequest.addEventListener("error", function () {        
        var result = document.querySelector("#Result");
        addInfoModal(`<div class="alert alert-danger" role="alert">
                      We get an error from requested url. The server refused the contend.
                    </div>`)
    }, false);


    //Mensagem que o processo foi abortado
    xRequest.addEventListener("abort", function () {
        var result = document.querySelector("#Result");
        addInfoModal(`<div class="alert alert-warning" role="alert">
                      YOU cancelled the process!
                    </div>`)
    }, false);



    //Abre a conexão
    xRequest.open(Method.value, Url.value, true);

    //Adiciona ao header o uso do cache
    xRequest.setRequestHeader("Cache-Control", "no-cache");


    //Adiciona os Headers personalizados do cliente
    if (parameter !== 0) {
        var headers = {}


        for (var i = 1; i <= parameter; i++) {
            var header = document.querySelector("#Header" + i);
            var value = document.querySelector("#Value" + i);

            if (header !== "" || typeof (header) !== "undefined" || header !== null) {
                xRequest.setRequestHeader(header.value.trim(), value.value.trim());
            }
        }

    }

    
    //Trata o retorno da informação 
    xRequest.onload = function () {

        //Retorno 
        var json = xRequest.responseText; //JSON.parse(xRequest.responseText);

        //Faz a perfumaria do retorno
        if (xRequest.readyState === 4 && xRequest.status === 200) {
            var result = document.querySelector("#Result");
            addInfoModal(`<pre class="prettyprint" id="Enli" data-enlighter-language="json" data-enlighter-highlight="5" data-enlighter-group="group1"">
                        `+ json + `
                        </pre>`);
            $('#resultModal').modal('show');
        } else {
            var result = document.querySelector("#Result");
            addInfoModal(`pre class="prettyprint" id="Enli" data-enlighter-language="json" data-enlighter-highlight="5" data-enlighter-group="group1"">
                        `+ json + `
                        </pre>`);
            $('#resultModal').modal('show');
        }


        // create a new EnlighterJS instance
        var myEnlighter = new EnlighterJS(document.id('Enli'), {
            language: 'json',
            showLinenumbers: true
        });
        // enable highlighting
        myEnlighter.enlight(true);

        // remove highlighting (drop generated HTML from DOM)
        //myEnlighter.dispose();
    }


    //Faz o envio da informação 
    if (Method.value === "GET") {
        xRequest.send();
    } else {
        xRequest.send(Data.value);
    }


}

///<sumary>
/// Adiciona um novo parâmetro em tela
///</sumary>
let addNewParameter = (event) => {
    event.preventDefault();
    event.stopPropagation();

    parameter++;

    let HeaderGroup = document.querySelector("#HeaderGroup");
    HeaderGroup.innerHTML += `
                    <div class="form-group">
                        <input type="text" id="Header` + parameter + `" placeholder="Header` + parameter + `" class="form-control" />
                        <input type="text" id="Value`+ parameter + `" placeholder="Value` + parameter + `" class="form-control" />
                    </div>`;

}


///<summary>
/// Fução para exibir ou escoder o body
///</summary>
let showBody = (event) => {
    event.preventDefault();
    event.stopPropagation();
    textAreaBody = document.querySelector("#Body");
    textAreaBody.hidden = !textAreaBody.hidden;
}

///<summary>
/// Adiciona um texto ao body do modal que trata a resposta de retorno
///</summary>
let addInfoModal = (text) => {
    document.querySelector("#modalResultBody").innerHTML += text;
}