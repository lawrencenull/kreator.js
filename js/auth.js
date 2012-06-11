var hideLoginPanel = function() {
	$(this).detach();
	$('.dialog-login').detach();
}

var showLoginPanel = function() {
	
	$('<div class="dialog-wrapper"></div>')
		.appendTo('body')
		.on('click', hideLoginPanel)

	var form = '<div class="container">';
	form += '<div class="row"><div class="span4"><form method="" action="">';
	form += '<p><label for="username" required>Username</label>';
	form += '<input type="text" id="username"></p>';
	form += '<p><label for="password" required>Password</label>';
	form += '<input type="password" id="password"></p>';
	form += '<p><input type="submit" value="Login" class="btn btn-primary btn-large"></p>';
	form += '</form></div>';
	form += '<div class="span4"><h3>Sign in with your github account ';
	form += ' <img src="./img/github.png"></h3>';
	form += '<ul><li>You will be able to save presentations as gists</li></ul></div></div></div>';


	var loginBox = $('<div class="dialog-login"></div>')
			.append(form)
			.appendTo('body')
	
	$('.dialog-wrapper input').on('keydown', function(e){
		e.stopPropagation()
	})
}

$('#login').on('click', showLoginPanel)
