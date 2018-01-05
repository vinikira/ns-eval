require('dotenv').config()

const nsEval = require('./index.js')({
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
