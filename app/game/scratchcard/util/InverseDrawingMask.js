import * as PIXI from 'pixi.js';

export default class InverseDrawingMask  {

	constructor(stage) {
		this.isDrawing = false;

		this.stage = stage;
		this.stage.interactive = true;
		this.width = this.stage.game.renderer.width;
		this.height = this.stage.game.renderer.height;

		this.renderer = new PIXI.CanvasRenderer(this.width, this.height, { backgroundColor: 0xFFFFFF });
		this.innerStage = new PIXI.Container();

		this.drawingPoint = new PIXI.Graphics();
		this.innerStage.addChild(this.drawingPoint);

		this.stage.on('mousedown', this.onStart.bind(this));
		this.stage.on('mousemove', this.onMove.bind(this));
		this.stage.on('mouseup', this.onEnd.bind(this));
		this.stage.on('touchstart', this.onStart.bind(this));
		this.stage.on('touchmove', this.onMove.bind(this));
		this.stage.on('touchend', this.onEnd.bind(this));

		this.texture = new PIXI.Texture.fromCanvas(this.renderer.view);
	}

	onStart() {
		this.isDrawing = true;
	}

	onEnd() {
		this.isDrawing = false;
	}

	onMove(e) {
		if(this.isDrawing) {
			let pos = e.data.getLocalPosition(this.stage);
			this.drawingPoint.beginFill(0x000000);
			this.drawingPoint.drawCircle(pos.x, pos.y, 50);
			this.drawingPoint.endFill();
		}
	}

	update() {
		this.renderer.render(this.innerStage);
		this.texture.update();
	}


	getMaskSprite() {
		return new PIXI.Sprite(this.texture);
	}


	getFilledPercent(x, y, width, height) {
		let data = this.renderer.context.getImageData(x, y, width, height).data;
		let count = 0;
		for(var i=0, len=data.length; i<len; i+=4)
			if(data[i]<255)
				count++;
		return (100 * count / (width*height)).toFixed(2);
	}

}
