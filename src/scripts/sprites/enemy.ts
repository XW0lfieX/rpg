import 'phaser';
import Hero from './hero';
import { PhaserNavMesh } from 'phaser-navmesh';
import GameScene from '../scenes/gameScene';

enum State {
    IDLE,
    FOLLOW,
    FREEZE,
    DEAD
}

enum Position {
    WEST,
    EAST,
    NORTH,
    SOUTH
}

export default class Enemy extends Phaser.GameObjects.Sprite {
    enemyState: State = State.IDLE;
    enemyPosition: Position = Position.WEST;

    navMesh: PhaserNavMesh;

    target?: Phaser.Geom.Point;

    heroCollider: Phaser.Physics.Arcade.Collider;

    scene: GameScene;

    constructor(scene: GameScene, x, y) {
        super(scene, x, y, 'grizzly-idle-spritesheet', 0);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        (this.body as Phaser.Physics.Arcade.Body).setSize(20, 31);
        (this.body as Phaser.Physics.Arcade.Body).setOffset(6, 1);

        this.anims.create({
            key: 'phantom_idle-w-anim',
            frames: this.anims.generateFrameNumbers('phantom_idle-w-ss', {}),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'phantom_idle-e-anim',
            frames: this.anims.generateFrameNumbers('phantom_idle-e-ss', {}),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'phantom_run-w-anim',
            frames: this.anims.generateFrameNumbers('phantom_run-w-ss', {}),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'phantom_run-e-anim',
            frames: this.anims.generateFrameNumbers('phantom_run-e-ss', {}),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'phantom_death-w-anim',
            frames: this.anims.generateFrameNumbers('phantom_death-w-ss', {}),
            frameRate: 7,
            repeat: 0
        });

        this.anims.create({
            key: 'phantom_death-e-anim',
            frames: this.anims.generateFrameNumbers('phantom_death-e-ss', {}),
            frameRate: 7,
            repeat: 0
        });

        this.heroCollider = this.scene.physics.world.addOverlap(
            this.scene.hero,
            this,
            () => {
                this.scene.hero.kill();
            },
            undefined,
            this
        );

        this.navMesh = this.scene.navMeshPlugin.buildMeshFromTilemap('mash', this.scene.map, [this.scene.collisionLayer]);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (this.enemyState == State.DEAD || this.enemyState == State.FREEZE) {
            return;
        }

        if (this.enemyState == State.IDLE) {
            let distanceFromPlayer = Phaser.Math.Distance.Between(this.x, this.y, this.scene.hero.x, this.scene.hero.y);
            if (distanceFromPlayer <= 160 && !this.target) {
                this.computeNextTarget();
            }
        }

        if (this.enemyState == State.FOLLOW && this.target) {
            this.computeNextTarget();
            this.scene.physics.moveTo(this, this.target!.x, this.target!.y, 100);
            this.setWalkAnimation();
        }

        if (this.enemyState == State.IDLE) {
            if (this.enemyPosition == Position.EAST || this.enemyPosition == Position.NORTH) {
                this.anims.play('phantom_idle-e-anim', true);
            }
            if (this.enemyPosition == Position.WEST || this.enemyPosition == Position.SOUTH) {
                this.anims.play('phantom_idle-w-anim', true);
            }
        }
    }

    computeNextTarget() {
        let path: Phaser.Geom.Point[] = this.navMesh.findPath(
            {
                x: this.x,
                y: this.y
            },
            {
                x: this.scene.hero.x,
                y: this.scene.hero.y
            }
        );
        if (path == null) {
            this.enemyState = State.IDLE;
            this.target = undefined;
            return;
        }

        this.target = path[1];
        this.enemyState = State.FOLLOW;
    }

    setWalkAnimation() {
        let velocityRadiansAngle = (this.body as Phaser.Physics.Arcade.Body).velocity.angle();
        let velocityDegreeAngle = (velocityRadiansAngle * 180) / Math.PI;

        let direction: string = 'err';
        if (velocityDegreeAngle >= 315 || velocityDegreeAngle <= 45) {
            this.enemyPosition = Position.EAST;
            direction = 'e';
        }
        if (135 <= velocityDegreeAngle && velocityDegreeAngle <= 225) {
            this.enemyPosition = Position.WEST;
            direction = 'w';
        }
        if (45 < velocityDegreeAngle && velocityDegreeAngle < 135) {
            this.enemyPosition = Position.SOUTH;
            direction = 's';
        }
        if (225 < velocityDegreeAngle && velocityDegreeAngle < 315) {
            this.enemyPosition = Position.NORTH;
            direction = 'n';
        }

        if (direction == 'e' || direction == 'n') {
            this.anims.play('phantom_run-e-anim', true);
        }
        if (direction == 'w' || direction == 's') {
            this.anims.play('phantom_run-w-anim', true);
        }
    }

    freeze() {
        if (this.enemyState == State.DEAD) {
            return;
        }
        this.enemyState = State.FREEZE;
        (this.body as Phaser.Physics.Arcade.Body).setVelocity(0);
    }

    kill() {
        if (this.enemyState == State.DEAD) {
            return;
        }
        this.enemyState = State.DEAD;
        if (this.enemyPosition == Position.WEST || this.enemyPosition == Position.SOUTH) {
            this.anims.play('phantom_death-w-anim', true);
        }
        if (this.enemyPosition == Position.EAST || this.enemyPosition == Position.NORTH) {
            this.anims.play('phantom_death-e-anim', true);
        }

        (this.body as Phaser.Physics.Arcade.Body).setVelocity(0);
        this.scene.physics.world.removeCollider(this.heroCollider);
        this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            this.setActive(false);
            this.destroy();
        });
        //this.scene.time.delayedCall(2 * 1000, () => this.destroy(), [], this);
    }
}
