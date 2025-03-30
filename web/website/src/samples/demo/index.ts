import * as Tone from 'tone'
import { main } from './song'

export const playSong = async () => {
  main()
  await Tone.start()
  Tone.Transport.start()
}

document.body.style.background = "black";
document.body.style.color = "white";

const button = document.createElement("button");
button.textContent = "Click to Play";
button.addEventListener("click", playSong);
document.body.appendChild(button);
