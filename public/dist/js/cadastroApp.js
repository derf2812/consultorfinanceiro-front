const URL_BASE = "https://consultorfinanceiro-back.herokuapp.com/api"
//const URL_BASE = "http://192.168.0.12:8080/api"
//const URL_BASE = "http://localhost:8080/api"

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
        
        var cadastrar = validaCadastro()

        if(cadastrar)
        {
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
        }
        
    })

    $('#btnVoltar').click(()=>{
        history.back();
    })
})

function validaCadastro()
{
    var loginDigitado = document.getElementById("inptLogin").value
    var senhaDigitada = document.getElementById("inptSenha").value
    var repetirSenhaDigitada = document.getElementById("inptSenha2").value
    var emailDigitado = document.getElementById("inptEmail").value
    var nomeDigitado = document.getElementById("inptNome").value

        if(loginDigitado.length < 5)
        {
            alert("LOGIN inválido. Seu login deve possuir no mínimo 5 caracteres.")
            return false
        }

        if(senhaDigitada.length < 5)
        {
            alert("SENHA inválida. Sua senha deve possuir no mínimo 5 caracteres.")
            return false
        }

        if(repetirSenhaDigitada != senhaDigitada)
        {
            alert("As SENHAS digitadas não coincidem. Por favor, digite novamente.")
            return false
        }

        if(emailDigitado.indexOf("@") < 0 )
        {
            alert("E-MAIL inválido. Por favor, informe um e-mail válido.")
            return false
        }

        if(nomeDigitado.indexOf(" ") < 0 )
        {
            alert("NOME inválido. Por favor, informe seu nome e sobrenome.")
            return false
        }

        return true
}