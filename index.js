const Local_Movies_Database = "public/movies.json";
let movies = [];

let currentPage = 1;
const moviesPerPage = 10;
const searchInput = document.getElementById("searchInput");
let Term = searchInput.value.trim().toLowerCase();
const Movies_Container = document.getElementById("Movies_Container");
const API_KEY = "f349eb3e";
const suggestions = document.getElementById("suggestions");
let z = 0;

async function Fetch_Movies_Auto_Suggestion(match_Movies) {
  console.log("hello")
  const searchTerm = searchInput.value.trim().toLowerCase();
  const URL = `https://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=${API_KEY}`;

  try {
    let page = 1;
    let Total_Movies = [];

    while (page <= 10) {

   
      const res = await fetch(
        `https://www.omdbapi.com/?s=${searchTerm}&page=${page}&apikey=${API_KEY}`
      );
      const data = await res.json();
      if (data.Response == "True") {
        Total_Movies.push(data.Search);
        
      } else {
        console.log("Error on fetching movies", data.Error);
        break;
      }
      page++;
    }
    
  

    
    // console.log(Total_Movies)

    if (Total_Movies.length > 0) {
      show_Suggestions(Total_Movies);
    } else {
      Movies_Container.innerHTML = "<p> No Movies </p>";
    }
  } catch (error) {
    console.log("Error : ", error);
  }
}

async function show_Movie_Details(imdbID) {
  let One_Movie;

  const res = await fetch(
    `https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`
  );

  One_Movie = await res.json();

  const popupDetails = document.getElementById("popupDetails");

  popupDetails.innerHTML = `

   <img src="${One_Movie.Poster}" alt = "${One_Movie.Title}">
   <h2>${One_Movie.Title}</h2>
   <p><strong>YEAR :</strong>${One_Movie.Year}</p>
   <p><strong>PLOT :</strong>${One_Movie.Plot}</p>
   <p><strong>RATING :</strong>${One_Movie.imdbRating}</p>

`;
  document.getElementById("moviePopup").style.display = "block";
  document.getElementById("Movies_Container").style.display = "none";
  document.getElementById("pagination").style.display = "none";
  document.getElementById("inputContainer").style.display = "none";
}

function closePopup() {
  document.getElementById("moviePopup").style.display = "none";
  document.getElementById("Movies_Container").style.display = "grid";
  document.getElementById("pagination").style.display = "flex";
  document.getElementById("inputContainer").style.display = "flex";
  
}

function display_Movies(Total_Movies_DB) {
  const start = currentPage - 1;

  // console.log(Total_Movies_DB);

  let paginatedMovies = Total_Movies_DB[start];

  Movies_Container.innerHTML = "";
  if (paginatedMovies.length == 0) {
    Movies_Container.innerHTML = "<p> No Movies Found</p>";
  } else {
    paginatedMovies.forEach((movie) => {
      const movie_card = document.createElement("div");
      movie_card.classList = "main_container";
      movie_card.innerHTML = `
           <img src="${movie.Poster}">
           <h3>${movie.Title}</h3>
           <h4>${movie.Year}</h4>
           `;

      movie_card.addEventListener("click", () => {
        show_Movie_Details(movie.imdbID);
      });
      Movies_Container.appendChild(movie_card);
    });
  }
  document.getElementById("pageNumber").innerText = `Page ${currentPage}`;
}

document.getElementById("nextBtn").addEventListener("click", () => {
  if (currentPage < movies.length) {
    currentPage++;
    display_Movies(movies);
  }
});

document.getElementById("prevBtn").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    display_Movies(movies);
  }
});

async function load_Local_Movies() {
  try {
    const res = await fetch("public/movies.json");
    movies = await res.json();

    display_Movies(movies);
  } catch (error) {
    console.log("Error : ", error);
  }
}

async function Auto_Suggestions() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  let match_Movies = [];
  if (searchTerm.length >= 3) {
    movies.forEach((movie) => {
      const match = movie.filter((m) =>
        m.Title.toLowerCase().includes(searchTerm)
      );
      if(match.length>0){
        match_Movies.push(match);
      }
      
    });
    console.log(match_Movies)


    if (match_Movies.length > 0) {
      // console.log("Hello")
      // if(match_Movies[0][0].Title.toLowerCase()!=""){
        show_Suggestions(match_Movies);
      // }
      // else{
      //   console.log("Empty")
      // }
      // show_Suggestions(match_Movies);
    } else {
      console.log("Hello")
    
      await Fetch_Movies_Auto_Suggestion();
    }
  } else {
    suggestions.style.display = "none";
  }
}

function show_Suggestions(Total_movies) {
  suggestions.innerHTML = "";

  if (searchInput.value.trim() === "") {
    suggestions.style.display = "none";
    return;
  }
  if (Total_movies.length > 0) {
    Total_movies.forEach((movies) => {
      movies.slice(0, 5).forEach((movie) => {
        const Suggestion_Item = document.createElement("div");
        Suggestion_Item.classList = "Suggestion_Item";
        Suggestion_Item.textContent = movie.Title;
        Suggestion_Item.onclick = () => {
          searchInput.value = movie.Title;
          suggestions.style.display = "none";

          show_Movie_Details(movie.imdbID);
        };
        suggestions.appendChild(Suggestion_Item);
        return;
      });
    });
  }
  suggestions.style.display = "block";
}

searchInput.addEventListener("focus",()=>{
  if(searchInput.value.trim().length>0){
    suggestions.style.display = "block";
  }
})

document.addEventListener("click",(e)=>{
  if(!searchInput.contains(e.target)&& !suggestions.contains(e.target)){
    suggestions.style.display="none"
  }
})

load_Local_Movies();

searchInput.addEventListener("input", Auto_Suggestions);
