
const RegularExpressions = {

	email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
	name: /^[a-z\u00C0-\u02AB'´`]+\.?\s?([a-z\u00C0-\u02AB'´`]+\.?\s?)*$/i

}

export default RegularExpressions;