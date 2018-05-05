const URL_BASE = "http://fiscal-data.herokuapp.com/api"

const cores = []

$(()=>{
    showLoading()

    $.get(`${URL_BASE}/cor`, function(obj){
        var selectorCor = $('#selectCor');
        obj.data.forEach(cor=>{
            cores.push(cor)
            selectorCor.append(`<option value='${cor.id}'>${cor.descricao}</option>`)
        })
    })

    carregarListaDeVeiculos().then(()=>{
        hideLoading()
    })
})

function carregarListaDeVeiculos(){
    return new Promise((resolve, reject)=>{
        $.get(`${URL_BASE}/veiculo`, function(obj){
            var veiculos = obj.data

            var tbody = $('#appLista table tbody');
            tbody.remove()
            $('#appLista table').append('<tbody />');
            tbody = $('#appLista table tbody');
            
            veiculos.forEach(veiculo => {
                tbody.append(`<tr>
                    <td>${veiculo.placa}</td>
                    <td>${veiculo.anoModelo}</td>
                    <td>${veiculo.atualizadoEm}</td>
                    <td>${getCor(parseInt(veiculo.idCor))}</td>
                    <td>${veiculo.anoFabricacao}</td>
                    <td>${veiculo.ativo}</td>
                    <td><button class="btn btn-default" onclick='deletarVeiculo("${veiculo.placa}")'><i class="material-icons">delete</i></button></td>
                </tr>`)    
            });

            resolve()
        })
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