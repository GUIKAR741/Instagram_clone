let express=require('express'),
    bodyParser=require('body-parser'),
    multiparty=require('connect-multiparty'),
    ObjectID=require('mongodb').ObjectId,
    fs=require('fs');

let app=express();
// app.use(express.static('./'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(multiparty());
app.use(function (req,res,next) {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers','content-type');
    res.setHeader('Access-Control-Allow-Credentials',true);
    next();
});
let port=8080;
app.listen(port,function(){
    console.log("server HTTP on na porta "+port);
});
let con=require('./dbConnection')('localhost','27017','instagram'),OP=require('./DbOperacoes');
OP=new OP(con);
//GET Read
app.get('/api',function (req,res) {
    OP.read('postagens',{},function (err, result) {
        if(err){
            res.json(err);
        }else{
            res.json(result);
        }
    })
});
//GET Read By ID
app.get('/api/:id',function (req,res) {
    OP.read('postagens',ObjectID(req.params.id),function (err, result) {
        if(err){
            res.json(err);
        }else{
            res.json(result);
        }
    })
});
//GET route Images
app.get('/imagens/:imagem',function (req,res) {
    let img=req.params.imagem;
    fs.readFile('./uploads/'+img,function (err,content) {
        if(err){
            res.status(400).json(err);
            return;
        }
        res.writeHead(200,{'content-type':'image/jpg'});
        res.end(content);
    });
});
//POST Create
app.post('/api',function (req,res) {
    let dados=req.body,date=new Date(),timeStamp=date.getTime();
    let path_origem=req.files.arquivo.path,
        urlImg=timeStamp+'_'+req.files.arquivo.originalFilename,
        path_destino='./uploads/'+urlImg;
    fs.rename(path_origem,path_destino,function (err) {
        if(err){
            res.status(500).json({error:err});
            return;
        }
        dados.url_imagem=urlImg;
        OP.create('postagens',dados,function (err,result) {
            if(err){
                res.json({status:0});
            }else{
                res.json({status:1});
            }
        });
    });
});
//PUT Update By ID
app.put('/api/:id',function (req,res) {
    let dados=req.body;
    OP.update('postagens',{_id:ObjectID(req.params.id)},{$push:{comentarios:{id_comentario:new ObjectID(),comentario:req.body.comentario}}},function (err, result) {
        if(err){
            res.json(err);
        }else{
            res.json(result);
        }
    })
});
//DELETE delete By ID
app.delete('/api/:id',function (req,res) {
    // res.json({_id:ObjectID(req.params.id)});
    OP.update('postagens',{},{$pull:{comentarios:{id_comentario:ObjectID(req.params.id)}}},function (err, result) {
        if(err){
            res.json(err);
        }else{
            res.json(result);
        }
    },true)
});