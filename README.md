# Introduction

`abi-mediabox` is a class designed to read and analyze the structure of mp4, mov files.
Ideal for damaged video files. Careful header search and atom structure analysis.

# Usage

```javascript
	let func_scan = function(event){
		// use this function for the progress information
	}

	let mbox = new abi_mediaBox({
		ignoreErrors: true
	}, func_scan);

	fileInput = document.getElementById('input-file');
	fileInput.addEventListener('change', (event) => {
		BOX.scanFile(event.target.files[0], (data) => {
			console.log(data);
		});
	});
```

# Author

Thank you for your interest in my library. I look forward to getting feedback from you.

Regards
Alexander Momot
https://www.zombler.com

# License

MIT





