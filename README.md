submitter
=========

Automatically submitting forms with AJAX

## Features

- Recover all data of inputs in form
- Recover div content as inputs content
- Allow submit button outside the form (add target="your-form-name" to your submit input)
- Use img tags as input[type="file"]

## Installation

Download and extract the last release from [here](https://github.com/jacoborus/submitter/archive/master.zip) or install with Bower
```
$ bower install submitter
```

## Usage

Link `submitter.js` from your html file
```
<script src="path/to/submitter.js"></script>
```

or load it with browserify in your .js file
```js
var submitter = require("path/to/submitter.js");
```

Then apply **submitter** to your form

```js
var options = {
	init : function () {
		// do something on start request
	},
	finish : function () {
		// do something on start request
	},
	progress : function (p) {
		// do something with 'p' (percentaje, number 0-100)
	},
	fail : : function (error) {
		// do something with error after failed request
	},
	success : function (data) {
		// do something with data after successfull request
	}
}

submitter('your_form_name', options);
```

<br><br>

---

© 2014 [jacoborus](https://github.com/jacoborus)

Released under [MIT License](https://raw.github.com/jacoborus/submitter/master/LICENSE)