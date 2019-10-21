# Welcome to crocodocs

Create documentation more comfortably 🤩

### Installation

You only need [Node.js](https://nodejs.org/en/) to run this package

### Usage

Comment your lines with

```//Dev YourDescription``` this will declare a script description with description in the documentation

```//VAR TypeData; VariableName; YourDescription``` this will declare a variable with name, type data and description in the documentation

```//FUN TypeData; FunctionName; YourDescription``` this will declare a function with name, type data and description in the documentation

```//PARAM TypeData; ParameterName; YourDescription``` this will declare a function parameter with name, type data and description in the documentation

Your variable or function with / without parameter comments should be exactly above the variable or the function

### Example

```
//DES This is a sample hello-world script in react-native

import React from "react"

import {
    Text,
    View
} from "react-native"

export default class HelloWorld extends React.Component {
    //VAR String; textValue; This variable contains a text that to be shown at the screen
    textValue = "Hello World"

    render() {
        return (
            <View
                style = {{
                    alignItems: "center",
                    flex: 1,
                    justifyContent: "center"
                }}
            >
                <Text
                    style = {{
                        fontSize: 24
                    }}
                >
                    {GetTextValue()}
                </Text>
            </View>
        )
    }

    //FUN String; GetTextValue(); This function is used to get textValue state
    //PARAM String; additionalText; Additional text to be added at textValue
    GetTextValue(additionalText) {
        return this.state.textValue + additionalText
    }
}
```

### Exporting a documentation

After done with commenting scripts, to export a documentation just run ```npx crocodocs create``` in command prompt / terminal at project's root path, your documentation should be opened directly after finish exporting, you can also find the file at PROJECT'S_ROOT_PATH/documentation/index.html

### Customizing documentation preferences

Create json file named ```crocodocs_prefs.json``` on the project's root path like this

```
{
    "name": "Project Name",
    "colors": {
        "navbar": "goldenrod",
        "date": "#000",
        "content_container": "dimgray",
        "title": "rgb(255,255,255)",
        "list_of_contents_title": "rgb(255,255,255)", 
        "list_of_contents": "gold",
        "script_name": "rgb(255,255,255)",
        "type": "red",
        "name": "gold",
        "description": "lightgray",
        "param_type": "greenyellow",
        "param_name": "gold",
        "param_description": "darkgray"
    }
}
```

You can fill the string value of name and colors as you like