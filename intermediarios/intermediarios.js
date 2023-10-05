let {ultimaConta, banco, contas, saques, depositos, transferencias} = require('../bancoDeDados');

const listarContas = (req,res,next)=>{
    const {senha_banco} = req.query;
    try{
        if(senha_banco === banco.senha){
            next();
        }else{
            error
        }
    }catch(error){
        return res.status(400).json({mensagem: 'A senha do banco informada é inválida!'});
    }
}

const criarConta = (req,res,next)=>{
    const {nome, cpf, data_nascimento, telefone, email, senha } = req.body

    try{
        if(nome === undefined || cpf === undefined || data_nascimento === undefined || telefone === undefined || email  === undefined || senha === undefined){
            return error
        }
    }catch(error){
        return res.status(400).json({mensagem: "Verifique os dados, existe algum dado faltante"})
    }

    try{
        for(let i=0; i<contas.length; i++){    
            if(contas[i].usuario.nome === nome || contas[i].usuario.cpf === cpf || contas[i].usuario.email === email){
                return error
            }
        }
    }catch(error){
        return res.status(400).json({mensagem: "Já existe uma conta com o nome, cpf ou e-mail informado!"})
    }


    const numeroAtual = ultimaConta++
    const contaNova = {
        numero: numeroAtual.toString(),
        saldo: 0,
        usuario:{
            nome, 
            cpf, 
            data_nascimento, 
            telefone, 
            email, 
            senha
        }
    }
    contas.push(contaNova);

    next();
}

const atualizarConta = (req,res,next)=>{
    const{numeroConta} = req.params;
    const {nome, cpf, data_nascimento, telefone, email, senha } = req.body;
        
    const contaLocalizada = contas.find((conta)=>{
        return conta.numero === numeroConta
    })

    const contasDiferentes = contas.filter((conta)=>{
        return conta.numero != contaLocalizada.numero
    })

    try{
        if(nome === undefined || cpf === undefined || data_nascimento === undefined || telefone === undefined || email  === undefined || senha === undefined ){
            return error
        }
    }catch(error){
        return res.status(400).json({mensagem: "Verifique os dados, existe algum dado faltante"})
    }
    
    try{
        if(!contaLocalizada){
        return error
        }
    }catch(error){
        return res.status(404).json({mensagem: 'Conta não localizada'})
    }

    try{
        for(let i=0; i<contasDiferentes.length; i++){    
            if(contasDiferentes[i].usuario.nome === nome || contasDiferentes[i].usuario.cpf === cpf || contasDiferentes[i].usuario.email === email){
            return error
            }
        }
    }catch(error){
        return res.status(400).json({mensagem: "Já existe uma conta com o nome, cpf ou e-mail informado!"})
    }

    contaLocalizada.usuario.nome = nome;
    contaLocalizada.usuario.cpf= cpf;
    contaLocalizada.usuario.data_nascimento=data_nascimento;
    contaLocalizada.usuario.telefone=telefone;
    contaLocalizada.usuario.email=email;
    contaLocalizada.usuario.senha=senha;
    
    next();
}

const deletarConta = (req,res, next)=>{
    const{numeroConta} = req.params;

    const contaLocalizada = contas.find((conta)=>{
        return conta.numero === numeroConta;
    })

    const indiceContaLocalizada = contas.findIndex((conta)=>{
        return conta.numero === numeroConta;
    })

    try{
        if(!contaLocalizada){
            return error;
        }
    }catch(error){
        return res.status(404).json({mensagem: 'Conta não localizada'});
    }
    
    try{
        if(contaLocalizada.saldo != 0){
            return error;
        }
    }catch(error){
        return res.status(400).json({mensagem: 'Não pode encerrar conta com saldo maior que 0'});
    }
   
    contas.splice(indiceContaLocalizada,1);

    next();
}

const depositar = (req,res,next)=>{
    const {numero_conta, valor} = req.body;
        
    const contaLocalizada = contas.find((conta)=>{
        return conta.numero === numero_conta
    })

    try{
        if(numero_conta === undefined || valor === undefined){
        return error
        }
    }catch(error){
        return res.status(400).json({mensagem: "Voce deve informar o numero da conta e valor para deposito"})
    }
    
    try{
        if(!contaLocalizada){
            return error
        }
    }catch(error){
        return res.status(404).json({mensagem: 'Conta não localizada'})
    }
    
    try{
        if(valor <= 0){
            return error
        }
    }catch(error){
        return res.status(400).json({mensagem: "Voce deve informar um valor maior que 0 para deposito"})
    }
    
    const data = new Date();
    const dadosDeposito =
        {
            "data": data.toLocaleString(),
            "numero_conta": numero_conta,
            "valor": valor
        }
    
    contaLocalizada.saldo += valor;

    depositos.push(dadosDeposito);

    next();
}

