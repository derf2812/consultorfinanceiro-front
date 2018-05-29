const URL_BASE = "https://consultorfinanceiro-back.herokuapp.com/api"
//const URL_BASE = "http://192.168.43.160:8080/api"
//const URL_BASE = "http://localhost:8080/api"

$(()=>{
    $('#btnLogar').click(()=>{
        var objLogin = {
            login: $('#inptLogin').val(),
            senha: $('#inptSenha').val()
        }

        $.ajax({
            url: `${URL_BASE}/conta/login`,
            type: 'post',
            contentType: "application/json; charset=utf-8",
            success: function( retorno ) {
                localStorage.setItem("usuarioLogado", JSON.stringify(retorno.data))
                window.location = "/index.html"
            },
            error: function (request, status, error) {
                alert('ERRO ao Efetuar login: '+request.responseJSON.msgError)
            },
            data: JSON.stringify(objLogin),
            processData: false
        });
    })
})