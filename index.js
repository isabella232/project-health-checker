const findInFiles = require('find-in-files');
let amountOfJs;

findInFiles.find('', './test', '.js$').then(results => 
	amountOfJs = Object.keys(results).length
);

findInFiles.find("from 'i18next*';", './test', '.js$').then(results => 
	console.log(
		'Porcentaje de uso de internacionalización del total: ',
		(Object.keys(results).length / amountOfJs * 100).toFixed(2)
	)
);

findInFiles.find('=> {', './test', '.js$').then(results => 
  console.log(
    'Porcentaje de uso de arrow functions del total: ',
    (Object.keys(results).length / amountOfJs * 100).toFixed(2)
  )
);

findInFiles.find('([A-Z][a-z]+)+', './test', '.scss$').then(results => 
  console.log('Cantidad de archivos con cammel case en sass: ', Object.keys(results).length)
);
