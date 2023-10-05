let {contas, saques, depositos, transferencias} = require('../bancoDeDados');

const listarContas = (req,res)=>{
    return res.status(200).json(contas);
}

const criarConta = (req,res)=>{
    return res.status(201).send()
}

const atualizarConta = (req,res)=>{
    return res.status(204).send()
}

const deletarConta = (req,res)=>{
    return res.status(204).send()
}

const depositar = (req,res)=>{
    return res.status(204).send()
}

const sacar = (req,res)=>{
    return res.status(204).send()
}

const transferir = (req,res)=>{
    return res.status(204).send()
}

const saldo = (req,res)=>{
    const {numero_conta} = req.query;

    const contaLocalizada = contas.find((conta)=>{
        return conta.numero === numero_conta
    })

    return res.status(200).json({saldo: contaLocalizada.saldo})
}

const extrato = (req,res)=>{
    const {numero_conta} = req.query;

    const depositosConta = depositos.filter((deposito)=>{
        return deposito.numero_conta === numero_conta
    })
    const saquesConta = saques.filter((saque)=>{
        return saque.numero_conta === numero_conta
    })
    const transferenciasEnviadas = transferencias.filter((transferencia)=>{
        return transferencia.numero_conta_origem === numero_conta
    })
    const transferenciasRecebidas = transferencias.filter((transferencia)=>{
        return transferencia.numero_conta_destino === numero_conta
    })


    const relatorioDaConta = {
       "depositos": depositosConta,
       "saques": saquesConta,
       "transferenciasEnviadas": transferenciasEnviadas,
       "transferenciasRecebidas": transferenciasRecebidas
    }

    return res.status(200).json(relatorioDaConta)
}

module.exports = {
    listarContas,
    criarConta,
    atualizarConta,
    deletarConta,
    saldo,
    extrato,
    depositar,
    sacar,
    transferir
}