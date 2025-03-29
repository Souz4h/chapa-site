const bcrypt = require('bcrypt');

const senha = 'fernandogremio';
const hash = bcrypt.hashSync(senha, 10);

console.log('Hash gerado:', hash);
