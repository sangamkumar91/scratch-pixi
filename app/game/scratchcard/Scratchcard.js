import * as PIXI from 'pixi.js';
import {particles} from 'pixi-particles';
import configParticles from './config/particles.json';

import Button from './util/Button';
import InverseDrawingMask from './util/InverseDrawingMask';

import mask from './assets/mask.jpg';
import winner from './assets/winner.jpg';
import loser from './assets/loser.png';
import particle from './assets/particle.png';
import buttonDefault from './assets/buttonDefault.png';
import buttonHover from './assets/buttonHover.png';
import buttonActive from './assets/buttonActive.png';
import rMatrix from './assets/right-matrix.png';
import wMatrix from './assets/wrong-matrix.png';


export default class Scratchcard extends PIXI.Container {

	constructor(game) {
		super();
		this.game = game;
		this.resources = {
			mask,
			winner,
			loser,
			particle,
			buttonDefault,
			buttonHover,
			buttonActive,
			rMatrix,
			wMatrix,
		};
		this.drawingMask = new InverseDrawingMask(this);
	}

	render() {
		let board;
		let getRandomIntInclusive = (min, max) => {
		 min = Math.ceil(min);
		 max = Math.floor(max);
		 return Math.floor(Math.random() * (max - min + 1)) + min;
	 }
		this.randomInt = getRandomIntInclusive(0,1);
		if(this.randomInt)
			board = new PIXI.Sprite.fromImage(this.resources.rMatrix);
		else {
			board = new PIXI.Sprite.fromImage(this.resources.wMatrix);
		}
		board.height = this.game.renderer.height;
		board.width = this.game.renderer.width;
		board.position.set(0, 0);
		this.addChild(board);

		let mask = new PIXI.Sprite.fromImage(this.resources.mask);
		mask.height = this.game.renderer.height;
		mask.width = this.game.renderer.width;
		mask.position.set(0, 0);
		this.addChild(mask);

		mask.mask = this.drawingMask.getMaskSprite();

		let isGameOver = () => {
			if(this.checkScratchedZones()) {
				this.gameOver(mask);
			}
		}
		this.on('mouseup', isGameOver);
		this.on('touchend', isGameOver);

		let particlesContainer = new PIXI.ParticleContainer();
		this.particles = new PIXI.particles.Emitter(particlesContainer, this.resources.particle, configParticles);
		this.particles.emit = false;
		this.addChild(particlesContainer);
		this.bindParticlesEvent(mask);
	}


	checkScratchedZones() {
		let zones = [
			{x: 20, y: 20},
			{x: 186, y: 20},
			{x: 352, y: 20},
			{x: 20, y: 186},
			{x: 186, y: 186},
			{x: 352, y: 186},
			{x: 20, y: 352},
			{x: 186, y: 352},
			{x: 352, y: 352},
		];

		let count = 0;
		for(var i in zones) {
			if(this.drawingMask.getFilledPercent(zones[i].x, zones[i].y, 125, 125) > 50)
				count++;
		}

		if(count == zones.length)
			return true;

		return false;
	}

	gameOver(mask) {
		this.winContainer = new PIXI.Container();
		this.winContainer.alpha = 0;
		this.addChild(this.winContainer);
		let winOverlay;
		if(this.randomInt)
			winOverlay = new PIXI.Sprite.fromImage(this.resources.winner);
		else
			winOverlay = new PIXI.Sprite.fromImage(this.resources.loser);

		winOverlay.height = this.game.renderer.height;
		winOverlay.width = this.game.renderer.width;
		winOverlay.position.set(0, 0);
		this.winContainer.addChild(winOverlay);
		let playAgainButton = new Button({
			defaultTexture: this.resources.buttonDefault,
			hoverTexture: this.resources.buttonHover,
			activeTexture: this.resources.buttonActive,
			text: 'Play again',
			width : 100,
			height : 40
		});

		let newGame = () => {
			delete this.game.currentStage;
			this.game.currentStage = new Scratchcard(this.game);
			this.game.currentStage.render();
		}
		playAgainButton.on('click', newGame);
		playAgainButton.on('tap', newGame);

		playAgainButton.position.set(0.4*this.game.renderer.width, 0.8* this.game.renderer.height);
		this.winContainer.addChild(playAgainButton);

		this.off('mousedown');
		this.off('mousemove');
		this.off('mouseup');
		this.off('touchstart');
		this.off('touchmove');
		this.off('touchend');

		mask.off('mousedown');
		mask.off('mousemove');
		mask.off('mouseup');
		mask.off('touchstart');
		mask.off('touchmove');
		mask.off('touchend');
	}

	/**
	 * Update on every frame
	 */
	update(elapsedTime) {
		if(this.drawingMask)
			this.drawingMask.update();

		if(this.particles)
			this.particles.update(elapsedTime);

		if(this.winContainer && this.winContainer.alpha < 1)
			this.winContainer.alpha += .05;
	}


	bindParticlesEvent(mask) {
		let onStart = () => {
			this.particles.emit = true;
		}
		let onMove = e => {
			let pos = e.data.getLocalPosition(this);
			this.particles.updateOwnerPos(pos.x, pos.y);
		};
		let onEnd = () => {
			this.particles.emit = false;
			this.particles.cleanup();
		}

		mask.interactive = true;
		mask.on('mousedown', onStart);
		mask.on('mousemove', onMove);
		mask.on('mouseup', onEnd);
		mask.on('touchstart', onStart);
		mask.on('touchmove', onMove);
		mask.on('touchend', onEnd);
	}

}
