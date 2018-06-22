var parameter = 0;



$(document).ready(function () {

    //Adiciona event listeners
    btnHeader = document.querySelector("#btnHeader");
    btnHeader.addEventListener("click", addNewParameter);


    //Tratativa do Send
    btnSend = document.querySelector("#Send");
    btnSend.addEventListener("click", Send);
})


//Faz o envio das informações
let Send = (event) => {
    event.preventDefault();
    event.stopPropagation();

    
    var Url = document.querySelector("#Url");
    var Method = document.querySelector("#Method");
    var Data = document.querySelector("#Body");


    ///Validações
    if (Url.value === "") {
        console.log("Url is empty");
        $(Url).addClass("border-danger");
        $(Url).attr("placeholder", "This field is required.");
        Url.focus();
        return null;
    }

    if (Method.value === "") {
        console.log("Method is empty");
        $(Method).addClass("border-danger");
        $(Method).attr("placeholder", "This field is required.");
        Method.focus();        
        return null;
    }

    if ((Method.value === "POST" || Method.value === "PUT") && Data.value=="") {
        console.log("Body is empty when Method is iqual to POST or PUT");
        $(Data).addClass("border-danger");
        $(Data).attr("placeholder", "Body is empty when Method is iqual to POST or PUT");
        Method.focus();
        return null;
    }



    var xRequest = new XMLHttpRequest();
    xRequest.open(Method.value, Url.value, true);

    //Adiciona os Headers
    if (parameter !== 0) {        
        var headers = {}

        xRequest.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        for (var i = 1; i <= parameter; i++) {
            var header =document.querySelector("#Header"+i) ;
            var value =document.querySelector("#Value"+i);

            if (header !== "" || typeof (header) !== "undefined" || header !== null) {
                //headers[header.value] = value.value;
                xRequest.setRequestHeader(headers);
            }            
        }

        //
        //xRequest.setRequestHeader(headers);
    }
    



    if (Method.value === "GET") {
        xRequest.send(null);
    } else {
        xRequest.send(Data.value);
    }

    
    //Faz um reload básico para limpar tudo
    location.reload();
}

//Adiciona um novo parâmetro em tela
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