import 'phaser';
import { Scene } from 'phaser';

export default class GameScene extends Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {}

    create() {
        this.cameras.main.fadeIn(1000);
        this.cameras.main.setBackgroundColor('#000000');
    }

    update(time, delta) {}
}
