console.log("Let's write java script");
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
  let responce = await a.text();
  console.log(responce);
  let div = document.createElement("div");
  div.innerHTML = responce;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }
  // show all the song in the playlist
  let songUL = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li>   
                            <img class="invert" src="./Img/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Vikash</div>
                            </div>
                            <div class="playnow">
                                <span>Play now</span>
                                <img class="invert" src="./Img/play.svg" alt="">
                            </div> </li>`;
  }

  // Attech and eventlistener of each song
  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML);
    });
  });
}

const playMusic = (track, pause = false) => {
  // let audio = new Audio("/songs/" + track);
  currentSong.src = `/songs/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "./Img/pause.svg";
  }
  currentSong.play();
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00/00:00";
};

async function displayAlbums() {
  let a = await fetch(`http://127.0.0.1:3000/songs/`);
  let responce = await a.text();
  let div = document.createElement("div");
  div.innerHTML = responce;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");
  Array.from(anchors).forEach(async (e) => {
    if (e.href.includes("/songs")) {
      let folder = e.href.split("/").slice(-2)[0];
      // Get the metadata of the folder
      let a = await fetch(`http://127.0.0.1:3000/${folder}/info.json`);
      let responce = await a.json();
      console.log(responce);

      cardContainer.innerHTML =
        cardContainer.innerHTML +
        `<div data-folder="cs" class="card ">
                        <div class="playSong">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="black" height="24" width="24"
                                viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                        <img src="${folder}/cover.jpg"
                            alt="">

                        <h2>${responce.title}</h2>
                        <p>${responce.description}</p>
                    </div>`;
    }
    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach((e) => {
      // console.log(e);
      e.addEventListener("click", async (item) => {
        // console.log(item.currentTarget.dataset.folder);
        songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      });
    });
  });
}

async function main() {
  // get the list of all song
  await getSongs("songs/cs");
  // playMusic(songs[1], true);

  // Display all the albums on the image
  displayAlbums();

  // Attech event listener of play, next, previous
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "./Img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "./Img/play.svg";
    }
  });

  // Listen for time update
  currentSong.addEventListener("timeupdate", () => {
    // console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )} / ${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // Add a event listner to sikabr
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let parcent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = parcent + "%";
    currentSong.currentTime = (currentSong.duration * parcent) / 100;
  });

  // Add an event listner for hamburger

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  // Add an event listner for close button
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  // Add an event listner for previous song
  // const previous = document.getElementById("previous");
  previous.addEventListener("click", () => {
    console.log("Previous song");
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 > length) {
      playMusic(songs[index - 1]);
    }
  });

  // Add an event listner for next song
  next.addEventListener("click", () => {
    console.log("Next song");
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  // Add an event to volume
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      console.log("Setting volume to", e.target.value, "/100");
      currentSong.volume = parseInt(e.target.value) / 100;
    });
}

main();
