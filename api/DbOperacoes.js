function DbOperacoes(connection) {
    this._connection=connection;
}
DbOperacoes.prototype.create = function(col,dado,call) {
    let dados = {
        operacao: "inserir",
        dado:dado,
        collection: col,
        callback:call
    };
    this._connection(dados);
};
DbOperacoes.prototype.read = function(col,dado,call) {
    let dados = {
        operacao: "selecionar",
        dado: dado,
        collection: col,
        callback:call
    };
    this._connection(dados);
};
DbOperacoes.prototype.update = function(col,dado1,dado2,call,multi=false) {
    let dados = {
        multi:multi,
        operacao: "atualizar",
        campo: dado1,
        alterar: dado2,
        collection: col,
        callback: call
    };
    this._connection(dados);
};
DbOperacoes.prototype.delete = function(col,dado,call,multi=false) {
    let dados = {
        multi:multi,
        operacao: "deletar",
        dado: dado,
        collection: col,
        callback: call
    };
    this._connection(dados);
};
module.exports=DbOperacoes;