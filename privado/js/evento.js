const formEvento = document.getElementById('formEvento');

formEvento.onsubmit = validarCampos;

const enderecoAPI = 'http://localhost:4000/eventos';
buscarTodosEventos();

var motivoAcao = "CADASTRAR";

function gravarEvento(){
    const objetoEvento = {
        nome: document.getElementById('nome').value,
        descricao: document.getElementById('descricao').value,
        dataInicio: document.getElementById('dataInicio').value,
        dataFim: document.getElementById('dataFim').value,
        valorPista: document.getElementById('valorPista').value,
        valorVip: document.getElementById('valorVip').value,
        valorCamarote: document.getElementById('valorCamarote').value,
        avaliacao: document.getElementById('avaliacao').value
    }

    fetch(enderecoAPI, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(objetoEvento)
    }).then((resposta) => {
        return resposta.json();
    }).then((respostaAPI) => {
        if (respostaAPI.status == true) {
            exibirMensagem(respostaAPI.mensagem, 'green');
        }
        else{
            exibirMensagem(respostaAPI.mensagem, 'red');
        }
    }).catch((erro) => {
        exibirMensagem(erro, '#D2691E');
    });

}

function selecionarEvento(id, nome, avaliacao, dataInicio, dataFim, valorPista, valorVip, valorCamarote, descricao, motivo) {
    
    document.getElementById('codigo').value =  id;
    document.getElementById('nome').value = nome;
    document.getElementById('avaliacao').value = avaliacao;
    document.getElementById('dataInicio').value = setData(dataInicio);
    document.getElementById('dataFim').value = setData(dataFim);
    document.getElementById('valorPista').value = valorPista;
    document.getElementById('valorVip').value = valorVip;
    document.getElementById('valorCamarote').value = valorCamarote;
    document.getElementById('descricao').value = descricao;
    motivoAcao = motivo;
    atualizaBotao(motivo);
}

function excluirEvento(id){

    fetch(`${enderecoAPI}/${id}`, {
        method:'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((resposta) => {
        return resposta.json();
    }).then((respostaAPI) => {
        if (respostaAPI.status == true) {
            exibirMensagem(respostaAPI.mensagem, 'green');
            buscarTodosEventos();
        }
        else{
            exibirMensagem(respostaAPI.mensagem, 'red');
        }
    }).catch((erro) => {
        exibirMensagem(erro, '#D2691E');
    });
}

