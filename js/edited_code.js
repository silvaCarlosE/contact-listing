document.addEventListener('DOMContentLoaded', function() {

	saveButton 	= document.getElementById('salvar'),
	nome 		= document.getElementById('nome'),
	telefone 	= document.getElementById('telefone'),
	contactList = document.getElementById('contactList');

	//Usar as configurações de seu próprio projeto (web) exibidas no console do firebase.google.com
	var config = {
	    apiKey: "<sua api key>",
	    authDomain: "seu auth domain",
	    databaseURL: "a url do seu banco",
	    projectId: "id do seu projeto",
	    storageBucket: "caso usemos o storage (para guardar imagens ou outros dados), colocar a referência aqui.",
		messagingSenderId: "sender id do seu projeto"
	};

	//inicializando o firebase app
  	var app 	 = firebase.initializeApp(config),
		database = app.database();

	//criar a referência do banco apontando para os itens de contatos
	var databaseRef = database.ref().child('contatos');

  	//criar um listener para o evento do clique do botão salvar
  	saveButton.addEventListener('click', function(evt){
  		var contato = { nome: nome.value, telefone: telefone.value };
  		databaseRef.push().set(contato);
    	nome.value = '';
    	telefone.value = '';
  	});

  	//Para o firebase, sempre que tivermos alguma adição de contato precisaremos alterar os dados na tela
	databaseRef.on('child_added', function(snapshot) {
		var contato = snapshot.val();
		adicionarContato(contato, snapshot.key);
	});

	//Função que faz a adição do elemento na nossa página html
	function adicionarContato(contato, contactKey){

		//Cria um table row e uma primeira coluna
		var tr = document.createElement('tr');
    	var contactName = document.createElement('td');
      	contactName.innerText = contato.nome;
      	tr.appendChild(contactName);

      	//Faz o mesmo para telefone
      	var telefoneElm = document.createElement("td");
		telefoneElm.innerText = contato.telefone;
		tr.appendChild(telefoneElm);

      	//Define uma coluna para a ação que se pode tomar com o botão
      	var action = document.createElement("td");
      	
      	//Cria um botão de deleção e adiciona ele junto aos outros elementos
      	var deleteButton = document.createElement("button");

      	//Adiciona o id do contato no botão para ter controle sobre qual contato estamos lidando
      	deleteButton.setAttribute("id", contactKey);

      	//Define o evento onclick do botão remover
		deleteButton.onclick = removerContato;
		deleteButton.innerHTML = "Remover";

		//Adiciona delete button to td action
		action.appendChild(deleteButton);

		//FInalmente adiciona deleteButton aos elementos html
      	tr.appendChild(action);

      	//Adiciona a unidade de contato na table row criada
      	contactList.appendChild(tr);
	}

	//Função remover contato recebe um parâmetro diferente...
	function removerContato(contato){
		//Atribuímos a contactToRemove a key do contato que necessitamos remover
		contactToRemove = contato.path[0].id;

		//Remove o item passando a chave como referência
		databaseRef.child(contactToRemove).remove();

		//Recarrega a página para a listagem correta de contatos
		window.location.reload();
	}
});
