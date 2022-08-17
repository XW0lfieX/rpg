import 'phaser';
import { Scene } from 'phaser';

export default class GameScene extends Scene {
    map: Phaser.Tilemaps.Tilemap;
    worldLayer: Phaser.Tilemaps.TilemapLayer;

    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {}

    create() {
        this.cameras.main.fadeIn(2000);
        this.cameras.main.setBackgroundColor('#008080');
    }

    update(time, delta) {}
}
