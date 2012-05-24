var hideLoginPanel = function() {
	$(this).detach()
}

var showLoginPanel = function() {
	

	var form = '<div class="row"><form method="" action="">';
	form += '<p><label for="username">Username</label>';
	form += '<input type="text" id="username"></p>';
	form += '<p><label for="password">Password</label>';
	form += '<input type="password" id="password"></p>';
	form += '<p><input type="submit" value="Login" class="btn btn-primary btn-large"></p>';
	form += '</form></div>';


	var loginBox = $('<div class="container"></div>')

	var dialogLogin = $('<div class="dialog-login"></div>')
				.append(form)
				.appendTo(loginBox).addClass('slide-down')
	
	
	$('<div class="dialog-wrapper"></div>')
		.append(loginBox)
		.appendTo('body')
		.on('click', hideLoginPanel)
	
	$('.dialog-wrapper input').on('keydown', function(e){
		e.stopPropagation()
	})
}

$('#login').on('click', showLoginPanel)
