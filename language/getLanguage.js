const fs = require('fs');
const files = fs.readdirSync('./language').filter((f) => f.endsWith('.json'));
let langs = {};
for (f of files) {
	langs[f] = fs.readFileSync('./language/' + f, 'utf-8');
}
module.exports = (req, res, next, lang) => {
	if (langs[lang + '.json']) {
		req.lang = JSON.parse(langs[lang + '.json']);
		next();
	} else res.redirect(307, '/en' + req.url);
};
