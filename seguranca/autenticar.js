export default function autenticar(requisicao, resposta){
    const usuario = requisicao.body.usuario;
    const senha   = requisicao.body.senha;
    if (usuario == 'admin' && senha == 'admin') {
        requisicao.session.autenticado = true;
        //usuario está autenticado
        resposta.redirect('/');
    }
    else
    {
        resposta.write('<html>');
        resposta.write('<head>');
        resposta.write('<title>Falha no login</title>');
        resposta.write('<meta charset="utf-8">');
        resposta.write('</head>');
        resposta.write('<body>');
        resposta.write('<p>Usuário ou senha inválidos</p>');
        resposta.write('<a href="/login.html">Voltar para tela de login</a>');
        resposta.write('</body>');
        resposta.write('</html>');
        resposta.end();
    }
}

export function verificarAutenticacao(requisicao, resposta, executarProximoPasso){
//HTTP ser um protocolo stateless, ou seja, o servidor não sabe quem é o usuário e quais informações ele tem.
//Será preciso fazer uso do conceito de sessão para dar ao servidor capacidade de memorizar com quem ele está conversando.
    if (requisicao.session.autenticado != undefined && requisicao.session.autenticado) {
        executarProximoPasso();
    }
    else
    {
        resposta.redirect('/login.html');
    }
}

export function sair(requisicao, resposta){
    requisicao.session.autenticado = undefined;
    resposta.redirect('/login.html');
}