import 'phaser';

enum HeroPosition {
    WEST,
    EAST,
    NORTH,
    SOUTH
}
enum HeroState {
    IDLE,
    WALK,
    ATTACK,
    DEAD
}

export default class Hero extends Phaser.GameObjects.Sprite {
    keyLeft: Phaser.Input.Keyboard.Key;
    keyRight: Phaser.Input.Keyboard.Key;
    keyUp: Phaser.Input.Keyboard.Key;
    keyDown: Phaser.Input.Keyboard.Key;

    heroState: HeroState = HeroState.IDLE;
    heroPosition: HeroPosition = HeroPosition.EAST;

    constructor(scene, x, y) {
        super(scene, x, y, 'char_idle_left-ss', 0);

        //idle
        this.anims.create({
            key: 'hero-idle-e-anim',
            frames: this.anims.generateFrameNumbers('hero-idle-e-ss', {}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'hero-idle-w-anim',
            frames: this.anims.generateFrameNumbers('hero-idle-w-ss', {}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'hero-idle-n-anim',
            frames: this.anims.generateFrameNumbers('hero-idle-n-ss', {}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'hero-idle-s-anim',
            frames: this.anims.generateFrameNumbers('hero-idle-s-ss', {}),
            frameRate: 5,
            repeat: -1
        });

        //walk
        this.anims.create({
            key: 'hero-walk-e-anim',
            frames: this.anims.generateFrameNumbers('hero-walk-e-ss', {}),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'hero-walk-w-anim',
            frames: this.anims.generateFrameNumbers('hero-walk-w-ss', {}),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'hero-walk-n-anim',
            frames: this.anims.generateFrameNumbers('hero-walk-n-ss', {}),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'hero-walk-s-anim',
            frames: this.anims.generateFrameNumbers('hero-walk-s-ss', {}),
            frameRate: 8,
            repeat: -1
        });

        //attack
        this.anims.create({
            key: 'hero-atk-e-anim',
            frames: this.anims.generateFrameNumbers('hero-atk-e-ss', {}),
            frameRate: 12,
            repeat: 0
        });
        this.anims.create({
            key: 'hero-atk-w-anim',
            frames: this.anims.generateFrameNumbers('hero-atk-w-ss', {}),
            frameRate: 12,
            repeat: 0
        });
        this.anims.create({
            key: 'hero-atk-n-anim',
            frames: this.anims.generateFrameNumbers('hero-atk-n-ss', {}),
            frameRate: 12,
            repeat: 0
        });
        this.anims.create({
            key: 'hero-atk-s-anim',
            frames: this.anims.generateFrameNumbers('hero-atk-s-ss', {}),
            frameRate: 12,
            repeat: 0
        });

        //death
        this.anims.create({
            key: 'hero-death-anim',
            frames: this.anims.generateFrameNumbers('hero-death-ss', {}),
            frameRate: 5,
            repeat: 0
        });

        this.keyLeft = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyRight = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyUp = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyDown = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        (this.body as Phaser.Physics.Arcade.Body).setSize(10, 14);
        (this.body as Phaser.Physics.Arcade.Body).setOffset(2, 0);
        (this.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);

        this.setScale(10);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        (this.body as Phaser.Physics.Arcade.Body).setVelocity(0);

        if (this.heroState == HeroState.DEAD) {
            return;
        }

        if (this.scene.input.mousePointer.leftButtonDown() && this.heroState != HeroState.ATTACK) {
            let cardinalPosition = HeroPosition[this.heroPosition].charAt(0).toLowerCase();

            this.anims.play('hero-atk-' + cardinalPosition + '-anim');
            console.log(this.anims.getName());
            this.heroState = HeroState.ATTACK;
            this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                this.heroState = HeroState.IDLE;
                this.anims.play('hero-idle-' + cardinalPosition + '-anim');
            });
        }

        //correct bad images
        if (this.heroState == HeroState.ATTACK && this.heroPosition == HeroPosition.EAST) {
            this.setOrigin(0.25, 0.5);
            (this.body as Phaser.Physics.Arcade.Body).setOffset(2, 16);
        }
        if (this.heroState == HeroState.ATTACK && this.heroPosition == HeroPosition.WEST) {
            this.setOrigin(0.75, 0.5);
            (this.body as Phaser.Physics.Arcade.Body).setOffset(18, 16);
        }
        if (this.heroState == HeroState.ATTACK && this.heroPosition == HeroPosition.NORTH) {
            this.setOrigin(0.5, 0.75);
        }
        if (this.heroState == HeroState.ATTACK && this.heroPosition == HeroPosition.SOUTH) {
            this.setOrigin(0.5, 0.25);
        }

        if (this.heroState == HeroState.ATTACK) {
            return;
        }

        //non attack
        (this.body as Phaser.Physics.Arcade.Body).setSize(10, 14);
        (this.body as Phaser.Physics.Arcade.Body).setOffset(2, 0);
        this.setOrigin(0.5, 0.5);

        if (this.keyRight.isDown) {
            (this.body as Phaser.Physics.Arcade.Body).setVelocityX(175);
            this.heroState = HeroState.WALK;
            this.heroPosition = HeroPosition.EAST;
        }

        if (this.keyLeft.isDown) {
            (this.body as Phaser.Physics.Arcade.Body).setVelocityX(-175);
            this.heroState = HeroState.WALK;
            this.heroPosition = HeroPosition.WEST;
        }

        if (this.keyDown.isDown) {
            (this.body as Phaser.Physics.Arcade.Body).setVelocityY(175);
            this.heroState = HeroState.WALK;
            this.heroPosition = HeroPosition.SOUTH;
        }
        if (this.keyUp.isDown) {
            (this.body as Phaser.Physics.Arcade.Body).setVelocityY(-175);
            this.heroState = HeroState.WALK;
            this.heroPosition = HeroPosition.NORTH;
        }

        //hero is idle
        if (this.keyRight.isUp && this.keyLeft.isUp && this.keyDown.isUp && this.keyUp.isUp) {
            this.heroState = HeroState.IDLE;
        }

        //animations
        if (this.heroState == HeroState.IDLE) {
            if (this.heroPosition == HeroPosition.EAST) {
                this.anims.play('hero-idle-e-anim', true);
            }
            if (this.heroPosition == HeroPosition.WEST) {
                this.anims.play('hero-idle-w-anim', true);
            }
            if (this.heroPosition == HeroPosition.SOUTH) {
                this.anims.play('hero-idle-s-anim', true);
            }
            if (this.heroPosition == HeroPosition.NORTH) {
                this.anims.play('hero-idle-n-anim', true);
            }
        }
        if (this.heroState == HeroState.WALK) {
            if (this.heroPosition == HeroPosition.EAST) {
                this.anims.play('hero-walk-e-anim', true);
            }
            if (this.heroPosition == HeroPosition.WEST) {
                this.anims.play('hero-walk-w-anim', true);
            }
            if (this.heroPosition == HeroPosition.SOUTH) {
                this.anims.play('hero-walk-s-anim', true);
            }
            if (this.heroPosition == HeroPosition.NORTH) {
                this.anims.play('hero-walk-n-anim', true);
            }
        }

        // Normalize and scale the velocity so that this.hero can't move faster along a diagonal
        (this.body as Phaser.Physics.Arcade.Body).velocity.normalize().scale(175);
    }
}
