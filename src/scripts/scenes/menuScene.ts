import 'phaser';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        this.load.spritesheet('background-ss', 'assets/menu/background.png', { frameWidth: 568, frameHeight: 384 });
        this.load.image('play', 'assets/menu/play-button.png');
        this.load.image('play-focus', 'assets/menu/focus.png');
        this.load.image('title', 'assets/menu/title.png');
    }

    create() {
        //remove the loading screen
        let loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('transparent');
            this.time.addEvent({
                delay: 1000,
                callback: () => {
                    // @ts-ignore
                    loadingScreen.remove();
                }
            });
        }

        this.cameras.main.fadeIn(1000);
        this.cameras.main.setBackgroundColor('#000000');

        this.anims.create({
            key: 'background-anim',
            frames: this.anims.generateFrameNumbers('background-ss', {}),
            frameRate: 3,
            repeat: -1
        });

        let screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        let screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        let background = this.physics.add.sprite(screenCenterX, screenCenterY, 'background-ss', 0);
        background.anims.play('background-anim');
        background.body.immovable = true;
        background.body.setAllowGravity(false);
        let scaleX = this.cameras.main.width / background.width;
        let scaleY = this.cameras.main.height / background.height;
        let scale = Math.max(scaleX, scaleY);
        background.setScale(scale);

        let title = this.add.image(screenCenterX, 250, 'title');
        title.setScale(15);

        let play = this.add.sprite(screenCenterX, 850, 'play').setInteractive();
        play.setScale(20);

        play.on(Phaser.Input.Events.POINTER_OVER, () => {
            play.setTexture('play-focus');
        });
        play.on(Phaser.Input.Events.POINTER_OUT, () => {
            play.setTexture('play');
        });
        play.on(Phaser.Input.Events.POINTER_DOWN, () => {
            play.setTexture('play');
        });
        play.on(Phaser.Input.Events.POINTER_UP, () => {
            play.setTexture('play-focus');
            this.scene.start('GameScene');
        });
    }
}
