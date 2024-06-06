const express = require('express');
const router = express.Router();
const path = require('path');
const { query, querySoredProcedure } = require('../midleware/database_middleware');
const autenticacaoMiddleware = require('../midleware/authMiddleware');


router.get('/listar/:id', autenticacaoMiddleware, async (req, res) => {
   
    const idParameter = req.params.id;
    
    try {
        
        let retornoBancoDados = await querySoredProcedure("OCOTB.SP_getCurso", {idCurso: idParameter});
       
        res.render('pages/cursoListar', {
            tituloCabecalho: 'Lista Curso', 
            subCabecalho: 'Listar',
            cursoList: retornoBancoDados}
        );


    } catch (error) {
        console.error('Erro ao listar curso:', error);
        res.status(500).json({ message: 'Erro interno do servidor (cursoRoute)' });
    } 
});

/**
 * Mesmo que o método acima, no entanto retornando formato json e preparado para preencher elemento option/dropdown list e outros elementos
 */
router.get('/listarJson/:id', autenticacaoMiddleware, async (req, res) => {
   
    const idParameter = req.params.id;
    
    try {
        
        let retornoBancoDados = await querySoredProcedure("OCOTB.SP_getCurso", {idCurso: idParameter});
       
        res.json(retornoBancoDados);

    } catch (error) {
        console.error('Erro ao listar Curso:', error);
        res.status(500).json({ message: 'Erro interno do servidor (cursoRoute)' });
    } 
});


/**
 * Prepara a tela inicial de manter
 * Tanto inclusão de uma nova quanto manter uma existente
 */
router.get('/incluirInit/:id', autenticacaoMiddleware, async (req, res) => {
    
    const idParameter = req.params.id;

    try {
        
        let retornoBancoDados = await querySoredProcedure("OCOTB.SP_getCurso", {idCurso: idParameter});
        
        if (idParameter > 0 && retornoBancoDados.length > 0){
            
            const primeiraLinha = retornoBancoDados[0];

            res.render(
                'pages/cursoManter', 
                { 
                    rota: '/api/curso/salvar',
                    session: req.session, 
                    tituloCabecalho: 'Manter Curso', 
                    subCabecalho: 'Incluir',
                    idCurso: primeiraLinha.idCurso,
                    nmCurso: primeiraLinha.nmCurso,
                    idCoordenador: primeiraLinha.idCoordenador
               });
        }else {

            res.render(
                'pages/cursoManter', 
                { 
                    rota: '/api/curso/salvar',
                    session: req.session, 
                    tituloCabecalho: 'Manter Curso', 
                    subCabecalho: 'Incluir',
                    idCurso: 0,
                    nmCurso: '',
                    idCoordenador: 0
                });
        }

    } catch (error) {
        console.error('Erro ao listar curso:', error);
        res.status(500).json({ message: 'Erro interno do servidor (cursoRoute)' });
    } 
});

/**
 * Para salvar um novo registro ou atualizar um existente
 */
router.post('/salvar', autenticacaoMiddleware, async (req, res) => {
    
    const { idCurso, nmCurso, idCoordenador } = req.body;

    try {
        
        let retornoBancoDados = await querySoredProcedure("OCOTB.SP_setCurso", 
            {
                idCurso: idCurso,
                nmCurso: nmCurso,
                idCoordenador: idCoordenador
            });
        
        console.log('Resultado da consulta:', retornoBancoDados);

        //res.render('pages/ocorrenciaManter', { session: req.session, tituloCabecalho: 'Ocorrências', ocorrenciasMinhas: retornoBancoDados});
        return res.redirect('/api/curso/listar/0');

    } catch (error) {
        console.log(error);
        console.error('Erro ao salvar curso:', error);
        
        req.session.mensagemErro = {
            id: 0,
            cssClass: [' alert-danger '],
            mensagem: error
       };

        return res.redirect('/api/curso/listar/0');
    } 
});

module.exports = router;