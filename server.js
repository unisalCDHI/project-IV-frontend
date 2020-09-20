//Importa as dependências
const express = require('express');
const path = require('path');

const app = express();

// Serve os arquivos estáticos da pasta dist (gerada pelo ng build)
app.use(express.static(__dirname + '/dist/project-iv-frontend'));

app.get('/*', function(req,res) {
    
res.sendFile(path.join(__dirname+'/dist/project-iv-frontend/index.html'));
});

// Inicia a aplicação pela porta configurada
app.listen(process.env.PORT || 4200);