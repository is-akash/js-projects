
### For `config.apiKey`

- This is to avoid the apiKey to upload into github.

Create a `config.js` file in the root directory and paste this :

Website: https://api-ninjas.com/

API : https://api.api-ninjas.com/v1/loremipsum

// config.js

```js
const config = {
	apiKey: 'your api key',
};
```
Then go-to `index.html` and add this line

```html
	<head>
        // -- rest code --
		<script src="config.js" defer></script> // added here
		<title>Speed Typing</title>
	</head>
```

Add this `config.js` to `.gitignore`


// .gitignore

```
config.js
```