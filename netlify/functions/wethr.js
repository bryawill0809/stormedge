const WETHR_KEY = "072498d0da1188dcf6f8c4cd5f6d4f5d7a3db35a79a19c051be7051d135b971d";

exports.handler = async (event) => {
  const params = { ...(event.queryStringParameters || {}) };
  const file = params._file || "observations.php";
  delete params._file;
  Object.keys(params).forEach(k => { if (!params[k]) delete params[k]; });
  const qs = new URLSearchParams(params).toString();
  const url = `https://wethr.net/api/v2/${file}${qs ? "?" + qs : ""}`;
  console.log("Proxying:", url);
  try {
    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${WETHR_KEY}`,
        "Accept": "application/json",
        "User-Agent": "StormEdge/1.0"
      }
    });
    const text = await response.text();
    return {
      statusCode: response.status,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: text
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Proxy error: " + err.message })
    };
  }
};
