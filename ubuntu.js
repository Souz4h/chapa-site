const bcrypt = require('bcrypt');

const senha = 'fernandogremiossc';
const hash = bcrypt.hashSync(senha, 10);

console.log('Hash gerado:', hash);
