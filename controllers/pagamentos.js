module.exports = function (app) {
    app.get("/pagamentos", function (req, res) {
        res.send('ok');
    });

    app.post("/pagamentos/pagamento", function (req, res) {
        var pagamento = req.body;

        req.assert("forma_de_pagamento", "Forma de pagamento é obrigatória.").notEmpty();
        req.assert("valor", "Valor é obrigatório e deve ser um decimal.").notEmpty().isFloat();
        req.assert("moeda", "Moeda é obrigatória e deve ter 3 caracteres").notEmpty().len(3, 3);

        var errors = req.validationErrors();

        if (errors) {
            console.log("Erros de validação encontrados");
            res.status(400).send(errors);
            return;
        }

        console.log('processando pagamento...');

        var connection = app.persistencia.connectionFactory();
        var pagamentoDao = new app.persistencia.PagamentoDao(connection);

        pagamento.status = "CRIADO";
        pagamento.data = new Date;

        pagamentoDao.salva(pagamento, function (exception, result) {
            if(exception){
                console.log("Erros ao chamar banco de dados");
                res.status(500).send(exception);
            }else{
                console.log('pagamento criado: ' + JSON.stringify(result));
                res.location('/pagamentos/pagamento/' + result.insertId);
                pagamento.id = result.insertId;
                res.status(201).json(pagamento);
            }
            
        });
    });

}