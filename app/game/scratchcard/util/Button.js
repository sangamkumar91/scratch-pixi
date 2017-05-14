import * as PIXI from 'pixi.js';

export default class Button extends PIXI.Sprite {

	constructor(params) {
		super();
		this.interactive = true;
		this.width = 130;
		this.height = 40 ;

		if('defaultTexture' in params) {
			this.texture = this.defaultTexture = new PIXI.Texture.fromImage(params.defaultTexture);
		}

		if('hoverTexture' in params) {
			this.hoverTexture = new PIXI.Texture.fromImage(params.hoverTexture);

			this.on('mouseover', () => {
				if(!this.disabled)
					this.texture = this.hoverTexture
			});

			this.on('mouseout', () => {
				this.texture = this.defaultTexture;
			});
		}

		if('activeTexture' in params) {
			this.activeTexture = new PIXI.Texture.fromImage(params.activeTexture);

			this.on('mousedown', () => {
					this.texture = this.activeTexture
			});
		}

		if('text' in params) {
			let label = new PIXI.Text(params.text);
			label.position.x = this.width/2 ;
			label.position.y = this.height/2;
			this.addChild(label);
		}
	}

}
