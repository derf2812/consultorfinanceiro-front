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

function carregarListaDeLancamentos(){
    return new Promise((resolve, reject)=>{
        try{
            $.get(`${URL_BASE}/lancamento/conta/${getIdUsuariLogado()}`, function(lancamentos){
                var tbody = $('#appLista table tbody');
                tbody.remove()
                $('#appLista table').append('<tbody />');
                tbody = $('#appLista table tbody');
                
                lancamentos.forEach(lancamento => {
                    tbody.append(`<tr>
                        <td>${lancamento.categoria.tipoLancamentoCategoria}</td>
                        <td>${lancamento.tipolancamento.descricaoLancamento}</td>
                        <td>${lancamento.prazo}</td>
                        <td>${lancamento.valorLancamento}</td>
                        <td>${lancamento.taxa}</td>
                        <td>${formatarData(lancamento.dataLancamento)}</td>
                        <td>${formatarData(lancamento.dataCancelamento)}</td>
                        <td><button class="btn btn-default" onclick='deletarLancamento("${lancamento.lancamentoId}")'><i class="material-icons">delete</i></button></td>
                    </tr>`)
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

function exibirTelaCadastro(){
    hideAllAppContainer()
    $('#appCadastro').show()
}

function exibirTelaLista(){
    trocarTituloTelaAtual('Lista Lancamentos')
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
    })
}

function exibirTelaMinhaConta(){
    trocarTituloTelaAtual('Minha Conta')
    hideAllAppContainer()
    $('#appMinhaConta').show()
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
    return `R$ ${valor}`
}

function getIdUsuariLogado(){
    return JSON.parse(localStorage.getItem("usuarioLogado")).contaId
}

function getNomeUsuariLogado(){
    return JSON.parse(localStorage.getItem("usuarioLogado")).nomeUsuario
}