
let previousElement;

function tocaSom (seletorAudio) {
    
    // pega o elemento html de áudio de acordo com o seletor de áudio
    const elemento = document.querySelector(seletorAudio);
    
    // pausa o áudio do elemento caso ele seja o anterior ou se ele mesmo ainda estiver tocando
    if(previousElement != null && (previousElement == elemento || elemento.readyState > 0)){
        elemento.pause(); // pausa o áudio
        elemento.currentTime = 0; // reinicia o ponto de início do áudio
    }
    
    if (elemento && elemento.localName === 'audio') {
        elemento.play(); //toca o áudio
        previousElement = elemento; // aloca no elemento anterior o áudio atual
    }
    else {
        //alert('Elemento não encontrado');
        console.log('Elemento não encontrado ou seletor inválido');
    }

}


function incluirSom(seletorAudio){
    // caso a tecla gravar estava habilitada coloca o áudio selecionado na lista de áudios gravados junto com seu timer
    if(gravando) {
        let tempoAtual = new Date().getTime();
        let tempoEspera = tempoAtual - inicio;
        teclasGravadas.set(tempoEspera,seletorAudio.substr(1));
    }    
}

let teclasGravadasFormatado = [];
function mapParaString() {
    //transforma o map de teclas e timers em uma string.
    for (let [key,value] of teclasGravadas) {
        teclasGravadasFormatado.push(value + "(" + key + ")")
    }
}

function pegarParametrosUrl(){
    return "" + window.location.search
}

function alterarUrl() {
    //Altera a URL adicionando as teclas gravadas e seus timers para a URL
    if(teclasGravadas == ""){
        return;
    }
    mapParaString();

    const queryString = pegarParametrosUrl();
    if (!(queryString.includes("sons"))) {
        window.history.pushState(null, '', "?sons=" + teclasGravadasFormatado);
    }else {
        window.history.pushState(null,'', queryString + "," + teclasGravadasFormatado);
    }
}

function recarregarUrl() {
    location.reload();
}

let listening = false;
const timer = ms => new Promise(res => setTimeout(res, ms))
async function ouvir() {
    //Ouve as teclas salvas na URL (Teclas Gravadas) em sequencia, e dentro da time line gravada.
    await timer(1000);

    let sons = window.location.search.replace('?sons=', '');
    console.log(sons);
    sons = ("" + sons).split(",");
    console.log(sons);

    let sonsComTimer = [];
    for(let i = 0; i < sons.length; i++) {
        let partitura = sons[i];
        sonsComTimer.push(partitura.replace(")","").split("("));
    }

    //teste
    for(let i = 0; i < sonsComTimer.length; i++) {
        console.log(sonsComTimer[i]);
    }
    //teste

    ouvidor.classList.add("ouvindo")
    ouvidor.innerHTML = "Escutando"

    for (let i = 0; i < sonsComTimer.length; i++) {
        if(!listening){
            break;
        }

        if( i > 0) {
            await timer(sonsComTimer[i][1] - sonsComTimer[i-1][1]);
            let audioId = "#" + sonsComTimer[i][0];
            console.log(audioId);
            tocaSom(audioId);

        } else {
            await timer(sonsComTimer[i][1]);
            let audioId = "#" + sonsComTimer[i][0];
            console.log(audioId);
            tocaSom(audioId);

        }
    }

    ouvidor.classList.remove("ouvindo")
    ouvidor.innerHTML = "Ouvir"
}

function gotowhatsapp() {
    //Envia Todas as informações salvas no formulário para o whatsapp.

    var name = document.getElementById("nomesobrenome").value;
    var phone = document.getElementById("email").value;
    var email = document.getElementById("telefone").value;
    var service = document.getElementById("mensagem").value;
    var teclas = document.getElementById("sequenciaTeclas").value;

    var url = "https://wa.me/5521989540760?text="
        + "Nome: " + name + "%0a"
        + "Telefone: " + phone + "%0a"
        + "Email: " + email  + "%0a"
        + "Mensagem: " + service + "%0a"
        + "Teclas: " + teclas + "%0a"
        + "Link: " + window.location.protocol + "//" + window.location.host + "/Online_MIDI" + "/index.html" + window.location.search;

    window.open(url, '_blank').focus();
}

//----------------------------------------------------------------------------------------------------

const listaDeTeclas = document.querySelectorAll('.tecla');

//para
for (let contador = 0; contador < listaDeTeclas.length; contador++) {

    const tecla = listaDeTeclas[contador];
    let instrumento = tecla.innerHTML.toLowerCase();
    const idAudio = `#${instrumento}`; //template string

    tecla.onclick = function () {
        // alert(idAudio)
        tocaSom(idAudio);
        incluirSom(idAudio);
    }

    tecla.onkeydown = function (evento) {

        if (evento.code === 'Space' || evento.code === 'Enter') {
            tecla.classList.add('ativa');
        }

    }

    tecla.onkeyup = function () {
        tecla.classList.remove('ativa');
    }

}

//----------------------------------------------------------------------------------------------------
// Funcionalidades do MENU

//Gravador
let gravador = document.querySelector(".botao_gravador");
let gravando = false;
let teclasGravadas = new Map();
let inicio;

gravador.onclick = function () {
    if(!gravando) {

        gravador.classList.add("gravando");
        gravador.innerHTML = "Parar"

        inicio = new Date().getTime();

        gravando = true;

    } else {

        gravador.classList.remove("gravando");
        gravador.innerHTML = "Gravar";

        alterarUrl();
        recarregarUrl();

        gravando = false;

    }
}

//Ouvidor
let ouvidor = document.querySelector(".botao_ouvir");
let ouvindo = false;

ouvidor.onclick = function () {
    listening = !listening;
    if(listening){
        ouvir().finally(
            function(){listening = false;}
        );
        
    }
}

//enviar
let enviar = document.querySelector(".botao_enviar");

enviar.onclick = function () {
    if(pegarParametrosUrl().trim() != ""){
        window.open("formulario.html" + window.location.search );
    }
}

//reseter
let reseter = document.querySelector(".botao_resetar");

reseter.onclick = function () {
    window.location.href = window.location.protocol + "//" + window.location.host + window.location.pathname;
}





// felipesergiomartins@gmail.com












