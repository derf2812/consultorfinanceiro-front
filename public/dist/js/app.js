//const URL_BASE = "https://consultorfinanceiro-back.herokuapp.com/api"
//const URL_BASE = "http://192.168.0.12:8080/api"
const URL_BASE = "http://localhost:8080/api"

const categorias = []

$(()=>{
    $('#btnSair').click(()=>{
        localStorage.removeItem("usuarioLogado");
        window.location = "/login.html";
    })

    $('.nomeUsuario').toArray().forEach((it)=>{
        $(it).text(getNomeUsuariLogado())
    })

    $('#btCadastrar').click(cadastrar)
    $('#btVoltar').click(exibirTelaLista)
    $('#btnZerarSaldo').click(()=>{
        zerarSaldo(getIdUsuariLogado())
    })

    exibirTelaHome()

    $.get(`${URL_BASE}/categoria`, function(obj){
        var selectCategoria = $('#selectCategoria');
        obj.forEach(categoria=>{
            selectCategoria.append(`<option value='${categoria.categoriaId}'>${categoria.tipoLancamentoCategoria}</option>`)
        })
    })

    $.get(`${URL_BASE}/tipolancamento`, function(obj){
        var selectTipoLancamento = $('#selectTipoLancamento');
        obj.forEach(tipoLancamento=>{
            selectTipoLancamento.append(`<option value='${tipoLancamento.idTipoLancamento}'>${tipoLancamento.descricaoLancamento}</option>`)
        })
    })
})

function atualizaTelaNovoLancamento(){
    var str = $('#selectTipoLancamento option:selected').text()
    var patt = new RegExp("Prazo", "i")
    if(patt.test(str)){
        $('#inptPrazo').parent().show()
    }else{
        $('#inptPrazo').parent().hide()
    }
}

function carregarListaDeLancamentos(){
    return new Promise((resolve, reject)=>{
        try{
            $.get(`${URL_BASE}/lancamento/conta/${getIdUsuariLogado()}`, function(lancamentos){
                var tbody = $('#appLista table tbody');
                tbody.remove()
                $('#appLista table').append('<tbody />');
                tbody = $('#appLista table tbody');
                var listaMobile = $('#lista-mobile')
                listaMobile.html('')
                
                var patt = new RegExp("Receita", "i")

                lancamentos.forEach(lancamento => {
                    tbody.append(`<tr>
                        <td>${lancamento.categoria.tipoLancamentoCategoria}</td>
                        <td>${lancamento.tipolancamento.descricaoLancamento}</td>
                        <td>${lancamento.prazo}</td>
                        <td>${formataToDinheiro(lancamento.valorLancamento)}</td>
                        <td>${formatarData(lancamento.dataLancamento)}</td>
                        <td>${formatarData(lancamento.dataCancelamento)}</td>
                        <td><button class="btn btn-default" onclick='deletarLancamento("${lancamento.lancamentoId}")'><i class="fa fa-trash"></i></button></td>
                        </tr>`)
                        
                    var cor;

                    if(patt.test(lancamento.tipolancamento.descricaoLancamento)){
                        cor = 'success'
                    }else{
                        cor = 'danger'
                    }

                    listaMobile.append(`
                        <div class="panel panel-${cor}">
                            <div class="panel-heading">${lancamento.tipolancamento.descricaoLancamento}</div>
                            <div class="panel-body">
                                ${lancamento.categoria.tipoLancamentoCategoria} - ${formataToDinheiro(lancamento.valorLancamento)}<br />
                                ${formatarData(lancamento.dataLancamento)} 
                                <button class="btn btn-default" onclick='deletarLancamento("${lancamento.lancamentoId}")'><i class="fa fa-trash"></i></button>
                            </div>
                        </div>
                    `)
                });

                resolve()
            })
        }catch(e){
            reject(e)
        }
    })
}

function cadastrar(){
    showLoading()

    var objCadastro = {
        categoria: {categoriaId: $('#selectCategoria option:selected').val()},
        tipolancamento: {idTipoLancamento: $('#selectTipoLancamento option:selected').val()},
        conta: {contaId: getIdUsuariLogado()},
        prazo: $('#inptPrazo').val(),
        valorLancamento: $('#inptValor').val(),
        dataLancamento: formatarData($('#inptDataLancamento').val())
    }

    $.ajax({
        url: `${URL_BASE}/lancamento`,
        type: 'post',
        contentType: "application/json; charset=utf-8",
        success: function( data ) {
            exibirTelaLista();
        },
        error: function (request, status, error) {
            alert('ERRO ao Efetuar cadastro: '+request.responseJSON.msg)
            hideLoading()
        },
        data: JSON.stringify(objCadastro),
        processData: false
    });
}

