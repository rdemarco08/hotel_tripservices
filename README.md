# node2uapi

## Setup
Install Node v0.10.32 https://nodejs.org/en/blog/release/v0.10.32/

In the terminal at the project root directory, run "npm install"

Make sure the node_modules that get installed match the versions in the main package.json

Apigee uses a runtime module named trireme that uses a Java Virtual Machine to run your node app.

New modules relying on node 4.0 will not work in the Apigee environment 

I made sure all my modules were compatible with Node 0.10.32 by checking: https://registry.npmjs.org/<module_name>
