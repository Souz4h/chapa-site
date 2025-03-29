const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const bcrypt = require('bcrypt');
const eventRoutes = require('./routes/eventRoutes');
const contactRoutes = require('./routes/contactRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../public')));

app.use(session({
  secret: '1c66f1cba54282e234030d764a109e82eb2ce9360a43c9d88858a8884afa3d0b543e3ef6520ad9b58001e00c0f7993f08ca52d3bbf0e379c4e7d95f12b825e43',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 3600000,
    secure: false, // Altere para false em desenvolvimento
    httpOnly: true,
    sameSite: 'lax' // Ajuda com problemas de CORS
  }
}));


// Dados do administrador
const adminUser = process.env.ADMIN;
const adminPasswordHash = process.env.PASSWORD;

// Rota POST para efetuar login
// No app.js, modifique a rota de login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (username !== adminUser) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  const passwordMatch = await bcrypt.compare(password, adminPasswordHash);
  if (!passwordMatch) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  req.session.user = adminUser;
  req.session.save((err) => {
    if (err) {
      console.error("Erro ao salvar sessão:", err);
      return res.status(500).json({ message: 'Erro ao criar sessão' });
    }
    res.json({ success: true, redirectTo: '/admin' });
  });
});

// Middleware para proteger rotas que requerem autenticação
function requireAuth(req, res, next) {
  console.log('Sessão:', req.session);
  console.log('Usuário na sessão:', req.session.user);
  console.log('Admin user:', adminUser);
  
  if (req.session.user === adminUser) {
    return next();
  }
  
  console.log('Autenticação falhou, redirecionando para login');
  res.redirect('/login?unauthorized=true');
}
app.get('/check-session', (req, res) => {
  res.json({
    session: req.session ? 'exists' : 'not exists',
    user: req.session.user || 'not set',
    isAuthenticated: req.session.user === adminUser
  });
});

// Rotas de API e páginas
app.use('/api/events', eventRoutes);
app.use('/api/contacts', contactRoutes);

// Página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Dashboard admin (rota protegida)
app.get('/admin', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin.html'));
});

// Página de respostas
app.get('/respostas', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/responses.html'));
});

// Página de propostas
app.get('/propostas', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/proposals.html'));
});

// Página de login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Rota para logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login?logout=true');
  });
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});