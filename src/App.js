import { useState, useRef } from 'react';
import './App.css';
import Playlist from './components/Playlist';

const App = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const [view, changeView] = useState("PL");
  const [autoplay, setAutoplay] = useState("");
  const [isMute, setIsMute] = useState(false);
  const [loop, setLoop] = useState(false);
  const [v, setV] = useState(50);
  const [dur, setDur] = useState("00:00");
  const [time, setTime] = useState("00:00");
  const [reset, toZero] = useState(0);

  const handlePlayPause = () => {
    (isPlaying) ? audioRef.current.pause() : audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentSongIndex((currentSongIndex + 1) % Playlist.length);
    setAutoplay((isPlaying) ? "autoplay" : false);
    setIsPlaying((isPlaying) ? true : false);
    toZero(0);
  };

  const handlePrevious = () => {
    setCurrentSongIndex((currentSongIndex - 1 + Playlist.length) % Playlist.length);
    setAutoplay((isPlaying) ? "autoplay" : false);
    setIsPlaying((isPlaying) ? true : false);
    toZero(0);
  };
  
  var List = (
    <ul className="slideL">
      {Playlist.map((song, index) => (
        <li
          id={`${song.title} - ${song.artist}`}
          key={index}
          className="flex border-b p-4 cursor-pointer hover:bg-white transition duration-300 hover:text-blue-900"
          onClick={() => {
            window.location.hash = `${song.title} - ${song.artist}`;
            setCurrentSongIndex(index);
            setAutoplay("autoplay"); setIsPlaying(true);
            showTools("");
            changeView("V");
            if (index === 0) {
              audioRef.current.play()
            }
          }}>

            <span id={`list${index}`} className={`list w-11/12`}>
              <span className={`font-semibold text-lg md:text-blue-900`}>{song.title}</span> <br /> 
              <b className='text-base font-boldextra'>{song.artist}</b>
            </span>

            <div id={`bars${index}`} style={{display:`none`}} className={`bars self-end rotate-180 p-2`}>
              <div className='w-2 h-8 bg-red-500 rounded-xl bar1'></div>
              <div className='w-2 h-6 bg-blue-500 rounded-xl bar2'></div>
              <div className='w-2 h-4 bg-green-500 rounded-xl bar3'></div>
            </div>

        </li>
      ))}
    </ul>
  );


  const handlers = {
    Style: `border-2 border-white font-bold p-4 bg-slate-800 text-white hover:text-slate-800 hover:bg-white font-extrabold rounded-full`
  };
  var View = (
    <>
      <div className='grid gap-4 py-2 justify-center slideR'>
        <div className={`w-full flex justify-center px-6 border-x-4 border-black md:border-0 bg-gray-100 md:bg-transparent`}>
          <div className={`fixed flex justify-center -ml-80 w-4 h-28 z-10 bg-slate-800 border-x-2 border-dashed rounded-md border-gray-200 ${isPlaying ? "-rotate-45 translate-x-3" : "translate-x-5"} origin-top transition duration-300 ease-in`}>
            <div className={`rounded-full bg-white h-4 w-2 self-end`}></div>
          </div>
          <div className={`w-56 h-56 flex justify-center items-center bg-slate-800 rounded-full border-4 border-dotted ${isPlaying?"animate-spin":""}`}>
            <h4 className={`bg-red-600 text-xl`}>My Music</h4>
            <h4 className={`bg-green-600 text-xl`}>My Music</h4>
            <div className={`absolute z-10 w-16 h-16 rounded-full border-4 border-dashed border-gray-800 bg-white ${isPlaying?"animate-spin animate-pulse":""}`}>
            </div>
            <div className={`absolute w-20 h-20 rounded-full border-4 border-dashed ${isPlaying?"animate-ping":""}`}>
            </div>
          </div>
          <button className={`cursor-default flex font-bold text-green-300 md:text-black hover:text-black align-center justify-between p-2 fixed mt-24 -mr-96 -rotate-90 hover:bg-gray-100 md:hover:bg-white hover:border-2 hover:border-slate-800 rounded-lg`}>
          <span className={`rotate-90 fa fa-minus`}> </span>
            <input className='cursor-pointer' title="Volume" type="range" min="0" max="100" defaultValue={v} list='breakpoints' onChange={(event) => {
              audioRef.current.volume = (event.target.value / 100);
              setV(event.target.value);
            }} />
            <span className={`rotate-90 fa fa-plus`}> </span>
            <span className={`rotate-90 m-px`}>{v}%</span>
          </button>
        </div>
      </div>

      <div className='w-full slideB'>
        <div className='mt-2 flex gap-4 justify-center font-bold text-white md:text-black'>
          { time }
          <input
            title="Seek"
            className={`bg-slate-800 w-8/12 cursor-pointer`}
            type="range"
            min="0"
            max="100"
            value={reset}
            list='breakpoints'
            onChange={(event) => audioRef.current.currentTime = ((event.target.value / 100) * audioRef.current.duration)}
          />
          <datalist id="breakpoints">
            <option value="0" label="0"></option>
            <option value="25" label="25"></option>
            <option value="50" label="50"></option>
            <option value="75" label="75"></option>
            <option value="100" label="100"></option>
          </datalist>
          { dur }
        </div>
        <div className='w-full mt-2 flex gap-4 justify-center'>
          <button onClick={handlePrevious} className={`${handlers.Style} fa fa-fast-backward`} title="Prev"></button>
          <button onClick={handlePlayPause} className={`${handlers.Style} fa ${isPlaying ? 'fa-pause' : 'fa-play'}`} title={isPlaying ? "Pause":"Play"}></button>
          <button onClick={handleNext} className={`${handlers.Style}`} title="Next">
            <i className='fa fa-fast-forward'></i>
          </button>
        </div>
      </div>
    </>
  );

  const [audTools, showTools] = useState("hidden");

  return (
    <div className={`fixed z-10 w-full h-full bottom-0 top-0 flex justify-center items-center bg-slate-700`}>
      <audio
        ref={audioRef}
        src={Playlist[currentSongIndex].src}
        onEnded={() => {
          handleNext();
          setIsPlaying(true);
        }}
        onCanPlay={(event) => {
          setDur(`${Math.floor(event.target.duration / 60) < 10 ? 0 : ""}${Math.floor(event.target.duration / 60)}:${Math.floor(event.target.duration % 60) < 10 ? 0 : ""}${Math.floor(event.target.duration % 60)}`);
        }}
        onTimeUpdate={(event) => {
          setTime(`${Math.floor(event.target.currentTime / 60) < 10 ? 0 : ""}${Math.floor(event.target.currentTime / 60)}:${Math.floor(event.target.currentTime % 60) < 10 ? 0 : ""}${Math.floor(event.target.currentTime % 60)}`);
          let z = (event.target.currentTime * 100) / event.target.duration;
          toZero((isNaN(z)) ? 0 : z);
        }}
        autoPlay={autoplay}
        muted={isMute}
        loop={loop}
        volume={(v / 100)}
      >
      </audio>
      <div className='box-content container text-white md:text-black md:p-4 md:w-3/6 md:m-4 h-full md:h-5/6 md:rounded-3xl shadow-2xl bg-gradient-to-l from-slate-700 to-slate-900 md:from-red-200 md:via-blue-200 md:to-green-200'>
        <h3 className='animate-pulse text-center font-bold mb-2 mt-2 md:mt-px'> <i className='fa fa-star animate-spin'></i> Now Playing <i className='fa fa-spinner animate-spin'></i> </h3>
        <div className='text-center'>
          {
            (Playlist[currentSongIndex].title.length > 19) ? <marquee className="text-3xl font-bold mx-2 px-2 pt-2 w-5/6">{Playlist[currentSongIndex].title}</marquee> : <h3 className="text-3xl font-bold px-2 pt-2 w-full">{Playlist[currentSongIndex].title}</h3>
          }
        </div>
        <h3 className='text-xl text-center font-semibold pb-2'> { Playlist[currentSongIndex].artist } </h3>
        <div className={`mt-4 grid ${(audTools === "hidden") ? "grid-cols-2" : "grid-cols-4" } justify-center gap-2 md:gap-4`}>
          <a href={`#${Playlist[currentSongIndex].title} - ${Playlist[currentSongIndex].artist}`} className='text-center hover:opacity-80 bg-green-500 px-4 py-2 border-b-2 md:border-0 font-bold' title='Playlist' onClick={() => {
            changeView("PL"); showTools("hidden");
            setTimeout(() => {
              let b = document.querySelectorAll(`.bars`);
              let l = document.querySelectorAll(`.list`);
              let i = 0;
              for (i = 0; i < b.length; i++) {
                b[i].style.display = 'none';
                l[i].classList.remove('Text');
              }
              document.querySelector(`#bars${currentSongIndex}`).style.display = "flex";
              document.querySelector(`#list${currentSongIndex}`).classList.add('Text');
            }, 700)
          }}>
            <i className='fas fa-list'></i>
          </a>

          <button title={loop ? 'Unloop' : 'Loop'} className={`${audTools} slideT hover:opacity-80 ${loop ? "bg-white text-slate-800": "bg-slate-600 text-white"} py-2 border-2 border-slate-800 font-bold`} onClick={() => setLoop(!loop)}>
            <i className='fa fa-repeat'></i>
          </button>
          <button title={isMute ? 'Unmute' : 'Mute'} className={`${audTools} slideT hover:opacity-80 ${isMute ? "bg-white text-slate-800": "bg-slate-600 text-white"} py-2 border-2 border-slate-800 font-bold`} onClick={() => setIsMute(!isMute)}>
            { isMute ? <i className='fas fa-volume-up'></i> : <i className='fas fa-volume-mute'></i> }
          </button>
          
          <button title="Player" className='float-right hover:opacity-80 bg-red-500 px-4 py-2 border-b-2 md:border-0 font-bold fa fa-music' onClick={() => { changeView("V"); showTools("") }}></button>
        </div>
        <div className='text-white md:text-black mt-4 h-4/6 overflow-y-auto scroll-smooth'>
          { (view === "PL")? List : View }
        </div>
      </div>
    </div>
  );
};

export default App;