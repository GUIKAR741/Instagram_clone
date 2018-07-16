/*Importando mongodb*/
let mongo = require("mongodb").MongoClient,
    assert = require("assert"),
    connMongoDB = function(dados) {
    mongo.connect(url,{useNewUrlParser:true}, function(err, client) {
        assert.equal(null, err);
        // console.log("Connected successfully to server");
        const db = client.db(dbName);
        query(db, dados);
        client.close();
    });
    },
    url,
    dbName;
function query(db, dados) {
    let collection = db.collection(dados.collection);
    switch (dados.operacao) {
        case "inserir":
            collection.insertOne(dados.dado, dados.callback);
            break;
        case "selecionar":
            collection.find(dados.dado).toArray(dados.callback);
            break;
        case "atualizar":
            if(dados.multi===false) {
                collection.updateOne(dados.campo, dados.alterar, dados.callback);
            }else{
                collection.updateMany(dados.campo, dados.alterar, dados.callback);
            }
            break;
        case "deletar":
            if(dados.multi===false) {
                collection.deleteOne(dados.dado,dados.callback);
            }else{
                collection.deleteMany(dados.dado,dados.callback);
            }
            break;
    }
}
module.exports =function(host,port,db) {
    url = "mongodb://"+host+":"+port;
    dbName = db;
    return connMongoDB;
};