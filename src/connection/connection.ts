import { createConnection } from "typeorm";

createConnection().then(() => {console.log('Conexão com Banco de Dados estabelecida.')})