function atualizarEvento(id){

    const objetoEvento = {
        nome: document.getElementById('nome').value,
        descricao: document.getElementById('descricao').value,
        dataInicio: document.getElementById('dataInicio').value,
        dataFim: document.getElementById('dataFim').value,
        valorPista: document.getElementById('valorPista').value,
        valorVip: document.getElementById('valorVip').value,
        valorCamarote: document.getElementById('valorCamarote').value,
        avaliacao: document.getElementById('avaliacao').value
    }

    fetch(`${enderecoAPI}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(objetoEvento)
    }).then((resposta) => {
        return resposta.json();
    }).then((respostaAPI) => {
        if (respostaAPI.status == true) {
            exibirMensagem(respostaAPI.mensagem, 'green');
            buscarTodosEventos();
        }
        else{
            exibirMensagem(respostaAPI.mensagem, 'red');
        }
    }).catch((erro) => {
        exibirMensagem(erro, '#D2691E');
    });

}

function validarCampos(event){
    const id = document.getElementById('codigo').value;
    const nome = document.getElementById('nome').value;
    const avaliacao = document.getElementById('avaliacao').value;
    const dataInicio = document.getElementById('dataInicio').value;
    const dataFim = document.getElementById('dataFim').value;
    const valorPista = document.getElementById('valorPista').value;
    const valorVip = document.getElementById('valorVip').value;
    const valorCamarote = document.getElementById('valorCamarote').value;
    const descricao = document.getElementById('descricao').value;

    //impedem que o navegador continue o processo de submissão do formulário
    event.stopPropagation();
    event.preventDefault();

    // Verifica se todos os campos obrigatórios estão preenchidos
    if (!nome || !descricao || isNaN(avaliacao) || isNaN(valorPista) || isNaN(valorVip) || isNaN(valorCamarote)) {
        exibirMensagem('Por favor, preencha todos os campos obrigatórios.', 'red');
        return false;
    }

    // Valida avaliação (0 a 5)
    if (avaliacao < 0 || avaliacao > 5) {
        exibirMensagem('Avaliação deve ser um número entre 0 e 5.', 'red');
        return false;
    }

    // Valida datas (data de início deve ser anterior à data de fim)
    if (dataInicio >= dataFim) {
        exibirMensagem('A data de início deve ser anterior à data de fim.', 'red');
        return false;
    }

    // Valida valores (devem ser maiores que zero)
    if (valorPista <= 0 || valorVip <= 0 || valorCamarote <= 0) {
        exibirMensagem('Os valores dos ingressos devem ser maiores que zero.', 'red');
        return false;
    }

     // Valida o id para operações de editar e excluir
     if ((motivoAcao === "EDITAR" || motivoAcao === "EXCLUIR") && id <= 0) {
        exibirMensagem('Evento inválido para editar ou excluir.', 'red');
        return false;
    }

    if (motivoAcao == "CADASTRAR"){
        gravarEvento();
    }
    else if (motivoAcao == "EDITAR"){
        atualizarEvento(id);
        motivoAcao = "CADASTRAR";
    }
    else if (motivoAcao == "EXCLUIR"){
        excluirEvento(id);
        motivoAcao = "CADASTRAR";
    }
    
    formEvento.reset();
    atualizaBotao(motivoAcao);
    buscarTodosEventos();
    return true;
}

function buscarTodosEventos(){
    fetch(enderecoAPI, {method:'GET'})
    .then((resposta) => {
        return resposta.json();
    })
    .then((respostaAPI) => {
        if (respostaAPI.status == true) {
            exibirTabelaEventos(respostaAPI.listaEventos);
        }
        else{
            exibirMensagem(respostaAPI.mensagem, 'red');
        }
    })
    .catch((erro) => {
        exibirMensagem(erro, '#D2691E');
    });
}

function exibirMensagem(mensagem, cor = 'black') {
    const divMensagem = document.getElementById('mensagem');
    divMensagem.innerHTML = "<p style='color: " + cor + ";'>" + mensagem + "</p>";
    setTimeout(() => {
        divMensagem.innerHTML = "";
    }, 5000);
}

function exibirTabelaEventos(listaEventos){
    if (listaEventos.length > 0) {
        const espacoTabela = document.getElementById('containerTabela');
        const tabela = document.createElement('table');
        tabela.classList="table table-striped table-hover";
        const cabecalho = document.createElement('thead');
        cabecalho.innerHTML = `
            <tr>
                <th scope="col">Nome</th>
                <th scope="col">Avaliação</th>
                <th scope="col">Data de Início</th>
                <th scope="col">Data de Fim</th>
                <th scope="col">Valor Pista (R$)</th>
                <th scope="col">Valor VIP (R$)</th>
                <th scope="col">Valor Camarote (R$)</th>
                <th scope="col">Descrição</th>
                <th scope="col">Ações</th>
            </tr>
        `;
        const corpo = document.createElement('tbody');
        for (const evento of listaEventos) {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td style="display: none;">${evento.codigo}</td>
                <td>${evento.nome}</td>
                <td>${evento.avaliacao}</td>
                <td>${formatDate(evento.dataInicio)}</td>
                <td>${formatDate(evento.dataFim)}</td>
                <td>${evento.valorPista}</td>
                <td>${evento.valorVip}</td>
                <td>${evento.valorCamarote}</td>
                <td>${evento.descricao}</td>
                <td>
                    <button class="btn btn-primary" onclick="selecionarEvento('${evento.codigo}','${evento.nome}','${evento.avaliacao}','${evento.dataInicio}','${evento.dataFim}','${evento.valorPista}','${evento.valorVip}','${evento.valorCamarote}','${evento.descricao}','EDITAR')"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-danger" onclick="selecionarEvento('${evento.codigo}','${evento.nome}','${evento.avaliacao}','${evento.dataInicio}','${evento.dataFim}','${evento.valorPista}','${evento.valorVip}','${evento.valorCamarote}','${evento.descricao}','EXCLUIR')"><i class="bi bi-trash"></i></button>
                </td>
            `;
            corpo.appendChild(linha);
        }
        tabela.appendChild(cabecalho);
        tabela.appendChild(corpo);
        espacoTabela.innerHTML="";
        espacoTabela.appendChild(tabela);
    }
    else{
        exibirMensagem('Nenhum evento encontrado.');
    }
}

// Função para formatar a data no formato 'dd/mm/aaaa'
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0'); // Dia com 2 dígitos
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês (0-11)
    const year = date.getFullYear(); // Ano

    return `${day}/${month}/${year}`;
}

function setData(dateStr){
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
}

function atualizaBotao(motivoAcao){
    const botaoConfirmacao = document.getElementById('botaoConfirmacao');
    if (motivoAcao == 'EDITAR') {
        botaoConfirmacao.innerHTML = 'Editar';
    }
    else if (motivoAcao == 'EXCLUIR') {
        botaoConfirmacao.innerHTML = 'Excluir';
    }else{
        botaoConfirmacao.innerHTML = 'Cadastrar';
    }
}