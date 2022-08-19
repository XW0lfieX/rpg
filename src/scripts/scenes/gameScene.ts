import 'phaser';
import { Scene } from 'phaser';
import Hero from '../sprites/hero';
import { PhaserNavMeshPlugin } from 'phaser-navmesh';
import Enemy from '../sprites/enemy';

export default class GameScene extends Scene {
    hero: Hero;
    teleportAreas: Array<Phaser.Types.Tilemaps.TiledObject>;
    map: Phaser.Tilemaps.Tilemap;
    collisionLayer: Phaser.Tilemaps.TilemapLayer;
    navMeshPlugin: PhaserNavMeshPlugin;

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

        this.load.spritesheet('phantom_death-w-ss', 'assets/enemies/phantom/phantom_death_anim_left_strip_8.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('phantom_death-e-ss', 'assets/enemies/phantom/phantom_death_anim_right_strip_8.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('phantom_idle-w-ss', 'assets/enemies/phantom/phantom_idle_anim_left_strip_4.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('phantom_idle-e-ss', 'assets/enemies/phantom/phantom_idle_anim_right_strip_4.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('phantom_run-w-ss', 'assets/enemies/phantom/phantom_run_anim_left_strip_6.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('phantom_run-e-ss', 'assets/enemies/phantom/phantom_run_anim_right_strip_6.png', { frameWidth: 16, frameHeight: 16 });

        this.load.tilemapTiledJSON('map', 'assets/maps/maps/mapa.json');
        this.load.image('all_in_one-tiles', 'assets/maps/tilesets/all_in_one.png');
        this.load.image('pixil-frame-tiles', 'assets/maps/tilesets/pixil-frame.png');
        this.load.image('fullsheet-tiles', 'assets/maps/tilesets/fullsheet.png');
    }

    create() {
        this.cameras.main.fadeIn(1000);
        this.cameras.main.setBackgroundColor('#000000');

        this.map = this.make.tilemap({ key: 'map' });

        let tileset = this.map.addTilesetImage('furniture', 'all_in_one-tiles', 16, 16, 0, 0);
        let tileset2 = this.map.addTilesetImage('overworld good', 'pixil-frame-tiles', 16, 16, 0, 0);
        let tileset3 = this.map.addTilesetImage('barcuta', 'fullsheet-tiles', 16, 16, 0, 0);

        let water = this.map.createLayer('water', [tileset, tileset2, tileset3], 0, 0);
        let ground = this.map.createLayer('ground', [tileset, tileset2, tileset3], 0, 0);
        let deco = this.map.createLayer('deco', [tileset, tileset2, tileset3], 0, 0);
        this.collisionLayer = this.map.createLayer('collision', [tileset, tileset2, tileset3], 0, 0);
        let above = this.map.createLayer('above', [tileset, tileset2, tileset3], 0, 0);

        this.collisionLayer.setCollisionBetween(tileset.firstgid, tileset.firstgid + tileset.total, true);
        this.collisionLayer.setCollisionBetween(tileset2.firstgid, tileset2.firstgid + tileset2.total, true);
        this.collisionLayer.setCollisionBetween(tileset3.firstgid, tileset3.firstgid + tileset3.total, true);

        above.setDepth(200);

        let spawnPoint: Phaser.Types.Tilemaps.TiledObject = this.map.findObject('chestii', (obj) => obj.name == 'Spawn Point');

        this.hero = new Hero(this, spawnPoint.x, spawnPoint.y);
        this.hero.setDepth(100);

        this.teleportAreas = this.map.filterObjects('chestii', (obj) => obj.type === 'TELEPORT_AREA');

        let enemyObjects: Phaser.Types.Tilemaps.TiledObject[] = this.map.getObjectLayer('chestii').objects.filter((obj) => obj.name == 'enemy');
        for (let enemyObject of enemyObjects) {
            let enemy = new Enemy(this, enemyObject.x, enemyObject.y);
        }

        this.physics.add.collider(this.hero, this.collisionLayer);

        this.physics.world.setBoundsCollision(true, true, true, true);

        let camera = this.cameras.main;
        camera.startFollow(this.hero);
        camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        camera.setZoom(3);
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    }

    update(time, delta) {}
}
