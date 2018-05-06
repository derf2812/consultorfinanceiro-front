const URL_BASE = "http://localhost:8080/api"

const categorias = []

$(()=>{
    showLoading()

    $('#btCadastrar').click(cadastrar)
    $('#btVoltar').click(exibirTelaLista)

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

    carregarListaDeLancamentos().then(()=>{
        hideLoading()
    }).catch((e)=>{
        alert(e)
        hideLoading()
    })
})

function carregarListaDeLancamentos(){
    return new Promise((resolve, reject)=>{
        try{
            $.get(`${URL_BASE}/lancamento`, function(lancamentos){
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
        prazo: $('#inptPrazo').val(),
        valorLancamento: $('#inptValor').val(),
        dataLancamento: formatarData($('#inptDataLancamento').val())
    }

    $.ajax({
        url: `${URL_BASE}/lancamento`,
        type: 'post',
        contentType: "application/json; charset=utf-8",
        success: function( data ) {
            carregarListaDeLancamentos().then(()=>{
                exibirTelaLista()
                hideLoading()
            })
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
        url: `${URL_BASE}/veiculo/${placa}`,
        type: 'delete',
        contentType: "application/json; charset=utf-8",
        success: function( data ) {
            carregarListaDeLancamentos().then(()=>{
                exibirTelaLista()
                hideLoading()
            })
        },
        error: function (request, status, error) {
            alert('ERRO ao tentar remover veiculo: '+request.responseJSON.msg)
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
    $('#appLista').hide()
    $('#appCadastro').show()
}

function exibirTelaLista(){
    $('#appLista').show()
    $('#appCadastro').hide()
}