function deletarLancamento(idLancamento){
    showLoading()

    $.ajax({
        url: `${URL_BASE}/lancamento/${idLancamento}`,
        type: 'delete',
        contentType: "application/json; charset=utf-8",
        success: function( data ) {
            carregarListaDeLancamentos().then(()=>{
                exibirTelaLista()
                hideLoading()
            })
        },
        error: function (request, status, error) {
            alert('ERRO ao tentar apagar o lancamento: '+error)
            hideLoading()
        },
        data: "",
        processData: false
    });
}

function zerarSaldo(idConta){
    showLoading()

    $.ajax({
        url: `${URL_BASE}/conta/zerarsaldo/${idConta}`,
        type: 'post',
        contentType: "application/json; charset=utf-8",
        success: function( data ) {
            exibirTelaMinhaConta()
            hideLoading()
        },
        error: function (request, status, error) {
            alert( 'ERRO ao tentar zerar o saldo: ' + error )
            hideLoading()
        },
        data: "",
        processData: false
    });
}
function getCor(id){
    for (const key in cores) {
        if (cores[key].id === id) {
            return cores[key].descricao
        }
    }

    return "cor desconhecida"
}

function formatarData(formatarData){
    return moment().format("DD-MM-YYYY")
}

function showLoading(){
    $('#loading').show()
}

function hideLoading(){
    $('#loading').hide()
}

function exibirTelaCadastro(limpaTela=true){
    if(limpaTela){
        $('#selectCategoria').val('')
        $('#selectTipoLancamento').val('')
        $('#inptPrazo').val('')
        $('#inptValor').val('')
        $('#inptDataLancamento').val('')
    }
    
    hideAllAppContainer()
    $('#appCadastro').show()
}

function exibirTelaLista(){
    trocarTituloTelaAtual('Lista Lançamentos')
    hideAllAppContainer()
    $('#appLista').show()

    showLoading()

    carregarListaDeLancamentos().then(()=>{
        hideLoading()
    }).catch((e)=>{
        alert(e)
        hideLoading()
    })
}

function exibirTelaHome(){
    trocarTituloTelaAtual('Dashboard')
    hideAllAppContainer()
    $('#appHome').show()

    $.get(`${URL_BASE}/conta/${getIdUsuariLogado()}`, function(conta){
        $('#valorSaldoAtual').text(formataToDinheiro(conta.saldo))
        $('#valorSaldoReceita').text(formataToDinheiro(conta.saldoReceita))
        $('#valorSaldoDespesa').text(formataToDinheiro(conta.saldoDespesa))
        $('#valorPercentualSaldo').text(Math.round(((conta.saldoDespesa*100)/conta.saldoReceita))+'%')
    })
}

function exibirTelaMinhaConta(){
    $.get(`${URL_BASE}/conta/${getIdUsuariLogado()}`, function(conta){
        trocarTituloTelaAtual('Minha Conta')

        $("#usr-nome").text(conta.nomeUsuario)
        $("#usr-login").text(conta.login)
        $("#usr-data-cadastro").text(conta.dataCadastro)
        $("#usr-email").text(conta.email)
        $("#usr-limite-gasto-mensal").text(conta.limiteGastoMensal + "% da receita")

        hideAllAppContainer()
        $('#appMinhaConta').show()
    })
   
}

function hideAllAppContainer(){
    $('.appContainer').hide()
}

function trocarTituloTelaAtual(titulo){
    $('#tituloPaginaAtual').text(titulo)
}

function goTo(location){
    switch(location){
        case 'HOME': 
            exibirTelaHome()
        break
        case 'LANCAMENTOS': 
            exibirTelaLista()
        break
        case 'MINHA_CONTA': 
            exibirTelaMinhaConta()
        break
    }
}

function formataToDinheiro(valor){
    return `${parseFloat(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
}

function getIdUsuariLogado(){
    return JSON.parse(localStorage.getItem("usuarioLogado")).contaId
}

function getNomeUsuariLogado(){
    return JSON.parse(localStorage.getItem("usuarioLogado")).nomeUsuario
}

function getUsuariLogado(){
    return JSON.parse(localStorage.getItem("usuarioLogado"))
}