import 'phaser';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        this.load.image('background', 'assets/menu/becgraund-2.gif');
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

        let screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;

        let background = this.add.sprite(screenCenterX, 540, 'background').setInteractive();
        background.setOrigin(0.5, 0.5);
        let title = this.add.image(screenCenterX, 250, 'title');
        title.setOrigin(0.4, 0.5);
        let play = this.add.sprite(screenCenterX, 850, 'play').setInteractive();
        play.setOrigin(0.5, 0.5);

        let scaleX = this.cameras.main.width / background.width;
        let scaleY = this.cameras.main.height / background.height;
        let scale = Math.max(scaleX, scaleY);
        background.setScale(scale);
        let scaleX1 = this.cameras.main.width / title.width;
        let scaleY1 = this.cameras.main.height / title.height;
        let scale1 = Math.max(15, 15);
        title.setScale(scale1);
        let scaleX2 = this.cameras.main.width / play.width;
        let scaleY2 = this.cameras.main.height / play.height;
        let scale2 = Math.min(20, 20);
        play.setScale(scale2);

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
