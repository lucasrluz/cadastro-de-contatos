import { createConnection } from "typeorm";

createConnection().then(() => {console.log('Conexão realizada com Banco de Dados.')})