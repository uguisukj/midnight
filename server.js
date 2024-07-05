const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do middleware de sessão
app.use(session({
    secret: 'sua_chave_secreta_aqui',
    resave: false,
    saveUninitialized: true,
}));

// Middleware para servir arquivos estáticos
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Usuários e códigos
const users = {
    'miguel': '3839',
    'natchopro': 'natchojk',
    'nussn': 'nussapaixonei'
};

// Rota para a página de login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Rota para processar o login
app.post('/login', (req, res) => {
    const { username, code } = req.body;
    if (users[username] && users[username] === code) {
        req.session.loggedIn = true;
        res.redirect('/painel');
    } else {
        res.send('Nome de usuário ou código incorreto. <a href="/login">Tente novamente</a>');
    }
});

// Middleware para proteger o painel
app.use('/painel', (req, res, next) => {
    if (req.session.loggedIn) {
        next();
    } else {
        res.redirect('/login');
    }
});

// Rota para o painel
app.get('/painel', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'painel.html'));
});

// Rota para logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
