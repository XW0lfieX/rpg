import 'phaser';
import { Scene } from 'phaser';

export default class GameScene extends Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.spritesheet('char_attack_down-ss', 'assets/hero/char_attack_down_anim_strip_6.png', { frameWidth: 48, frameHeight: 32 });
        this.load.spritesheet('char_attack_right-ss', 'assets/hero/char_attack_right_anim_strip_6.png', { frameWidth: 48, frameHeight: 32 });
        this.load.spritesheet('char_attack_left-ss', 'assets/hero/char_attack_left_anim_strip_6.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('char_attack_right-ss', 'assets/hero/char_attack_right_anim_strip_6.png', { frameWidth: 32, frameHeight: 48 });
    }

    create() {
        this.cameras.main.fadeIn(1000);
        this.cameras.main.setBackgroundColor('#000000');
    }

    update(time, delta) {}
}
