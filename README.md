# DAT510 Assignment 3 - Blockchain
> A simple implementation of a blockchain using JavaScript and Vue.

## Implementing a simplified blockchain

### The contents of the directory

```
blockchain
└───build    // Folder containing code related to Part 2
└───config    // Folder containing configuration files related to webpack
└───node_modules // Folder containing installed packages, exogenous to Node.js core packages.
└───src    // Folder containing project code
└──────assets    // Folder containing project assets, like images etc. (not used)
└──────components    // Folder containing project code
│      │   Block.vue    // Vue component for displaying blocks in the blockchain
│   │   App.vue    // The root Vue component being bound to the div with id "app" in the DOM
|   |   Block.js // Class representing a block in the blockchain with relevant methods and properties
|   |   Blockchain.js    // Class representing a blockchain (array of blocks) and methods to perform operations on the chain
|   |   helpers.js    // File containting and exporting various helper methods
|   |   main.js    // Entry point for the application
└───static    // Folder for static assets (not used)
└───test // Folder holding test files (not used)
│   .babelrc // Babel JavaScript transpiler configuration
│   .editorconfig // Editor configuration, not important
│   .postcssrc  // Configuration file, not important
│   index.html // The HTML file containing the application being served by the webpack-dev-server
│   package-lock.json   // Lists the installed packages with exact version numbers
│   package.json    // Declares package dependencies for the project
│   README.md    // Various information and instructions
```



### Setup and installation
The assignment was solved using JavaScript and Node.js. To be able to run the programs, Node.js need to be installed.
Download and install Node.js using this link: [https://nodejs.org/en/download/]
The installer should add Node.js to your path. To check that your installation completed successfully you can run `node -v`
to print the current version of Node.js installed on the machine.

Depending on the operating system you are using, the dependencies required may or may not work out of the box. 
If you are having issues with any of the dependencies I recommend deleting the "node_modules" folder and running:
`npm install`. this will reinstall all packages the project depends on. NPM is a package manager for Node, and is installed alongside it by default.

Your should now be ready to run the code.

### About the program
The project was implemented in JavaScript, to be executed in the browser. Webpack and webpack-dev-server was used to bundle and server the HTML and JavaScript files involved. The graphical user interface (view) was build using the Vue front-end framework. By using Vue, dynamic binding between the elements on the page and the internal state of the application is abstracted away from the developer. The significant amount of event handlers necessary to implement the project in vanilla JavaScript is avoided by the use of the Vue. Whenever the application’s internal state changes, a re-render of the applications GUI is done automatically. Due to the technicalities of the GUI not being an important part of the project, the intricacies of the Vue framework and its usage in this project is not detailed here.

For readers unfamiliar with the Vue framework, note the following:
-	A Vue project is composed of components. A component independently handles its own state, has a render function expressing how it should be rendered in the Document Object Model (DOM), and holds various methods to work with the components data.
-	“.vue”-files contain configuration objects for the applications components.
-	The “methods” property contains an object of methods that work with the applications state.
-	Methods can be registered as click-event-handlers using the “@click=”methodName()” notation in the template definition of the Vue component.

The Blockchain implementation can be understood independently and does not require understanding of the Vue framework or single-file-components (“.vue” files).

The blockchain implementation is split into two classes; Block and Blockchain. The Block class is used to create blocks which are held in an array assigned to a “chain” property on the blockchain object, generated from the Blockchain class. The Block class defines methods which act on the individual blocks in isolation, while the Blockchain class hold methods which act on the blockchain as a whole (multiple blocks). When constructing a new blockchain the chain is set to an empty array, then the chain is initialized with a genesis block with hard coded values for the “prevHash” and “txRoot” properties. Then the “addBlock” method can be used to add new blocks to the chain. This method will also calculate the hash of the previous block’s header and calculate the Merkle root of the block’s transactions and assign the results to the “prevHash” and “txRoot” properties respectively. It is this mechanism which ensures blocks cannot change unnoticed when other blocks have been chained after it.

In order to demonstrate how corrupted blocks are discovered through validating the chain of “prevHash” values, which depend on each other, methods were added to the Blockchain class. These methods can add transactions to blocks which are already members of the blockchain and validate the blockchain by recalculating all hashes in the chain. The validation method is able to find discrepancies in the hash values and register the errors on the block they concern. These errors are then reported to the user via the GUI. 

The hashing algorithm used in this project is SHA256, it was chosen because it is a hashing algorithm used in the Bitcoin network. It is also a more secure variant than its predecessor SHA-1. SHA256 is a cryptographically secure hashing algorithm, meaning that it is infeasible to compute the inverse of the hash and get back to the original value.


### Run webpack-dev-server to serve the application to your browser

``` bash
# serve with hot reload at localhost:8080
npm run dev
```


For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
