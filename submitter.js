(function() {
	var submitter = function (fName, options) {

		var form, getValues, upload, opts, buttons, bLen, j, btn;

		opts = options || {}
		opts.init = opts.init || function () {};
		opts.progress = opts.progress || function (p) {};
		opts.finish = opts.finish || function () {};
		opts.fail = opts.fail || function (err) { console.log( err );};
		opts.success = opts.success || function (data) {console.log( data );};

		/**
		 * Get form values
		 * @param  {Object} form  target form
		 * @return {Object}       object with form values
		*/

		getValues = function (form) {
			var data, i, inputs, textareas, _editables, x, len;

			inputs = form.elements;
			data = new FormData();

			// store values
			for (i = 0, len = inputs.length; i < len; i++) {
				x = inputs[i];
				switch (x.type) {
					// file inputs
					case 'file':
						// check if contain files
						if (x.files && x.files.length !== 0) {
							// on single file
							if (x.files.length === 1) {
								data.append(x.name, x.files[0]);
							// more than one file
							} else {
								data.append(x.name, x.files);
							}
						};
						break;
					// inputs with multiple instances
					case 'radio':
						if (x.checked) {
							data.append( x.name, x.value);
						}
						break;
					case 'checkbox':
						data.append( x.name, x.checked);
						break;
	                // regular inputs
	                default:
	                    if (inputs.hasOwnProperty(i)) {
	                        data.append(x.name, x.value);
	                    };
	                    break;
				}
			}

			_eds = form.getElementsByClassName('editable');
			for (i = 0, len = _eds.length; i < len; i++) {

				if (_eds.hasOwnProperty( i )) {
					data.append( _eds[i].attributes.name.value, _eds[i].innerHTML );
				}
			}

			return data;
		};

		upload = function (form) {
			var data, request, _URL, method;
			// target url
			_URL = form.action;
			method = form.getAttribute( 'method' );

			// recover all data
			data = getValues(form);

			request = new XMLHttpRequest();

			request.onreadystatechange = function() {
				var e, resp;
				if (request.readyState === 1) {
					opts.init();
				}
				if (request.readyState === 4) {
					try {
						return resp = JSON.parse(request.response);
					} catch (_error) {
						e = _error;
						resp = {
							status: 'error',
							data: 'Unknown error occurred: [' + request.responseText + ']'
						};
						opts.fail(resp);
					}
				}
			};

			request.upload.addEventListener( 'progress', function (e) {
				return opts.progress( (e.loaded / e.total) * 100);
			}, false);

			request.onload = function () {
				return opts.success(this.responseText);
			};

			request.addEventListener( "error", function (e) {
				console.log('falló');
				return opts.fail( e );
			}, false );

			request.open( method, _URL );
			return request.send(data);
		};

		form = document.forms[fName];

		// Allow external submit buttons
		buttons = document.getElementsByTagName('input');

		for (j = 0, bLen = buttons.length; j < bLen; j++){

			if (buttons[j].attributes.target && buttons[j].attributes.target.value === fName && buttons[j].attributes.type.value === 'submit') {
				buttons[j].onclick = function (e) {
					upload(form);
					return e.preventDefault();
				}
			}
		}

		// create inputs with type:file for images with attribute submmiter
		var formImgs = form.getElementsByTagName('img');
		var inp;
		for (j = 0, bLen = formImgs.length; j < bLen; j++){

			if (formImgs[j].attributes.submitter && formImgs[j].attributes.name) {
				// create input and set attributes
				inp = document.createElement( 'input' );
				inp.setAttribute( 'name', formImgs[j].attributes.name.value );
				inp.setAttribute( 'type', 'file' );
				inp.img = formImgs[j];
				inp.style.display = 'none';
				formImgs[j].inp = inp;

				inp.addEventListener( 'change', function (e) {
					var files = e.target.files || e.dataTransfer.files;
					var reader = new FileReader();
					var _this = e.target;

					reader.onload = function (e) {
						_this.img.src = e.target.result;
					};
					reader.readAsDataURL(files[0]);
				}, false);

				formImgs[j].onclick = function (e) {
					event = new Event('click');
					e.target.inp.dispatchEvent(event);
				}

				form.appendChild(inp);
			}
		}


		// Form binding
		return form.addEventListener( 'submit', function (evt) {
			evt.preventDefault();
			return upload( form );
		});
	};

	// node.js
	if((typeof module != 'undefined') && (typeof module.exports != 'undefined')) {
		module.exports = submitter;
	// browser
	} else if(typeof window != 'undefined') {
		window.submitter = submitter;
	}
})();