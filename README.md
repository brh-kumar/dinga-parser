# Dinga Parser

To parse csv file to JSON or insert into mongo collection. Uses [fast-csv](https://www.npmjs.com/package/fast-csv) and [mongojs](https://www.npmjs.com/package/mongojs).


## Installation

Download or clone the project:

```
npm install
```

## Options

Options can be passed by "-" or "--" notation:

```
Options:
  (name(alias)       - description)
  collection(c)      - mongo collection name
  databaseUrl(dbUrl) - databaseUrl to connect mongodb via mongojs
  file(f)            - location of the csv file (relative path)
  hasHeaders(hh)     - defines whether csv file has headers or not (Y/N) [default N]
  keyIndex(ki)       - defines primary column in csv table, should be in number.
  method             - mandatory option to run the program, can mention only defined methods ref. settings.json -> mandatoryArguments
  removeDuplicate    - duplicate records should be removed or not (Y/N) [default N]
  sort               - records will be sorted i Descending order (Y/N) [default N]
```

## Usage

#### Save to JSON
```
node parser.js -m saveToJSON -hh Y -rd Y -ki 1 -f files/candidates.csv -dbUrl localhost/myDb -c candidates
```
Output file will be save to specified directory ref. settings.json -> saveToDir


#### Insert to Collection
```
node parser.js -m insertToCollection -hh Y -rd Y -ki 1 -f files/company-data.csv -dbUrl localhost/myDb -c company
```
