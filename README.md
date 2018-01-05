# ns-eval
Remote NetSuite script evaluation with Debugger tool.

## Installing
__NPM__

```sh
npm install ns-eval
```

## Get started
#### Eval string code

```javascript
require('dotenv').config()

const nsEval = require('ns-eval')({
    accountId: process.env.NSEVAL_ACCOUNT_ID,
    email: process.env.NSEVAL_EMAIL,
    password: process.env.NSEVAL_PASSWORD
})

nsEval('log.debug("testing", "this is just a test.")')
    .then(response => {
        const consoleDebuggerMessages = response.console.map(cout => `${cout.subject}: ${cout.details || cout.timestamp}`)

        console.log(consoleDebuggerMessages.join('\n'))
    })
.catch(console.log)

/**
 * output:
 * testing: this is just a test.
 * usage 0, time 1085: 5/1/2018 17:21:40.357
 */
```

### Eval script file

```javascript
require('dotenv').config()
const fs = require('fs')

const nsEval = require('ns-eval')({
    accountId: process.env.NSEVAL_ACCOUNT_ID,
    email: process.env.NSEVAL_EMAIL,
    password: process.env.NSEVAL_PASSWORD
})

const scriptFileContent = fs.readFileSync('your-script-file.js', 'utf-8')

nsEval(scriptFileContent)
    .then(response => {
        //your logic here
    })
    .catch(console.log)
```
