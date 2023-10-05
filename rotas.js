const express = require('express')
const rotas = express()

const controladores = require('./controladores/controladores');
const intermediarios = require('./intermediarios/intermediarios');

rotas.get('/contas',intermediarios.listarContas ,controladores.listarContas);
rotas.post('/contas',intermediarios.criarConta,controladores.criarConta);
rotas.put('/contas/:numeroConta/usuario',intermediarios.atualizarConta,controladores.atualizarConta);
rotas.delete('/contas/:numeroConta',intermediarios.deletarConta,controladores.deletarConta);
rotas.get('/contas/saldo',intermediarios.saldo,controladores.saldo);
rotas.get('/contas/extrato',intermediarios.extrato,controladores.extrato);


rotas.post('/transacoes/depositar',intermediarios.depositar,controladores.depositar);
rotas.post('/transacoes/sacar',intermediarios.sacar,controladores.sacar);
rotas.post('/transacoes/transferir',intermediarios.transferir,controladores.transferir);

module.exports = rotas;