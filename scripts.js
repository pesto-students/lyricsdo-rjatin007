// Fetch Data

// const CHUNK_SIZE = 5;
const baseUrl = "https://api.lyrics.ovh";
const suggestEndPoint = "suggest";
const fetchSuggestions = async (query) => {
  const response = await fetch(`${baseUrl}/${suggestEndPoint}/${query}`);
  const songsData = await response.json();
  await returnSongsList(songsData);
};
const fetchLyrics = async ({ artist, title, albumTitle }) => {
  const response = await fetch(`${baseUrl}/v1/${artist}/${title}`);
  const lyricsData = await response.json();
  await renderLyricsContainer(title, lyricsData, albumTitle, artist);
  //   await
};

// add listeners
const searchInput = document.getElementById("search-input");
const startSearch = document.getElementById("start-search");
const searchResults = document.getElementById("search-results");
const resultCard = document.getElementById("result-card");
const backdrop = document.getElementById("backdrop");
const returnSongsList = (songsData) => {
  unSetLoader();
  searchResults.innerHTML =
    songsData !== undefined && songsData.data.map((song) => returnSong(song));
};
// make changes to UI
const setLoader = () => {
  backdrop.innerHTML = `<div class="loader"></div>`;
  backdrop.className = "backdrop";
};
const unSetLoader = () => {
  backdrop.innerHTML = "";
  backdrop.className = "";
};
const renderDialog = (message) => {
  backdrop.innerHTML = `<div class="dialog">
        <div class="details-card-actions" >
                <i class="fas fa-times-circle" id="close-modal"></i>
              </div>
              <div class="dialog-content" onclick="event.stopPropagation()">
              <h2 class="dialog-title">${message}</h2>
              </div>
    </div>`;
  backdrop.className = "backdrop";
};
const returnSong = (song) => {
  const title = song.title;
  const albumTitle = song?.album?.title;
  const artist = song?.artist?.name;
  const data = {
    title,
    albumTitle,
    artist,
  };
  const stringifiedData = JSON.stringify(data);

  return `<div class="result-card" id="result-card">
          <image
            class="result-image"
            src=${song && song.album && song.album.cover}
            
          ></image>
          <div class="result-content">
            <h3 class="result-title">${title}</h3>
            <p class="result-album-name"><em>Album : ${albumTitle}</em></p>
            <p class="result-album-name"><em>Artist : ${artist}</em></p>
          </div>
          <button class="show-lyrics" id="show-lyrics" data-song='${escape(
            stringifiedData
          )}' >
          Show Lyrics
          </button>

        </div>`;
};

startSearch.addEventListener("click", () => {
  const query = searchInput.value;
  if (query === "") {
    renderDialog("Please type some lyrics to search! ");
  } else {
    setLoader();
    fetchSuggestions(query);
  }
});
searchResults.addEventListener("click", (event) => {
  const song = JSON.parse(unescape(event.target.dataset.song));
  setLoader();
  fetchLyrics(song);
});

// const renderLyrics = (lyrics) => {
//   console.log(lyrics);
//   let lyricsString = "";

//   for (let char in lyrics) {
//     if (char === "\n") {
//       lyricsString += `<br/>`;
//     } else {
//       lyricsString += char;
//     }
//   }
//   return lyricsString;
// };
const renderLyricsContainer = (title, lyricsData, albumTitle, artist) => {
  unSetLoader();
  //   const formattedLyrics = lyricsData?.lyrics && renderLyrics(lyricsData.lyrics);

  backdrop.className = "backdrop";
  const details = `<div class="details-card">
              <div class="details-card-actions" >
                <i class="fas fa-times-circle" id="close-modal"></i>
              </div>
              <div class="details-card-header" >
                    <h2 class="details-card-title">${title}</h2>
                    <div class="details-card-info">
                        <p> ${albumTitle}</p> 
                        <p> ${artist}</p>
                    </div>
             </div>
              <div class="details-card-content" onclick="event.stopPropagation()">
                
                 
                <p > ${lyricsData?.lyrics} </p> 
              </div>
              </div>`;
  const notFound = () =>
    renderDialog(
      "Sorry! we cannot retrieve lyrics of this song at the moment. "
    );

  if (lyricsData?.lyrics) {
    backdrop.innerHTML = details;
  } else {
    notFound();
  }
};
const closeModal = (event) => {
  if (event.target.id === "close-modal") {
    backdrop.innerHTML = "";
    backdrop.className = "";
  }
};
backdrop.addEventListener("click", closeModal);
