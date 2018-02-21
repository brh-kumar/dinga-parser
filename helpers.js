var exports = module.exports = {};
var fs = require('fs');
var settings = require('./settings.json');

// Prototype method to convert headers name to camelCase
String.prototype.toCamelCase = function () {
  return this.toLowerCase().replace(/ ([a-z])/g, function (g) {
    return g[1].toUpperCase();
  });
};

var deStringify = function (value) {
  if (value[0] === '[' || (value === 'true' || value === 'false') || /^[0-9]+$/.test(value)) {
    return JSON.parse(value);
  }
  if (value === 'null' || value === 'undefined' || value === 'NaN') {
    return '';
  }
  return value;
};

var isEmpty = function (object) {
  if (obj == null) return true;
  if (obj.length > 0) return false;
  if (obj.length === 0) return true;
  if (typeof obj !== 'object') return true;
  for (let key in obj) {
    if (hasOwnProperty.call(obj, key)) return false;
  }
  return true;
};

// Exports functions
exports.deStringify = deStringify;

exports.isEmpty = isEmpty;

exports.getOptions = function () {
  let method;
  let processArgv = process.argv;
  let isValid = true;
  let formattedArguments = {};
  let { mandatoryArguments, optionalArguments, options } = settings;

  // Error Messages
  var errorMessages = {
    syntax: () => {
      console.log('Syntax Error: Please follow the syntax');
      console.log('Syntax: node parser.js -file FileName -method MethodName -collection CollectionName \n');
    },

    invalidMethod: () => {
      console.log('Sorry, invalid method. Please provide valid method.');
    },

    invalidArgument: (argumentName) => {
      console.log(`-${argumentName} (-${options[argumentName].alias}) required!`);
    }
  };

  // Private function
  function getArgumentValue (arg, alias, optional = false) {
    let argumentIndex = (processArgv.indexOf('-' + arg) > -1 && processArgv.indexOf('-' + arg)) || processArgv.indexOf('--' + arg);
    let argumentValue;

    argumentIndex = (alias && argumentIndex === -1 && (processArgv.indexOf('-' + alias) > -1 && processArgv.indexOf('-' + alias)) || processArgv.indexOf('--' + alias)) || argumentIndex;
    argumentValue = processArgv[argumentIndex + 1];

    if (argumentIndex === -1 || !argumentValue) {
      if (!optional) errorMessages.invalidArgument(arg);
      return 'invalid!';
    }

    return deStringify(argumentValue);
  }

  // If no arguments passed then console sytax error and exit();
  if (processArgv.length === 2) {
    errorMessages.syntax();
    process.exit();
  }

  // methodName - key attribute of the program
  // defines the nature of the process
  method = getArgumentValue('method', options['method'].alias);
  if (method === 'invalid!') {
    errorMessages.invalidMethod();
    process.exit();
  }

  formattedArguments['method'] = method;

  // Validating mandatory arguments by methodName
  // If not-valid argument then throw invalid! error and continue loop
  // If it's valid argument then save it to formattedArguments
  // -cln chats it'll be saved as {collectionName: 'chats'}
  mandatoryArguments[method].forEach(mandatoryArgument => {
    let value = getArgumentValue(mandatoryArgument, options[mandatoryArgument].alias);
    if (value === 'invalid!') isValid = false;

    value = (value === true || value === 'y') && 'Y' || value;
    formattedArguments[mandatoryArgument] = value;
  });

  // If mandatory argument/s is not found or any invalid argument/s found then exit();
  if (!isValid) {
    process.exit();
  }

  // Extracting optional arguments if there any
  optionalArguments.forEach(optionalArgument => {
    let value = getArgumentValue(optionalArgument, options[optionalArgument].alias, true);
    value = (value === true || value === 'y') && 'Y' || value;
    if (value !== 'invalid!') formattedArguments[optionalArgument] = value;
  });

  if (formattedArguments['keyIndex']) formattedArguments['keyIndex'] = formattedArguments.keyIndex - 1;

  return formattedArguments;
};

exports.checkFile = function (fileName) {
  let allowedFileExtension = settings.allowedFileExtension;
  let fileExtension = fileName.split('.').pop();
  let path;
  let existsSync;

  if (allowedFileExtension.indexOf(fileExtension) === -1) {
    console.log(`Sorry, .${fileExtension} is not allowed`);
    process.exit();
  }

  path = `${__dirname}/${fileName}`;
  existsSync = fs.existsSync(path);
  if (!existsSync) {
    console.log(`File "${fileName}" does not exists in the directory ${__dirname}/`);
    process.exit();
  }
};
