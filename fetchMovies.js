const fs = require("fs");
const fetch = require("node-fetch");
const API_KEY = "f349eb3e";
const TERM = "movie";

const JSON_PATH = "./public/movies.json";

async function fetchMovies() {
  let movies = [];
  let page = 1;
  let Total_Movies = [];

  while (page <= 10) {
    const res = await fetch(
      `https://www.omdbapi.com/?s=${TERM}&page=${page}&apikey=${API_KEY}`
    );
    const data = await res.json();
    if (data.Response == "True") {
      // movies = movies.concat(data.Search);
      Total_Movies.push(data.Search);
    } else {
      console.log("Error on fetching movies", data.Error);
      break;
    }
    page++;
  }
  // console.log(`Fetched ${.length} movies from the API`);
  console.log(Total_Movies[0] == Total_Movies[1]);
  fs.writeFileSync(JSON_PATH, JSON.stringify(Total_Movies, null, 2));
  console.log(
    `Successfully saved ${Total_Movies.length} movies to movies.json`
  );
}

fetchMovies();
