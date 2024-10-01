//recursos prontos que impeçam a reinvenção de roda.
import express from 'express';
import autenticar from './seguranca/autenticar.js';
import { verificarAutenticacao, sair } from './seguranca/autenticar.js';
import  session  from 'express-session';

const host = '0.0.0.0'; //todas interfaces de rede disponiveis
const porta = 3000; 
const app = express();

//Configuração dos parâmetros da requisição
app.use(express.urlencoded({ extended: true }));

// Configuração da sessão
app.use(session({
    secret: 'segredo', 
    resave: true,
    saveUninitialized: true,
    cookie: {  
        maxAge: 1000 * 60 * 15
    }
}));

app.use(express.static('./publico'));

// Página inicial
app.get('/', (req, res) => {
    res.redirect('/index.html');
});

// Página de login
app.get('/login', (req, res) => {
    res.redirect('/login.html');
});

app.get('/logout', sair);

// Autenticação do usuário
app.post('/login', autenticar);

app.use(verificarAutenticacao, express.static('./privado'));

//verifica sessao
app.get('/sessao', (req, res) => {
    res.json({ autenticado: !!req.session.autenticado });
});

//listen = executar por requisições dos usuários
app.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`)
});