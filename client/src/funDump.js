const movieData = await MovieBookApi.getMovie(imdbid);

class MovieBookApi {
    // the token for interaction with the API will be stored here.
    static token;


static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${MovieBookApi.token}` };
    const params = (method === "get")
        ? data
        : {};

    try {
        const result = await axios({ url, method, data, params, headers });
        return result.data;
    } catch (err) {
        console.error("API Error:", err.response);
        let message = err.response.data.error.message;
        throw Array.isArray(message) ? message : [message];
    }
}



static async getMovie(imdbid, data){
    console.log("api:82", imdbid);
    console.log("api:83", data);
    let res = await this.request(`movies/${imdbid}`, data, "get");
    return res;
}

}

router.get("/:imdbid", ensureLoggedIn, async function (res, req, next) {

    const imdbid = req.params.imdbid;

    try {
        const movie = await Movie.get(imdbid);
        res.json(movie); // Send the movie back as a JSON response
    } catch (err) {
        next(err); // Handle errors appropriately
    }
});
