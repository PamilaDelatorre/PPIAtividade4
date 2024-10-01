fetch('/sessao')
.then(response => response.json())
.then(data => {
    const botaoCadastroEvento = document.getElementById('botao-cadastro-evento');
    const botaoLogin = document.getElementById('botao-login');
    const botaoSair = document.getElementById('botao-sair');
    
    if (data.autenticado != undefined && data.autenticado) {
        botaoCadastroEvento.style.display = 'inline';
        botaoLogin.style.display = 'none';
        botaoSair.style.display = 'inline';
    } else {
        botaoCadastroEvento.style.display = 'none';
        botaoLogin.style.display = 'inline';
        botaoSair.style.display = 'none';
    }
});