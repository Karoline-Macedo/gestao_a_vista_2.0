var user = document.getElementById("userLogin");
var senha = document.getElementById("senhaLogin");

function getLogin() {

  if (user.value == "" || senha.value == "") {
    window.alert("Preencha os campos de usuário e senha");
    return
  };

  const dados = {
      user: user.value,
      senha: senha.value
  };

//   console.log(dados);
  
  let url = "http://127.0.0.1:3333/get_login_user";
  let metodo = "POST";

//   console.log(url);

  fetch(url,   
    {
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      method: metodo, 
      body: JSON.stringify(dados)

    }).then(resp => {
      if (!resp.ok) {
          throw new Error('Erro na autenticação');
      }
      return resp.json();

    }).then(dados => {
      console.log(dados);

        if (dados.message === "Autenticação bem-sucedida") {
            window.location.href = '/public/menu.html';
        } else {
            alert("Usuário ou senha incorretos");
        };

    }).catch(error => {
        console.error("Erro na requisição:", error);
        alert("Erro ao realizar login. Por favor, tente novamente.");
    });
};