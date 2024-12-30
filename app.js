const bar = document.getElementById("bar-container");
const navbar = document.getElementById("navbar");
const close = document.getElementById("close");

if (bar) {
  bar.addEventListener("click", () => {
    navbar.classList.add("moving");
    console.log("I am clicked");
  });
}
if (close)
  close.addEventListener("click", () => {
    navbar.classList.remove("moving");
    console.log("its a remove");
  });

// selecting langauge
const head = document.querySelector(".lang-head");
const options = document.querySelectorAll(".options");
const langauge = document.querySelector(".langauge");

head.addEventListener("click", () => {
  langauge.classList.toggle("show");
  console.log(langauge);
});
for (option of options) {
  option.onclick = function () {
    head.innerHTML = this.textContent;
    langauge.classList.toggle("show");
  };
}

// change the color mod
const changemood = document.querySelector("#mood");
const heads = document.querySelector('#h-heading');
const footerlist = document.querySelector('#footer-list');
let currmod = "light";
changemood.addEventListener("click", () => {
  console.log(" i clicked");
  if (currmod === "light") {
    currmod = "drak";
    document.querySelector("body").style.backgroundColor = "#222";
    document.querySelector("body").style.color = "#fff";
    heads.style.color = "#fff";
    navbar.classList.add("navbar-color");
    footerlist.classList.add("navbar-color");
  } else {
    currmod = "light";
    document.querySelector("body").style.backgroundColor = "#fff";
    document.querySelector("body").style.color = "#222";
    heads.style.color = "#222";
    navbar.classList.remove("navbar-color");
    footerlist.classList.remove("navbar-color");
  }
});


// Data adding in the html with the help of js

//  Api constant container

const apikey = "b40e648231fe7ff8e5774fa5905906e6";
const apiEndpoint = "https://api.themoviedb.org/3";
const imgPath = "https://image.tmdb.org/t/p/original";

// Api paths

const apipaths = {
  fetchAllCategories: `${apiEndpoint}/genre/movie/list?api_key=${apikey}`,
  fetchMoviesList: (id) =>
    `${apiEndpoint}/discover/movie?api_key=${apikey}&with_genres=${id}`,
  fetchTrending: `${apiEndpoint}/trending/all/day?api_key=${apikey}&language=en-US`,
  searchOnYoutube: (query) =>
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyC0SZJkHFX-fQ7NrsxdI4l4mGwYuY4l7P8`,
};

// This is a requesting the data with the help of api

const allDataloading = () => {
  fetchAllDataBulid();
  fetchTrendingMovies();
};
function fetchTrendingMovies() {
  fetchAllmoviesAndBuild(apipaths.fetchTrending, "Trending Now")
    .then((list) => {
      const randomIndex = parseInt(Math.random() * list.length);
      buildBannerSection(list[randomIndex]);
    })
    .catch((err) => {
      console.error(err);
    });
}

const buildBannerSection = (movie) => {
  const banner = document.getElementById("background");
  banner.style.backgroundImage = `url(${imgPath}${movie.backdrop_path})`;

  const div = document.createElement("div");
  div.innerHTML = `
            <h2 id="h-heading">${movie.title}</h2>
            <p class="bg-para">Release Date:- ${movie.release_date}</p>
            <p class="des-para">${
              movie.overview && movie.overview.length > 200
                ? movie.overview.slice(0, 200).trim() + "...."
                : movie.overview
            }</p>
            <div class="btn">
                <button type="button" class="button">Show Now</button>
                <button type="button" class="button black"><i class="fa-solid fa-info"></i> More</button>
            </div>
    `;
  div.className = "movies-details flex columns";
  banner.append(div);
};

const fetchAllDataBulid = async () => {
  const responce = await fetch(apipaths.fetchAllCategories);
  const data = await responce.json();

  const categroies = data.genres;
  if (Array.isArray(categroies) && categroies.length) {
    categroies.forEach((categroy) => {
      fetchAllmoviesAndBuild(
        apipaths.fetchMoviesList(categroy.id),
        categroy.name
      );
    });
  }
  // console.table(categroies);
};

const fetchAllmoviesAndBuild = async (fetchurl, categroyName) => {
  const responce = await fetch(fetchurl);
  const data = await responce.json();

  const movies = data.results;
  if (Array.isArray(movies) && movies.length) {
    AddingTheDatainhtml(movies, categroyName);
  }
  return movies;
  //   console.table(movies);
};

const AddingTheDatainhtml = (list, categroyName) => {
  const movies = document.querySelector("#movies-section");

  const moviesListHTML = list
    .map((item) => {
      return `
      <div class="iimg-box" >
        <img class="move-item-img" src="${imgPath}${item.backdrop_path}" alt="${item.title}" />
        <div class="iframe-wrap" id="yt${item.id}"></div>
        </div>`;
    })
    .join("");

  const divinner = `
    <h3 class="heading white" id="heading">${categroyName}<span class="explore">Explore Now >>></span></h3>
    <div class="img-box flex">
    ${moviesListHTML}
    </div>
    `;
  const div = document.createElement("div");
  div.className = "movies-list";
  div.innerHTML = divinner;
  movies.append(div);

  //   console.table(list, categroyName);
};

const  searchMovieTrailer  = async(movieName, iframId) =>{
    if(!movieName) return;
    const responce = await fetch(apipaths.searchOnYoutube);
    const data = await responce.json();
    const bestResult = data.items[0];
    console.log(bestResult)
    const videos = document.getElementById('iframId');

    const div = document.createElement('div');
    div.innerHTML = `
    <iframe width="245px" height="150px" src="https://www.youtube.com/embed/${bestResult.id.videoId}?autoplay=1&controls=0"></iframe>
    `;
    videos.append(div)
 }
//  window loading
window.addEventListener("load", () => {
  allDataloading();
  window.addEventListener("scroll", function () {
    let header = document.getElementById("head");
    if (window.scrollY > 5) header.classList.add("black-bg");
    else header.classList.remove("black-bg");
  });
});