const sacar = (req,res,next)=>{
    const {numero_conta, valor, senha} = req.body;
    
    try{
        if(numero_conta === undefined || valor === undefined || senha === undefined ){
            return error
        }
    }catch(error){
        return res.status(400).json({mensagem: "Voce deve informar o numero da conta e valor para saque"})
    }
    
    const contaLocalizada = contas.find((conta)=>{
        return conta.numero === numero_conta
    })

    try{
        if(!contaLocalizada){
            return error
        }
    }catch(error){
        return res.status(404).json({mensagem: 'Conta não localizada'})
    }
    
    try{
        if(valor <= 0){
            return  error
        }
    }catch(error){
        return res.status(400).json({mensagem: "Voce deve informar um valor maior que 0 para saque"})
    }
    
    try{
        if(senha != contaLocalizada.usuario.senha){
            return error
        }
    }catch(error){
        return res.status(400).json({mensagem: "Senha invalida"})
    }

    try{
        if(contaLocalizada.saldo < valor){
        return   error
        }
    }catch(error){
        return res.status(400).json({mensagem: "Voce não tem saldo suficiente para o saque"})
    }

    const data = new Date();
    const dadosSaque =
        {
            "data": data.toLocaleString(),
            "numero_conta": numero_conta,
            "valor": valor
        }
    
    contaLocalizada.saldo -= valor;

    saques.push(dadosSaque);
    next();
}

const transferir = (req,res,next)=>{
    const {numero_conta_origem, numero_conta_destino, valor, senha} = req.body;
    
    try{
        if(numero_conta_origem === undefined || numero_conta_destino === undefined || valor === undefined || senha === undefined ){
            return error
        }
    }catch(error){
        return res.status(400).json({mensagem: "Verifique os dados da transferencia, algum dado não foi informado"})
    }
    
    try{
        if(numero_conta_origem === undefined || numero_conta_destino === undefined || valor === undefined || senha === undefined ){
            return error
        }    
    }catch(error){
        return res.status(400).json({mensagem: "Verifique os dados da transferencia, algum dado não foi informado"})
    }
    
    const contaOrigemLocalizada = contas.find((conta)=>{
        return conta.numero === numero_conta_origem
    })
    const contaDestinoLocalizada = contas.find((conta)=>{
        return conta.numero === numero_conta_destino
    })

    try{
        if(!contaDestinoLocalizada){
            return error
        }
    }catch(error){
        return res.status(404).json({mensagem: 'Conta de destino não localizada'})
    }

    try{
        if(!contaOrigemLocalizada){
            return error
        }
    }catch(error){
        return res.status(404).json({mensagem: 'Conta de origem não localizada'})
    }

    try{
        if(valor <= 0){
            return error
        }
    }catch(error){
        return res.status(400).json({mensagem: "Voce deve informar um valor maior que 0 para trasnferencia"})
    }
    
    try{
        if(senha != contaOrigemLocalizada.usuario.senha){
            return error
        }
    }catch(error){
        return res.status(400).json({mensagem: "Senha invalida"})
    }

    try{
        if(contaOrigemLocalizada.saldo < valor){
            return error
        }
    }catch(error){
        return res.status(400).json({mensagem: "Voce não tem saldo suficiente para o transferencia"})
    }

    const data = new Date();
    const dadosTransferencia =
        {
            "data": data.toLocaleString(),
            "numero_conta_origem": numero_conta_origem,
            "numero_conta_destino": numero_conta_destino,
            "valor": valor
        }
    
        contaOrigemLocalizada.saldo -= valor;
        contaDestinoLocalizada.saldo+=valor

    transferencias.push(dadosTransferencia);
   
    next()
}

const extrato = (req,res,next)=>{
    const {numero_conta, senha} = req.query;

    try{
        if(numero_conta === undefined || senha === undefined ){
            return error
        }
    }catch(error){
        return res.status(400).json({mensagem: "Voce deve informar o numero da conta e senha para obter o saldo"})
    }
    
    const contaLocalizada = contas.find((conta)=>{
        return conta.numero === numero_conta
    })

    try{ 
        if(!contaLocalizada){
        return  error
        }
    }catch(error){
        return res.status(404).json({mensagem: 'Conta não localizada'})
    }

    try{
        if(senha != contaLocalizada.usuario.senha){
            error
        }
    }catch(error){
        return res.status(400).json({mensagem: "Senha invalida"})
    }

    next();
}

const saldo = (req,res,next)=>{
    const {numero_conta, senha} = req.query;
    
    try{
        if(numero_conta === undefined || senha === undefined ){
            return error
        }
    }catch(error){
        return res.status(400).json({mensagem: "Voce deve informar o numero da conta e senha para obter o saldo"})
    }
    
    const contaLocalizada = contas.find((conta)=>{
        return conta.numero === numero_conta
    })
    
    try{
        if(!contaLocalizada){
            return  error 
        }
    }catch(error){
        return res.status(404).json({mensagem: 'Conta não localizada'})
    }

    try{
        if(senha != contaLocalizada.usuario.senha){
            return  error 
        }
    }catch(error){
        return res.status(400).json({mensagem: "Senha invalida"})
    } 
    next();
}

module.exports = {
    listarContas,
    criarConta,
    atualizarConta,
    deletarConta,
    depositar,
    sacar,
    transferir,
    extrato,
    saldo
}