import 'phaser';
import { Scene } from 'phaser';
import Hero from '../sprites/hero';

export default class GameScene extends Scene {
    hero: Hero;

    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.spritesheet('hero-atk-s-ss', 'assets/hero/char_attack_down_anim_strip_6.png', { frameWidth: 48, frameHeight: 32 });
        this.load.spritesheet('hero-atk-e-ss', 'assets/hero/char_attack_right_anim_strip_6.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('hero-atk-w-ss', 'assets/hero/char_attack_left_anim_strip_6.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('hero-atk-n-ss', 'assets/hero/char_attack_up_anim_strip_6.png', { frameWidth: 48, frameHeight: 32 });

        this.load.spritesheet('hero-idle-s-ss', 'assets/hero/char_idle_down_anim_strip_6.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('hero-idle-w-ss', 'assets/hero/char_idle_left_anim_strip_6.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('hero-idle-e-ss', 'assets/hero/char_idle_right_anim_strip_6.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('hero-idle-n-ss', 'assets/hero/char_idle_up_anim_strip_6.png', { frameWidth: 16, frameHeight: 16 });

        this.load.spritesheet('hero-walk-s-ss', 'assets/hero/char_run_down_anim_strip_6.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('hero-walk-w-ss', 'assets/hero/char_run_left_anim_strip_6.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('hero-walk-e-ss', 'assets/hero/char_run_right_anim_strip_6.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('hero-walk-n-ss', 'assets/hero/char_run_up_anim_strip_6.png', { frameWidth: 16, frameHeight: 16 });

        this.load.spritesheet('hero-death-ss', 'assets/hero/char_death_all_dir_anim_strip_10.png', { frameWidth: 16, frameHeight: 16 });
    }

    create() {
        this.cameras.main.fadeIn(1000);
        this.cameras.main.setBackgroundColor('#FF0000');

        this.hero = new Hero(this, 100, 100);

        this.physics.world.setBoundsCollision(true, true, true, true);
    }

    update(time, delta) {}
}
