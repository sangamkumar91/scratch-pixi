import Scratchcard from './scratchcard/Scratchcard';
import scratchWin from './scratchcard/assets/scratch-win.jpg';


export default class Game  {

	constructor(config) {
		const scratchWindow = document.getElementsByClassName('scratchWindow')[0];
		this.renderer = new PIXI.autoDetectRenderer(scratchWindow.clientWidth, scratchWindow.clientHeight , config.options);
		document.getElementsByClassName('wrapper')[0].style.backgroundImage = "url('"+ scratchWin +"')";
		scratchWindow.appendChild(this.renderer.view);
		this.elapsedTime = Date.now();
		this.loop();
		this.currentStage = new Scratchcard(this);
		this.currentStage.render();
		this.renderer.render(this.currentStage)
	}

	loop() {
		window.requestAnimationFrame(() => this.loop());
		let now = Date.now();
		if(this.currentStage) {
			if(this.currentStage.update)
				this.currentStage.update((now - this.elapsedTime) * 0.001);
			this.renderer.render(this.currentStage)
		}
		this.elapsedTime = now;
	}
}
