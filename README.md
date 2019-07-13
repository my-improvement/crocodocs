Welcome to crocodocs!

This package allows you documentating your source codes in more simple steps.

## Installation ##

1. If you have not installed Node.js, [install](https://nodejs.org/) it first.

## Usage ##

1. To create an information about script description, create a single comment contains ```CROCOS```, following your script's description.
2. To create an information about function, create a single comment contains ```CROCOF``` above your function, then next to it add your function's description.

## Example ##

```
//CROCOS App delegate script, this script is to be the first script to load when user opened the app

//CROCOF Setting label content
@IBAction func setContent( 
    in label: ActiveLabel,
) {
    
}
```

## Commands ##

1. ```npx crocodocs run``` to generate the documentation after done editing project. Must run it from the project root path.
2. ```npx crocodocs clean``` to clean all the documentation pdf files. Must run it from the project root path.
3. ```npx crocodocs -h``` to see help instructions.