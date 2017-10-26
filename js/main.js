document.addEventListener('DOMContentLoaded', function() {

	saveButton 	= document.getElementById('salvar'),
	nome 		= document.getElementById('nome'),
	telefone 	= document.getElementById('telefone'),
	contactList = document.getElementById('contactList');

	var config = {
	    apiKey: "AIzaSyDj33K4YlBhSh_nXaiL_l58J8-M2mCWH4Q",
	    authDomain: "agenda-7614f.firebaseapp.com",
	    databaseURL: "https://agenda-7614f.firebaseio.com",
	    projectId: "agenda-7614f",
	    storageBucket: "",
		messagingSenderId: "901292896969"
	};

  	var app = firebase.initializeApp(config),
		database = app.database();

	var databaseRef = database.ref().child('contatos');

  	saveButton.addEventListener('click', function(evt){
  		if(nome.value != '' && telefone.value != ''){

  			var contato = { nome: nome.value, telefone: telefone.value };
  			databaseRef.push().set(contato);
  			nome.value = '';
    		telefone.value = '';
  		}else{
  			alert("Preencha todos os campos");
  		}  		
    	
  	});

	databaseRef.on('child_added', function(snapshot) {
		var contato = snapshot.val();
		adicionarContato(contato, snapshot.key);
	});

	function adicionarContato(contato, contactKey){
		var tr = document.createElement('tr');
    	var contactElm = document.createElement('td');
      	contactElm.innerText = contato.nome;
      	tr.appendChild(contactElm);

      	var telefoneElm = document.createElement("td");
		telefoneElm.innerText = contato.telefone;
		tr.appendChild(telefoneElm);

      	var deleteButton = document.createElement("button");
      	deleteButton.setAttribute("id", contactKey);
		deleteButton.onclick = removerContato;
		deleteButton.innerHTML = "Remover";

      	var action = document.createElement("td");
      	action.setAttribute("class", "action");
		action.appendChild(deleteButton);
      	tr.appendChild(action);
      	contactList.appendChild(tr);
	}

	function removerContato(contato){		
		contactToRemove = contato.path[0].id;
		databaseRef.child(contactToRemove).remove();
		contactList.removeChild(contato.path[2]);
	}
});
