/**
 * Generate function that will eval your code
 * @param {Object} deps - dependencies
 * @param {String | Number} deps.accountId - NetSuite Account id
 * @param {String} deps.email - access email
 * @param {String} deps.password - access password
 * @param {String} [deps.envioriment=sandbox] - envioriment to eval code "sandbox" or production "na1, na2 etc...",
 * @param {String} [deps.apiVersion=2.0] - SuiteScript api version
 * @return {Function}
 */
module.exports = ({ accountId, email, password, envioriment="sandbox", apiVersion="2.0" }) => {
    const axios = require('axios')
    const HOST = `https://debugger.${envioriment}.netsuite.com`
    const PATH = '/app/common/scripting/scriptdebugger.nl'
    const URL = HOST + PATH

    const closeSession = () => {
        const nsPayload = `<nsDebugRequest operation='invalidateDebugSession'></nsDebugRequest>`

        return axios.post(URL, nsPayload)
    }

    const openSession = (sourceCode) => {
        const nsPayload = `<nsDebugRequest operation="adhoc">
                   <script runtimeversion="${apiVersion}">
                     <![CDATA[${sourceCode}]]>
                     </script>
                     <url>
                       <![CDATA[]]>
                     </url>
                   </nsDebugRequest>`

        return axios.post(URL, nsPayload)
    }

    const run = (debuggerSessionId) =>  {
        const nsPayload = `<nsDebugRequest operation='go' debugsessionid='${debuggerSessionId}'>
             </nsDebugRequest>`

        return axios.post(URL, nsPayload)
    }


    axios.defaults.headers.post['Content-Type'] = 'text/xml; charset=UTF-8'
    axios.defaults.headers.post['NSXMLHttpRequest'] = 'NSXMLHttpRequest'
    axios.defaults.headers.post['Authorization'] = `NLAuth nlauth_account = ${accountId}, nlauth_email = ${email}, nlauth_signature = ${password}`
    /**
     * Function connected to netsuite debugger
     * @param {String} sourceCode - source code to eval
     * @return {Promise}
     */
    return (sourceCode) => {
        return openSession(sourceCode)
            .then(response => run(response.data.debuggerState.debugsessionid))
            .then(response => response.data.debuggerState)
            .catch(e => Promise.reject(e))
    }
}
