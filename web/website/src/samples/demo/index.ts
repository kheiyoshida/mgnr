import * as Tone from 'tone'
import { main } from './song'

export const playSong = async () => {
  main()
  await Tone.start()
  Tone.Transport.start()
}

const button = document.createElement("button");
button.textContent = "Play";
button.addEventListener("click", playSong);
document.body.appendChild(button);
document.body.style.background = "black";
