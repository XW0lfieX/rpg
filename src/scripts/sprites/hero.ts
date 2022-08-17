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
    keyFire: Phaser.Input.Keyboard.Key;

    heroState: HeroState = HeroState.IDLE;
    heroPosition: HeroPosition = HeroPosition.WEST;
}
