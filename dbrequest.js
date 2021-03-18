const fetch = require("node-fetch");
const { DB_MS_PORT, DB_MS_URL } = require("./constants");

const dbrequest = async (route, reqBody={}) => {
  const reqURI = `${DB_MS_URL}:${DB_MS_PORT}/${route}`;
  console.log(reqURI);
  try {
    const response = await fetch(reqURI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(reqBody)
    });
    const body = await response.json();
    return body;
  } catch {
    throw new Error("Error while DB requesting");
  }
}

module.exports = dbrequest;