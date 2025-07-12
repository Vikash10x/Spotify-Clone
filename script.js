console.log("Let's write java script");
let currentSong = new Audio();

async function getSongs() {
  let a = await fetch("http://127.0.0.1:3000/songs/");
  let responce = await a.text();
  console.log(responce);
  let div = document.createElement("div");
  div.innerHTML = responce;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}

const playMusic = (track) => {
  // let audio = new Audio("/songs/" + track);
  currentSong.src = "/songs/" + track;
  currentSong.play();
  play.src = "./Img/pause.svg";
};

async function main() {
  let songs = await getSongs();
  // console.log(songs);

  let songUL = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
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
}

main();
