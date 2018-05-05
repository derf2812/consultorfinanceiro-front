const URL_BASE = "http://localhost:8080/api"

const categorias = []

$(()=>{
    showLoading()

    $.get(`${URL_BASE}/categoria`, function(obj){
        var selectCategoria = $('#selectCategoria');
        obj.forEach(categoria=>{
            selectCategoria.append(`<option value='${categoria.categoriaId}'>${categoria.tipoLancamentoCategoria}</option>`)
        })
    })

    carregarListaDeLancamentos().then(()=>{
        hideLoading()
    }).catch(()=>{
        hideLoading()
    })
})

function carregarListaDeLancamentos(){
    return new Promise((resolve, reject)=>{
        try{
            $.get(`${URL_BASE}/lancamento`, function(obj){
                var lancamentos = obj.data
    
                var tbody = $('#appLista table tbody');
                tbody.remove()
                $('#appLista table').append('<tbody />');
                tbody = $('#appLista table tbody');
                
                lamcamentos.forEach(lancamento => {
                    tbody.append(`<tr>
                        <td>${lancamento.placa}</td>
                        <td>${lancamento.anoModelo}</td>
                        <td>${lancamento.atualizadoEm}</td>
                        <td>${lancamento.anoFabricacao}</td>
                        <td>${lancamento.ativo}</td>
                        <td><button class="btn btn-default" onclick='deletarVeiculo("${lancamento.placa}")'><i class="material-icons">delete</i></button></td>
                    </tr>`)    
                });
    
                resolve()
            }, function(e){
                reject(e)
            })
        }catch(e){
            reject(e)
        }
    })
}

function cadastrar(){
    showLoading()

    var objCadastro = {
        placa: $('#inptPlaca').val(),
        anoModelo: $('#inptAno').val(),
        atualizadoEm: formatarData($('#inptDataAtualizado').val()),
        idCor: $('#selectCor option:selected').val(),
        anoFabricacao: $('#inptAnoFabricacao').val(),
        ativo: $('#checkAtivo').is(':checked')
    }

    $.ajax({
        url: `${URL_BASE}/veiculo`,
        type: 'post',
        contentType: "application/json; charset=utf-8",
        success: function( data ) {
            carregarListaDeVeiculos().then(()=>{
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

function deletarVeiculo(placa){
    showLoading()

    $.ajax({
        url: `${URL_BASE}/veiculo/${placa}`,
        type: 'delete',
        contentType: "application/json; charset=utf-8",
        success: function( data ) {
            carregarListaDeVeiculos().then(()=>{
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