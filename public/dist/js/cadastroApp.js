//const URL_BASE = "https://consultorfinanceiro-back.herokuapp.com/api"
//const URL_BASE = "http://192.168.43.160:8080/api"
const URL_BASE = "http://localhost:8080/api"

$(()=>{
    $('#btnCadastrar').click(()=>{
        var objCadastro = {
            login: $('#inptLogin').val(),
            senha: $('#inptSenha').val(),
            nomeUsuario: $('#inptNome').val(),
            email: $('#inptEmail').val(),
            dataImplantacao: moment(new Date()).format("DD-MM-YYYY"),
            dataCadastro: moment(new Date()).format("DD-MM-YYYY")
        }

        $.ajax({
            url: `${URL_BASE}/conta`,
            type: 'post',
            contentType: "application/json; charset=utf-8",
            success: function( retorno ) {
                localStorage.setItem("usuarioLogado", JSON.stringify(retorno.data))
                window.location = "/index.html"
            },
            error: function (request, status, error) {
                alert('ERRO ao Efetuar cadastro: '+request.responseJSON.msgError)
            },
            data: JSON.stringify(objCadastro),
            processData: false
        });
    })

    $('#btnVoltar').click(()=>{
        history.back();
    })
})