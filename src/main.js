import { MenuScene, PauseScene, EndScene, SettingsScene, ControlsScene } from './MenuScene.js';

// x 304.3372 ./
// y 189.2928

// lettertype veranderd 1ste keer in het menu bij hover, daarna niet meer

// bugs speler als hij geraakt wordt?
// gaat de spelers queue leeg als hij wordt geraakt?

// oppo blockt te weinig, en blijft niet stil staan als hij blockt, dat moet wel.
// verschil tussen speler en tegenstander met stoten en lopen tegelijk, moet verbeterd.

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#e7e7e7',
    scale: {
    mode: Phaser.Scale.NONE,
    autoCenter: Phaser.Scale.CENTER_BOTH
        },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    render: {
        antialias: true,
        pixelArt: false 
    },
        scene: [MenuScene]
};

let cursors;

let keyQ, keyE, keyA, keyD, keySpace, keyW, keyS, keyDown;
let player;
let opponent;
let punching = false;
let playerPunching = false;
let opponentPunching = false;
let opponentDirection = 1;
let opponentMoveTimer = 0;
let opponentPunchTimer = 0;
let playerAttackQueue = [];
let roundEnded = false;

let playerSilhouette, opponentSilhouette;
let playerMask, opponentMask;
let playerHealthBar, opponentHealthBar;
 
const game = new Phaser.Game(config);

game.scene.add('GameScene', { preload, create, update });
game.scene.add('PauseScene', PauseScene);
game.scene.add('EndScene', EndScene);
game.scene.add('SettingsScene', SettingsScene);
game.scene.add('ControlsScene', ControlsScene);

const DEPTH = {
    BACKGROUND: -1,
    FENCE: -0.2,
    BASE: -0.1,
    WALL: 0, 
    FLOOR: 1,
    BACKGROUND_BOXER: 1.3,
    FLOOR_OUTLINE_BACK: 1.2,
    FLOOR_OUTLINE_SIDE: 1.4,
    FLOOR_OUTLINE_FRONT: 1.5,
    POSTER: 1.6,
    FLOOR_LOGO: 1.7,
    BACK_POST: 2,
    FRONT_POST: 3.1,
    ROPE_BACK: 2.5,
    ROPE_FRONT: 3,
    ROPE_SIDE: 2.6,
    PLAYER: 2.7,
    OPPONENT: 2.7,
    ROOF: 3,
    LOGO: 3.2,
    STAIRS: 3.2,
    EFFECTS_LOW: 2.2,
    EFFECTS_HIGH: 3.5,
    HUD: 1000
};

function preload() {

this.load.image('playerSilhouette', '/2d_boxing/sprites/sil_sprite.png');
this.load.image('opponentSilhouette', '/2d_boxing/sprites/sil_sprite.png');
this.load.image('bgScenery', '/2d_boxing/images/background.jpg');
this.load.image('floor', '/2d_boxing/images/concrete.jpg');
this.load.image('roof', '/2d_boxing/images/roof.jpg');
this.load.image('fence', '/2d_boxing/images/fence.png')
this.load.image('logo_floor', '/2d_boxing/images/floor_logo.png')
this.load.image('wallTexture', '/2d_boxing/images/wall_texture.png')
this.load.image('wallPoster', '/2d_boxing/images/boxing_image.png');
this.load.image('wallPoster2', '/2d_boxing/images/boxing_club2.png');


this.load.spritesheet('bgBoxerBag_part1', '/2d_boxing/sprites/bg_boxer_bag_part1.png', {
  frameWidth: 640,
  frameHeight: 360
});

this.load.spritesheet('bgBoxerBag_part2', '/2d_boxing/sprites/bg_boxer_bag_part2.png', {
  frameWidth: 640,
  frameHeight: 360
});

this.load.spritesheet('bgBoxerBag_part3', '/2d_boxing/sprites/bg_boxer_bag_part3.png', {
  frameWidth: 640,
  frameHeight: 360
});

this.load.spritesheet('bgBoxerBag_part4', '/2d_boxing/sprites/bg_boxer_bag_part4.png', {
  frameWidth: 640,
  frameHeight: 360
});

this.load.spritesheet('bgBoxerBag_part5', '/2d_boxing/sprites/bg_boxer_bag_part5.png', {
  frameWidth: 640,
  frameHeight: 360
});


this.load.spritesheet('idle', '/2d_boxing/sprites/Player_idle.png', {
  frameWidth: 640,
  frameHeight: 360,
  margin: 0,
  spacing: 0
});

this.load.spritesheet('oppo_idle', '/2d_boxing/sprites/Oppo_idle.png', {
  frameWidth: 640,
  frameHeight: 360,
  margin: 0,
  spacing: 0
});

this.load.spritesheet('front_step', '/2d_boxing/sprites/Player_front_step.png', {
  frameWidth: 640,
  frameHeight: 360
});

this.load.spritesheet('oppo_front_step', '/2d_boxing/sprites/Oppo_front_step.png', {
  frameWidth: 640,
  frameHeight: 360
});

this.load.spritesheet('back_step', '/2d_boxing/sprites/Player_back_step.png', {
    frameWidth: 640,  
    frameHeight: 360  
});

this.load.spritesheet('oppo_back_step', '/2d_boxing/sprites/oppo_back_step.png', {
    frameWidth: 640,  
    frameHeight: 360  
});

this.load.spritesheet('player_enter_block', '/2d_boxing/sprites/Player_enter_block.png', {
    frameWidth: 640,  
    frameHeight: 360  
});

this.load.spritesheet('player_enter_block_low', '/2d_boxing/sprites/Player_enter_block_low.png', {
    frameWidth: 640,  
    frameHeight: 360  
});

this.load.spritesheet('oppo_enter_block', '/2d_boxing/sprites/oppo_enter_block.png', {
    frameWidth: 640,  
    frameHeight: 360  
});

this.load.spritesheet('player_block', '/2d_boxing/sprites/Player_block.png', {
    frameWidth: 640,  
    frameHeight: 360  
});

this.load.spritesheet('player_block_low', '/2d_boxing/sprites/Player_block_low.png', {
    frameWidth: 640,  
    frameHeight: 360  
});

this.load.spritesheet('oppo_block', '/2d_boxing/sprites/oppo_block.png', {
    frameWidth: 640,  
    frameHeight: 360  
});

this.load.spritesheet('jab_anim', '/2d_boxing/sprites/Player_jab.png', { 
    frameWidth: 640, 
    frameHeight: 360 
});

this.load.spritesheet('jab_body_anim', '/2d_boxing/sprites/Player_jab_body.png', { 
    frameWidth: 640, 
    frameHeight: 360 
});

this.load.spritesheet('oppo_jab_anim', '/2d_boxing/sprites/oppo_jab.png', { 
    frameWidth: 640, 
    frameHeight: 360 
});

this.load.spritesheet('cross_anim', '/2d_boxing/sprites/Player_cross.png', { 
    frameWidth: 640, 
    frameHeight: 360 
});

this.load.spritesheet('cross_body_anim', '/2d_boxing/sprites/Player_cross_body.png', { 
    frameWidth: 640, 
    frameHeight: 360 
});

this.load.spritesheet('oppo_cross_anim', '/2d_boxing/sprites/oppo_cross.png', { 
    frameWidth: 640, 
    frameHeight: 360 
});


this.load.spritesheet('get_light_hit', '/2d_boxing/sprites/get_light_hit.png', {
    frameWidth: 640,
    frameHeight: 360
});


this.load.spritesheet('oppo_get_light_hit', '/2d_boxing/sprites/oppo_get_light_hit.png', {
    frameWidth: 640,
    frameHeight: 360
});

this.load.spritesheet('get_hit_body', '/2d_boxing/sprites/get_hit_body.png', {
    frameWidth: 640,
    frameHeight: 360
});


this.load.spritesheet('oppo_get_hit_body', '/2d_boxing/sprites/oppo_get_hit_body.png', {
    frameWidth: 640,
    frameHeight: 360
});

this.load.spritesheet('get_hard_hit', '/2d_boxing/sprites/get_hard_hit.png', {
    frameWidth: 640,
    frameHeight: 360
});


this.load.spritesheet('oppo_get_hard_hit', '/2d_boxing/sprites/oppo_get_hard_hit.png', {
    frameWidth: 640,
    frameHeight: 360
});

this.load.spritesheet('player_KO', '/2d_boxing/sprites/player_KO.png', {
    frameWidth: 640,
    frameHeight: 360
});

this.load.spritesheet('oppo_KO', '/2d_boxing/sprites/oppo_KO.png', {
    frameWidth: 640,
    frameHeight: 360
});

}

function create() {

        // Beweging toetsen speler
cursors = this.input.keyboard.createCursorKeys();
keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

keySpace.on('down', () => {
    console.log('Combo geannuleerd!');
    playerAttackQueue = [];
});

this.input.keyboard.on('keydown-P', () => {
    if (!this.scene.isPaused()) {
        this.scene.pause();
        this.scene.launch('PauseScene');
    }
});

// bgBoxerBag animaties
for (let i = 1; i <= 5; i++) {
    if (!this.anims.exists(`bgBoxerBag_part${i}`)) {
        this.anims.create({
            key: `bgBoxerBag_part${i}`,
            frames: this.anims.generateFrameNumbers(`bgBoxerBag_part${i}`, { start: 0, end: 20 }),
            frameRate: 16,
            repeat: 0
        });
    }
}

// Idle animaties
if (!this.anims.exists('idle_anim')) {
    this.anims.create({ 
        key: 'idle_anim',
        frames: this.anims.generateFrameNumbers('idle', { start: 0, end: 20 }),
        frameRate: 12,
        repeat: -1
    });
}

if (!this.anims.exists('oppo_idle_anim')) {
    this.anims.create({ 
        key: 'oppo_idle_anim',
        frames: this.anims.generateFrameNumbers('oppo_idle', { start: 0, end: 20 }),
        frameRate: 12,
        repeat: -1
    });
}

// Step animaties
if (!this.anims.exists('front_step_anim')) {
    this.anims.create({
        key: 'front_step_anim',
        frames: this.anims.generateFrameNumbers('front_step', { start: 0, end: 20 }),
        frameRate: 18,
        repeat: -1
    });
}

if (!this.anims.exists('oppo_front_step_anim')) {
    this.anims.create({ 
        key: 'oppo_front_step_anim',
        frames: this.anims.generateFrameNumbers('oppo_front_step', { start: 0, end: 20 }),
        frameRate: 18,
        repeat: -1
    });
}

if (!this.anims.exists('back_step_anim')) {
    this.anims.create({
        key: 'back_step_anim',
        frames: this.anims.generateFrameNumbers('back_step', { start: 0, end: 20 }),
        frameRate: 18,
        repeat: -1
    });
}

if (!this.anims.exists('oppo_back_step_anim')) {
    this.anims.create({
        key: 'oppo_back_step_anim',
        frames: this.anims.generateFrameNumbers('oppo_back_step', { start: 0, end: 20 }),
        frameRate: 18,
        repeat: -1
    });
}

// Block animaties
if (!this.anims.exists('player_enter_block')) {
    this.anims.create({
        key: 'player_enter_block',
        frames: this.anims.generateFrameNumbers('player_enter_block', { start: 0, end: 4 }),
        frameRate: 24,
        repeat: 0
    });
}

if (!this.anims.exists('player_enter_block_low')) {
    this.anims.create({
        key: 'player_enter_block_low',
        frames: this.anims.generateFrameNumbers('player_enter_block_low', { start: 0, end: 4 }),
        frameRate: 20,
        repeat: 0
    });
}

if (!this.anims.exists('player_block')) {
    this.anims.create({
        key: 'player_block',
        frames: this.anims.generateFrameNumbers('player_block', { start: 0, end: 2 }),
        frameRate: 2,
        repeat: -1
    });
}

if (!this.anims.exists('player_block_low')) {
    this.anims.create({
        key: 'player_block_low',
        frames: this.anims.generateFrameNumbers('player_block_low', { start: 0, end: 3 }),
        frameRate: 2,
        repeat: -1
    });
}

if (!this.anims.exists('oppo_enter_block')) {
    this.anims.create({
        key: 'oppo_enter_block',
        frames: this.anims.generateFrameNumbers('oppo_enter_block', { start: 0, end: 4 }),
        frameRate: 24,
        repeat: 0
    });
}

if (!this.anims.exists('oppo_block')) {
    this.anims.create({
        key: 'oppo_block',
        frames: this.anims.generateFrameNumbers('oppo_block', { start: 0, end: 2 }),
        frameRate: 2,
        repeat: -1
    });
}

const punchAnimsConfig = [
    { key: 'jab_anim', texture: 'jab_anim', start:0, end:20, frameRate:54, repeat:0 },
    { key: 'jab_body_anim', texture: 'jab_body_anim', start:0, end:15, frameRate:28, repeat:0 },
    { key: 'oppo_jab_anim', texture: 'oppo_jab_anim', start:0, end:20, frameRate:54, repeat:0 },
    { key: 'cross_anim', texture: 'cross_anim', start:0, end:20, frameRate:40, repeat:0 },
    { key: 'cross_body_anim', texture: 'cross_body_anim', start:0, end:15, frameRate:28, repeat:0 },
    { key: 'oppo_cross_anim', texture: 'oppo_cross_anim', start:0, end:20, frameRate:40, repeat:0 },
    { key: 'get_light_hit_anim', texture: 'get_light_hit', start:0, end:7, frameRate:24, repeat:0 },
    { key: 'oppo_get_light_hit_anim', texture: 'oppo_get_light_hit', start:0, end:7, frameRate:24, repeat:0 },
    { key: 'get_hit_body_anim', texture: 'get_hit_body', start:0, end:7, frameRate:24, repeat:0 },
    { key: 'oppo_get_hit_body_anim', texture: 'oppo_get_hit_body', start:0, end:7, frameRate:24, repeat:0 },
    { key: 'get_hard_hit_anim', texture: 'get_hard_hit', start:0, end:7, frameRate:24, repeat:0 },
    { key: 'oppo_get_hard_hit_anim', texture: 'oppo_get_hard_hit', start:0, end:7, frameRate:24, repeat:0 },
    { key: 'player_KO', texture: 'player_KO', start:0, end:20, frameRate:24, repeat:0 },
    { key: 'oppo_KO', texture: 'oppo_KO', start:0, end:20, frameRate:24, repeat:0 }
];

punchAnimsConfig.forEach(anim => {
    if (!this.anims.exists(anim.key)) {
        this.anims.create({
            key: anim.key,
            frames: this.anims.generateFrameNumbers(anim.texture, { start: anim.start, end: anim.end }),
            frameRate: anim.frameRate,
            repeat: anim.repeat
        });
    }
});


keyQ.on('down', () => {
    console.log('Q pressed → queuePlayerAttack left');
    queuePlayerAttack('left');
});

keyE.on('down', () => {
    console.log('E pressed → queuePlayerAttack right');
    queuePlayerAttack('right');
});

keyA.on('down', () => {
    console.log('A pressed → queuePlayerAttack left');
    queuePlayerAttack('jab_body');
});

keyD.on('down', () => {
    console.log('D pressed → queuePlayerAttack right');
    queuePlayerAttack('cross_body');
});

    // Voeg achtergrondafbeelding toe
    const bgScenery = this.add.image(520, 154, 'bgScenery'); // midden van 800x600
    bgScenery.setDepth(DEPTH.BACKGROUND); // zet achter hek en gebouw
    bgScenery.setOrigin(0.5);
    bgScenery.setScale(1); // pas aan als nodig

    const poster = this.add.image(280, 165, 'wallPoster'); // x en y pas je aan
    poster.setScale(1); // of kleiner/groter, indien nodig
    poster.setDepth(DEPTH.POSTER); // zodat hij voor/achter andere objecten staat

    const poster2 = this.add.image(105, 270, 'wallPoster2'); // x en y pas je aan
    poster2.setScale(1); // of kleiner/groter, indien nodig
    poster2.setDepth(DEPTH.POSTER); // zodat hij voor/achter andere objecten staat

    const floor_logo = this.add.image(400, 480, 'logo_floor'); // midden van 800x600
    floor_logo.setDepth(DEPTH.FLOOR_LOGO); // zet achter hek en gebouw
    floor_logo.setOrigin(0.5);
    floor_logo.setScale(0.9); // pas aan als nodig

 // Voeg het hek toe
  const fence = this.add.image(737, 200, 'fence'); 

  // Pas de schaal aan als het te groot/klein is
  fence.setScale(0.2);

  // Zet de diepte laag zodat het achter andere objecten staat
  fence.setDepth(DEPTH.FENCE);

  // Hulp-functie om meerdere animaties achter elkaar te spelen
function playChainedAnimations(sprite, keys) {
  let index = 0;
  function playNext() {
    sprite.play(keys[index]);
    sprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      index = (index + 1) % keys.length;
      playNext();
    });
  }
  playNext();
}

// Aanmaken van sprite
const boxerOnBag = this.add.sprite(720, 175, 'bgBoxerBag_part1');
boxerOnBag.setScale(0.68);
boxerOnBag.setDepth(DEPTH.BACKGROUND_BOXER);

// Start de reeks van 5 animaties
playChainedAnimations(boxerOnBag, [
  'bgBoxerBag_part1',
  'bgBoxerBag_part2',
  'bgBoxerBag_part3',
  'bgBoxerBag_part4',
  'bgBoxerBag_part5'
]);

 

// === ARENA FLOOR (verhoogde ring) ===
let floor = this.add.graphics();

// kleuren
let floorColorTop = 0xcc3333;  // vloer 
let floorColorFront = 0x151c0a; // rand voorkant 

// hoogte van de ring
let ringHeight = 60;

// vloer trapezium
floor.fillStyle(floorColorTop, 1);
floor.beginPath();
floor.moveTo(150, 440);   // linker-voor (bovenrand ring)
floor.lineTo(650, 440);   // rechter-voor (bovenrand ring)
floor.lineTo(700, 500);   // rechter-achter
floor.lineTo(100, 500);   // linker-achter
floor.closePath();
floor.fillPath();

// Kleine trapezium in het midden
let innerTrapeziumColor = 0x0077cc;  // voorbeeld kleur, past bij ring
floor.fillStyle(innerTrapeziumColor, 1);
floor.beginPath();
floor.moveTo(250, 445);  // linker-voor van klein trapezium
floor.lineTo(550, 445);  // rechter-voor
floor.lineTo(580, 490);  // rechter-achter
floor.lineTo(220, 490);  // linker-achter
floor.closePath();
floor.fillPath();

// Outline van het kleine trapezium
let innerOutline = this.add.graphics();
innerOutline.lineStyle(2, 0x888888, 0.8);  // zwarte lijn, dikte 2, alpha 0.8
innerOutline.beginPath();
innerOutline.moveTo(250, 445);  // linker-voor
innerOutline.lineTo(550, 445);  // rechter-voor
innerOutline.lineTo(580, 490);  // rechter-achter
innerOutline.lineTo(220, 490);  // linker-achter
innerOutline.closePath();
innerOutline.strokePath();
innerOutline.setDepth(DEPTH.FLOOR_OUTLINE_FRONT + 0.1); // iets boven de vloer-outline zetten

// Apron (de rand aan de voorkant)
floor.fillStyle(floorColorFront, 1);
floor.beginPath();
floor.moveTo(100, 500);                 // linker-voor boven
floor.lineTo(700, 500);                 // rechter-voor boven
floor.lineTo(700, 540 + ringHeight);    // rechter-voor onder
floor.lineTo(100, 540 + ringHeight);    // linker-voor onder
floor.closePath();
floor.fillPath();

floor.setDepth(DEPTH.FLOOR);

// outline langs vloer trapezium

// achterste lijn
let outlineBack = this.add.graphics();
outlineBack.lineStyle(2, 0x000000, 0.8);
outlineBack.beginPath();
outlineBack.moveTo(700, 500);   // rechter-achter
outlineBack.lineTo(100, 500);   // linker-achter
outlineBack.strokePath();
outlineBack.setDepth(DEPTH.FLOOR_OUTLINE_BACK);

// zijlijnen
let outlineSide = this.add.graphics();
outlineSide.lineStyle(2, 0x000000, 0.8);
outlineSide.beginPath();
outlineSide.moveTo(100, 500);   // linker-achter
outlineSide.lineTo(150, 440);   // linker-voor
outlineSide.moveTo(650, 440);   // rechter-voor
outlineSide.lineTo(700, 500);   // rechter-achter
outlineSide.strokePath();
outlineSide.setDepth(DEPTH.FLOOR_OUTLINE_SIDE);

// voorste lijn
let outlineFront = this.add.graphics();
outlineFront.lineStyle(2, 0x000000, 0.8);
outlineFront.beginPath();
outlineFront.moveTo(150, 440);  // linker-voor
outlineFront.lineTo(650, 440);  // rechter-voor
outlineFront.strokePath();
outlineFront.setDepth(DEPTH.FLOOR_OUTLINE_FRONT);

// linker verticale lijn van de apron
let outlineLeftSide = this.add.graphics();
outlineLeftSide.lineStyle(2, 0x000000, 1);
outlineLeftSide.beginPath();
outlineLeftSide.moveTo(100, 500);             // bovenkant linker-apron
outlineLeftSide.lineTo(100, 540 + ringHeight); // onderkant linker-apron
outlineLeftSide.strokePath();
outlineLeftSide.setDepth(DEPTH.FLOOR_OUTLINE_FRONT); // zelfde depth als bovenlijn

// rechter verticale lijn van de apron
let outlineRightSide = this.add.graphics();
outlineRightSide.lineStyle(2, 0x000000, 1);
outlineRightSide.beginPath();
outlineRightSide.moveTo(700, 500);             // bovenkant rechter-apron
outlineRightSide.lineTo(700, 540 + ringHeight); // onderkant rechter-apron
outlineRightSide.strokePath();
outlineRightSide.setDepth(DEPTH.FLOOR_OUTLINE_FRONT); // zelfde depth als bovenlijn

// === TRAPJE VOOR DE APRON (correct perspectief + lichtaccent) ===
let stairs = this.add.graphics();
stairs.setDepth(DEPTH.STAIRS);

// Kleuren
const treadColor = 0xb0b0b0;   // bovenkant (lichtgrijs)
const riserColor = 0x7a7a7a;   // voorkant (donkergrijs)
const outlineColor = 0x000000; // zwart
const highlightColor = 0xffffff; // wit accentlijn

// Afmetingen
const baseWidth = 180;         // breedte onderste trede
const widthStep = 18;          // hoeveel smaller elke bovenste trede wordt
const treadHeight = 8;         // dikte van de bovenkant
const riserHeight = 22;        // hoogte van de voorkant
const stepCount = 3;

// Startpositie (bovenkant bovenste trede)
const startX = 407;
const startY = 515;

for (let i = 0; i < stepCount; i++) {
    const width = baseWidth - (stepCount - 1 - i) * widthStep;
    const x = startX - width / 2;
    const yTop = startY + i * (treadHeight + riserHeight);
    const yFront = yTop + treadHeight;
    const topShrink = 8; // mate van perspectiefversmalling

    // --- Bovenkant trede ---
    stairs.fillStyle(treadColor, 1);
    stairs.beginPath();
    stairs.moveTo(x + topShrink, yTop);                // linker achterhoek
    stairs.lineTo(x + width - topShrink, yTop);        // rechter achterhoek
    stairs.lineTo(x + width, yTop + treadHeight);      // rechter voorkant
    stairs.lineTo(x, yTop + treadHeight);              // linker voorkant
    stairs.closePath();
    stairs.fillPath();

    // Outline bovenkant
    stairs.lineStyle(2, outlineColor, 1);
    stairs.strokePath();

    // --- Lichtaccent op bovenrand ---
    stairs.lineStyle(1.5, highlightColor, 0.7);
    stairs.beginPath();
    stairs.moveTo(x + topShrink, yTop + 1);                  // net iets onder de rand
    stairs.lineTo(x + width - topShrink, yTop + 1);
    stairs.strokePath();

    // --- Voorkant trede ---
    stairs.fillStyle(riserColor, 1);
    stairs.fillRect(x, yFront, width, riserHeight);

    // Outline voorkant
    stairs.lineStyle(2, outlineColor, 1);
    stairs.strokeRect(x, yFront, width, riserHeight);
}

// Schaduw onderaan
stairs.fillStyle(0x000000, 0.25);
const shadowY = startY + stepCount * (treadHeight + riserHeight);
stairs.fillRect(startX - baseWidth / 2, shadowY, baseWidth, 5);


function drawPost(scene, x, y, height, front = true, isLeft = true, cornerColor = null) {
    let post = scene.add.graphics();

    let colorLight = cornerColor !== null ? cornerColor : (front ? 0x666666 : 0x444444);
    let colorDark  = front ? 0x333333 : 0x222222;

    if (front) {
        // Voorste palen: donker 66%, licht 33%
        if (isLeft) {
            post.fillStyle(colorDark, 1);
            post.fillRect(x - 8, y - height, 10, height);  // groter donker deel
            post.fillStyle(colorLight, 1);
            post.fillRect(x + 2, y - height, 4, height);   // kleiner licht deel
        } else {
            post.fillStyle(colorLight, 1);
            post.fillRect(x - 2, y - height, 4, height);   // kleiner licht deel
            post.fillStyle(colorDark, 1);
            post.fillRect(x + 2, y - height, 10, height);  // groter donker deel
        }
    } else {
        // Achterste palen: donker 33%, licht 66%
        if (isLeft) {
            post.fillStyle(colorDark, 1);
            post.fillRect(x - 8, y - height, 4, height);   // kleiner donker deel
            post.fillStyle(colorLight, 1);
            post.fillRect(x - 4, y - height, 10, height);  // groter licht deel
        } else {
            post.fillStyle(colorLight, 1);
            post.fillRect(x - 4, y - height, 10, height);  // groter licht deel
            post.fillStyle(colorDark, 1);
            post.fillRect(x + 6, y - height, 4, height);   // kleiner donker deel
        }
    }

    post.setDepth(front ? DEPTH.FRONT_POST : DEPTH.BACK_POST);
    return { gfx: post, x: x, y: y, height: height };
}

let backLeftPost  = drawPost(this, 157, 442, 120, false, true);           // neutraal
let backRightPost = drawPost(this, 643, 442, 120, false, false, 0x003399); // blauwe hoek

let frontLeftPost = drawPost(this, 108, 499, 150, true, true, 0x990000);   // rode hoek
let frontRightPost= drawPost(this, 688, 499, 150, true, false);           // neutraal

// === Maak alle touwen in één array ===
let ropes = [];
let segments = 20;

// Functie om een rope toe te voegen
function addRope(points, depth, colorSide = null, isSide = false) {
    let rope = this.add.graphics({ lineStyle: { width: 4, color: 0x888888 } });
    rope.points = points;
    rope.setDepth(depth);
    rope.colorSide = colorSide; // 'red', 'blue' of null
    rope.isSide = isSide;
    ropes.push(rope);
}

// === Voorste touwen ===
for (let i = 0; i < 3; i++) {
    let yOffset = 445 - (i * 30);
    let points = [];
    for (let s = 0; s <= segments; s++) {
        let t = s / segments;
        let x = Phaser.Math.Linear(frontLeftPost.x, frontRightPost.x, t);
        let curveY = yOffset + Math.sin(t * Math.PI) * 5;
        points.push(new Phaser.Geom.Point(x, curveY));
    }
    addRope.call(this, points, DEPTH.ROPE_FRONT, 'red'); // front-left is rode hoek
}

// === Achterste touwen ===
for (let i = 0; i < 3; i++) {
    let yOffset = 410 - (i * 30);
    let points = [];
    for (let s = 0; s <= segments; s++) {
        let t = s / segments;
        let x = Phaser.Math.Linear(backLeftPost.x, backRightPost.x, t);
        let curveY = yOffset + Math.sin(t * Math.PI) * 5;
        points.push(new Phaser.Geom.Point(x, curveY));
    }
    addRope.call(this, points, DEPTH.ROPE_BACK, 'blue'); // back-right is blauwe hoek
}

// === Zijtouwen linkerzijde ===
for (let i = 0; i < 3; i++) {
    let frontY = 445 - (i * 30);
    let backY  = 410 - (i * 30);
    let points = [];
    for (let s = 0; s <= segments; s++) {
        let t = s / segments;
        let x = Phaser.Math.Linear(frontLeftPost.x, backLeftPost.x, t);
        let y = Phaser.Math.Linear(frontY, backY, t);
        points.push(new Phaser.Geom.Point(x, y));
    }
    addRope.call(this, points, DEPTH.ROPE_SIDE, 'red', true);
}

// === Zijtouwen rechterzijde ===
for (let i = 0; i < 3; i++) {
    let frontY = 445 - (i * 30);
    let backY  = 410 - (i * 30);
    let points = [];
    for (let s = 0; s <= segments; s++) {
        let t = s / segments;
        let x = Phaser.Math.Linear(frontRightPost.x, backRightPost.x, t);
        let y = Phaser.Math.Linear(frontY, backY, t);
        points.push(new Phaser.Geom.Point(x, y));
    }
    addRope.call(this, points, DEPTH.ROPE_SIDE, 'blue', true);
}

// === Wiggle animatie met halve kleuren ===
this.time.addEvent({
    delay: 16,
    loop: true,
    callback: () => {
        let time = this.time.now / 200;

        ropes.forEach((rope) => {
            rope.clear();
            let newPoints = rope.points.map((p, index) => {
                let t = index / segments;
                let weight = Math.sin(t * Math.PI);
                let bump = (playerPunching || opponentPunching) ? 0.5 * weight : 0;
                let phaseShift = rope.depth === DEPTH.ROPE_BACK ? 0.8 : 0;
                let offset = (rope.isSide ? 1 : 2) * Math.sin(time + t * Math.PI + phaseShift) * weight + bump;
                return new Phaser.Geom.Point(p.x, p.y + offset);
            });

            for (let j = 0; j < newPoints.length - 1; j++) {
                let t = j / segments;
                let color;
                if (rope.colorSide === 'red' && t < 0.5) color = 0x990000;    // rode hoek: eerste helft
                else if (rope.colorSide === 'blue' && t >= 0.5) color = 0x003399; // blauwe hoek: tweede helft
                else color = 0x686868; 

                rope.lineStyle(4, color);
                rope.beginPath();
                rope.moveTo(newPoints[j].x, newPoints[j].y);
                rope.lineTo(newPoints[j + 1].x, newPoints[j + 1].y);
                rope.strokePath();

                // dunne outline
                rope.lineStyle(1, 0x000000, 0.65);  
                rope.beginPath();
                rope.moveTo(newPoints[j].x, newPoints[j].y);
                rope.lineTo(newPoints[j + 1].x, newPoints[j + 1].y);
                rope.strokePath();
            }
        });
    }
});

const vanishX = 400;  // midden van de ring
const vanishY = 200;  // hoog in beeld

// === PERSPECTIEF-LIJNEN VOOR ACHTERGROND ===
let depthLines = this.add.graphics();
// depthLines.lineStyle(2, 0x00ff00, 0.8); // groen, zodat je het goed ziet

// verdwijnpunt
depthLines.fillStyle(0xff0000);
// depthLines.fillCircle(vanishX, vanishY, 4); // rood puntje voor referentie

// vloer-lijnen (links en rechts)
depthLines.beginPath();
depthLines.moveTo(100, 500);  // linker achterrand ring
depthLines.lineTo(vanishX, vanishY); // loopt naar verdwijnpunt
depthLines.moveTo(700, 500);  // rechter achterrand ring
depthLines.lineTo(vanishX, vanishY);
depthLines.strokePath();

// achterlijn van de kamer (bijvoorbeeld 200px diepte)
// depthLines.lineStyle(1, 0x00ffff, 0.6);
depthLines.beginPath();
depthLines.moveTo(200, 380);  // experimenteer met dit punt
depthLines.lineTo(600, 380);
depthLines.strokePath();

// === LIJN VOOR OVERGANG VLOER → LINKER MUUR ===
let wallFloorLine = this.add.graphics();
// wallFloorLine.lineStyle(2, 0xffaa00, 0.9); // oranje om goed te zien

const wallFloorStartX = 0;
const wallFloorStartY = this.scale.height - 25;

let dx = vanishX - wallFloorStartX;
let dy = vanishY - wallFloorStartY;
let t = 1.5; // factor om de lijn te verlengen
let extendedX = wallFloorStartX + dx * t;
let extendedY = wallFloorStartY + dy * t;

wallFloorLine.beginPath();
wallFloorLine.moveTo(wallFloorStartX, wallFloorStartY);
wallFloorLine.lineTo(extendedX, extendedY);
wallFloorLine.strokePath();

// Nieuw punt voor bovenkant linker muur
const leftWallTopStart = { x: extendedX, y: extendedY };

let leftWallTopLine = this.add.graphics();
// leftWallTopLine.lineStyle(2, 0xffaa00, 0.9); // optionele kleur

// Beginpunt: linkerkant van het scherm, visueel “op de juiste hoogte” schuiven
let leftWallTopXStart = 0; 
let leftWallTopYStart = 115; // speel hiermee tot de hoek visueel klopt

// Eindpunt: referentiepunt van de verlengde oranje lijn
let leftWallTopXEnd = extendedX; 
let leftWallTopYEnd = extendedY;

leftWallTopLine.beginPath();
leftWallTopLine.moveTo(leftWallTopXStart, leftWallTopYStart);
leftWallTopLine.lineTo(leftWallTopXEnd, leftWallTopYEnd);
leftWallTopLine.strokePath();

// === VLOER volgens jouw laatste beschrijving ===

// Voorste punten (voorrand vloer)
const floorFrontLeft  = { x: wallFloorStartX, y: wallFloorStartY };           // linker voorkant (langs oranje lijn)
const floorFrontRight = { x: this.scale.width,    y: this.scale.height - 25 } // rechter voorkant (aan schermrand)

// De factor langs de oranje lijn waar de "achterste horizontale lijn" begint
const floorDepthFactor = 0.95; // jouw gekozen waarde

// Bereken depthAnchor: punt OP de lijn van floorFrontLeft -> (vanishX, vanishY)
const depthAnchor = {
  x: Phaser.Math.Linear(floorFrontLeft.x, vanishX, floorDepthFactor),
  y: Phaser.Math.Linear(floorFrontLeft.y, vanishY, floorDepthFactor)
};

// Nu bepalen we het punt waar die horizontale lijn de schermrand raakt
const depthAnchorRight = {
  x: this.scale.width,
  y: depthAnchor.y
};

// 2. Bepaal breedte en hoogte van het vloeroppervlak
const floorWidth = this.scale.width;
const floorHeight = this.scale.height - depthAnchor.y + 30; // +30 om onderhoekjes te bedekken

// 3. Voeg tileSprite toe als vloer
const arenaFloor = this.add.tileSprite(
  0,                // x (hele schermbreedte)
  depthAnchor.y,    // y (waar de vloer begint)
  floorWidth,       // breedte
  floorHeight,      // hoogte
  'floor'           // key van je texture in preload
);

arenaFloor.setOrigin(0, 0);
arenaFloor.setDepth(DEPTH.BASE);
arenaFloor.setTileScale(1.2, 1.2); // pas aan op basis van je texturegrootte

// === OUTLINE VOOR OVERGANG VLOER ↔ ACHTERWAND ===
let backWallBaseOutline = this.add.graphics();
backWallBaseOutline.lineStyle(2, 0x000000, 0.8); // donkere outline voor contrast

backWallBaseOutline.beginPath();
backWallBaseOutline.moveTo(depthAnchor.x, depthAnchor.y); // linker kant van de vloer
backWallBaseOutline.lineTo(depthAnchorRight.x, depthAnchorRight.y); // rechter kant van de vloer
backWallBaseOutline.strokePath();


const floorBackLeft = {
    x: Phaser.Math.Linear(floorFrontLeft.x, vanishX, floorDepthFactor),
    y: Phaser.Math.Linear(floorFrontLeft.y, vanishY, floorDepthFactor)
};

let leftWall = this.add.graphics();
leftWall.fillStyle(0x555555, 1); 
leftWall.lineStyle(2, 0x000000, 0.8);

let wallTopY = 50; // hoogte van bovenkant muur
let wallTopX = floorBackLeft.x; // x blijft hetzelfde als vloerhoek

leftWall.beginPath();
leftWall.moveTo(floorBackLeft.x, floorBackLeft.y); // startpunt: vloerhoek
leftWall.lineTo(wallTopX, wallTopY); // naar boven
leftWall.strokePath();

const leftWallTopCorner = {
  x: depthAnchor.x, // het echte punt waar vloer/muur samenkomen
  y: 50 // pas aan tot visueel goed klopt
};

let realLeftWallTopLine = this.add.graphics();
realLeftWallTopLine.lineStyle(2, 0x000000, 0.8); // zwarte lijn

realLeftWallTopLine.beginPath();
realLeftWallTopLine.moveTo(leftWallTopXStart, leftWallTopYStart); // linker bovenhoek muur
realLeftWallTopLine.lineTo(leftWallTopCorner.x, leftWallTopCorner.y); // bovenhoek kamer
realLeftWallTopLine.strokePath();

// Hulp: je huidige polygon punten (gebruik jouw variabelen)
const p0 = { x: wallFloorStartX, y: wallFloorStartY };         // links-onder
const p1 = { x: depthAnchor.x,   y: depthAnchor.y };          // rechts-onder
const p2 = { x: leftWallTopCorner.x, y: leftWallTopCorner.y };// rechts-boven
const p3 = { x: leftWallTopXStart,   y: leftWallTopYStart };  // links-boven

// 1) Visualiseer de polygon tijdelijk (debug)
const debugG = this.add.graphics();
debugG.fillStyle(0xff0000, 0.25); // rood, half transparant
debugG.beginPath();
debugG.moveTo(p0.x, p0.y);
debugG.lineTo(p1.x, p1.y);
debugG.lineTo(p2.x, p2.y);
debugG.lineTo(p3.x, p3.y);
debugG.closePath();
debugG.fillPath();

// 2) Bereken bounding box van polygon
const xs = [p0.x, p1.x, p2.x, p3.x];
const ys = [p0.y, p1.y, p2.y, p3.y];
const minX = Math.min(...xs);
const maxX = Math.max(...xs);
const minY = Math.min(...ys);
const maxY = Math.max(...ys);
const extra = 50; // aantal pixels extra boven en onder
const bboxH = Math.max(1, Math.ceil(maxY - minY) + extra);
const bboxW = Math.max(1, Math.ceil(maxX - minX) + extra);

// 3) Maak een tile sprite op bbox grootte (positie 0,0 relatief aan RT)
const pattern = this.add.tileSprite(0, 0, bboxW, bboxH, 'wallTexture');
pattern.setOrigin(0);

// Optional: schaal de tile (pas aan naar smaak)
pattern.setTileScale(1, 1.4); // of 0.5, 0.5 etc.

// 4) Maak RenderTexture exact bbox grootte en teken pattern erin
const rt = this.add.renderTexture(minX, minY, bboxW, bboxH);
rt.setOrigin(0);
rt.draw(pattern, 0, 0 - extra/2);

// 5) Maak dezelfde polygon grafics maar dan relatief aan de RT (offset met -minX/-minY)
const maskG = this.make.graphics({ x: 0, y: 0, add: false });
maskG.fillStyle(0xffffff);
maskG.beginPath();

// schuif de onderste punten (p0 en p1) iets naar beneden
maskG.moveTo(p0.x - minX, p0.y - minY + extra); 
maskG.lineTo(p1.x - minX, p1.y - minY + extra);

// bovenste punten blijven hetzelfde
maskG.lineTo(p2.x - minX, p2.y - minY);
maskG.lineTo(p3.x - minX, p3.y - minY);

maskG.closePath();
maskG.fillPath();
rt.setDepth(DEPTH.WALL);

// 6) Zet GeometryMask op de RT
const mask = maskG.createGeometryMask();
rt.setMask(mask);

// 7) Optioneel: destroy tijdelijke objects (maar laat debug even staan tot je tevreden bent)
pattern.destroy();

// Maak outline graphics
const outline = this.add.graphics();
outline.lineStyle(2, 0x000000, 0.8);

// Bovenkant
outline.beginPath();
outline.moveTo(p3.x, p3.y); // linksboven
outline.lineTo(p2.x, p2.y); // rechtsboven
outline.strokePath();

// Onderkant
outline.beginPath();
outline.moveTo(p0.x, p0.y); // linksonder
outline.lineTo(p1.x, p1.y); // rechtsonder
outline.strokePath();

// Zet outline iets boven de muur (depth)
outline.setDepth(DEPTH.WALL + 0.01);

// Bovenkant gebouw (van hoogste hoek naar linkerkant)
let buildingTopLine = this.add.graphics();
buildingTopLine.lineStyle(2, 0x000000, 0.8); // zwarte lijn

// Bepaal het linkse eindpunt (links van het scherm, zelfde Y als top hoek)
let leftTopX = 0; 
let leftTopY = leftWallTopCorner.y;

buildingTopLine.beginPath();
buildingTopLine.moveTo(leftWallTopCorner.x, leftWallTopCorner.y); // startpunt: hoogste hoek
buildingTopLine.lineTo(leftTopX, leftTopY);                         // eindpunt: links van scherm
buildingTopLine.strokePath();

// === Bovenste rand van het dak ===
let roofTopEdge = this.add.graphics();
roofTopEdge.lineStyle(2, 0x000000, 0.8); // zwarte lijn
roofTopEdge.beginPath();
roofTopEdge.moveTo(leftWallTopCorner.x, leftWallTopCorner.y);
roofTopEdge.lineTo(leftTopX, leftTopY);
roofTopEdge.strokePath();

// === Onderste rand van de daklijst (5px lager) ===
let roofBottomEdge = this.add.graphics();
roofBottomEdge.lineStyle(2, 0x000000, 0.8); // zwarte lijn
roofBottomEdge.beginPath();
roofBottomEdge.moveTo(leftWallTopCorner.x - 65, leftWallTopCorner.y + 5);
roofBottomEdge.lineTo(leftTopX, leftTopY + 5);
roofBottomEdge.strokePath();

let roofSideEdge = this.add.graphics();
roofSideEdge.lineStyle(2, 0x000000, 0.8); // zwarte lijn

// verkort de lijn door het eindpunt iets naar links (X) of iets naar beneden (Y) te zetten
let shortenedX = leftWallTopCorner.x - 65; // stop eerder naar links
let shortenedY = leftWallTopCorner.y + 5;  // stop iets lager

roofSideEdge.beginPath();
roofSideEdge.moveTo(leftWallTopXStart - 40, leftWallTopYStart - 10);
roofSideEdge.lineTo(shortenedX, shortenedY);
roofSideEdge.strokePath();

// === Vulvlak voor de dakrand ===
let roofTrim = this.add.graphics();
roofTrim.fillStyle(0x3f3f36); 

roofTrim.beginPath();

// volgorde van de punten: linksboven → rechtsboven → rechtsonder → linksonder
roofTrim.moveTo(leftTopX, leftTopY);                           // linksboven
roofTrim.lineTo(leftWallTopCorner.x, leftWallTopCorner.y);     // rechtsboven
roofTrim.lineTo(shortenedX, shortenedY);                       // rechtsonder
roofTrim.lineTo(leftTopX, leftTopY + 8);                       // linksonder
roofTrim.closePath();

roofTrim.fillPath();
roofTrim.strokePath();

// === Schuin deel van de dakrand (langs linker muur) ===
let slantedRoofTrim = this.add.graphics();
slantedRoofTrim.fillStyle(0x3f3f36); // zelfde kleur als het bovenste vlak

slantedRoofTrim.beginPath();
slantedRoofTrim.moveTo(leftWallTopXStart, leftWallTopYStart);        // bovenhoek muur links
slantedRoofTrim.lineTo(leftWallTopCorner.x, leftWallTopCorner.y);    // hoek muur/dak rechts
slantedRoofTrim.lineTo(shortenedX, shortenedY);                      // iets lager, buitenste dakrand rechts
slantedRoofTrim.lineTo(leftWallTopXStart - 40, leftWallTopYStart - 10); // parallelle onderste lijn links
slantedRoofTrim.closePath();

slantedRoofTrim.fillPath();
slantedRoofTrim.strokePath();

// === DAK MET TEXTURE (mask) ===

// punten van het driehoekige dakvlak
const roofA = { x: leftTopX, y: leftTopY + 8 };                         // linker bovenhoek binnenkant dakrand
const roofB = { x: leftWallTopCorner.x - 65, y: leftWallTopCorner.y + 5 }; // middenpunt dak
const roofC = { x: leftWallTopXStart - 40, y: leftWallTopYStart - 10 };    // onderste hoek, parallel met muur

// bepaal de bounding box van het driehoekje
const roofMinX = Math.min(roofA.x, roofB.x, roofC.x);
const roofMinY = Math.min(roofA.y, roofB.y, roofC.y);
const roofMaxX = Math.max(roofA.x, roofB.x, roofC.x);
const roofMaxY = Math.max(roofA.y, roofB.y, roofC.y);

// 1. Maak een tileSprite voor de daktextuur
const roofTile = this.add.tileSprite(
  roofMinX,
  roofMinY,
  roofMaxX - roofMinX,
  roofMaxY - roofMinY,
  'roof'
);
roofTile.setOrigin(0, 0);
roofTile.setTileScale(0.1, 0.1); // pas aan afhankelijk van textuur
// roofTile.setDepth(DEPTH.ROOF);

// 2. Masker maken zodat de texture alleen binnen het dakvlak zichtbaar is
const roofMaskGfx = this.make.graphics({ x: 0, y: 0, add: false });
roofMaskGfx.fillStyle(0xffffff);
roofMaskGfx.beginPath();
roofMaskGfx.moveTo(roofA.x, roofA.y);
roofMaskGfx.lineTo(roofB.x, roofB.y);
roofMaskGfx.lineTo(roofC.x, roofC.y);
roofMaskGfx.closePath();
roofMaskGfx.fillPath();

const roofGeomMask = roofMaskGfx.createGeometryMask();
roofTile.setMask(roofGeomMask);

// 4. Outlines (alleen boven en rechts)
const roofOutline = this.add.graphics();
roofOutline.lineStyle(2, 0x111111, 0.8); // dikte, kleur, transparantie
roofOutline.beginPath();

// lijn tussen A → B
roofOutline.moveTo(roofA.x, roofA.y);
roofOutline.lineTo(roofB.x, roofB.y);

// lijn tussen B → C
roofOutline.moveTo(roofB.x, roofB.y);
roofOutline.lineTo(roofC.x, roofC.y);

roofOutline.strokePath();
roofOutline.setDepth(DEPTH.ROOF);

// === BOVENSTE LIJN VAN DE ACHTERWAND ===
let backWallTopLine = this.add.graphics();
// backWallTopLine.lineStyle(2, 0x000000, 0.8); // zwart om goed te zien

const backWallTopStartX = leftWallTopCorner.x;
const backWallTopStartY = leftWallTopCorner.y;
const backWallTopEndX = this.scale.width; // helemaal tot rechts
const backWallTopEndY = leftWallTopCorner.y; // horizontaal, dus zelfde Y

backWallTopLine.beginPath();
backWallTopLine.moveTo(backWallTopStartX, backWallTopStartY);
backWallTopLine.lineTo(backWallTopEndX, backWallTopEndY);
backWallTopLine.strokePath();

this.physics.world.createDebugGraphic();

// Speler 
player = this.add.sprite(200, 430, 'idle');
player.health = 250;
this.physics.add.existing(player);
player.body.setCollideWorldBounds(true); 
player.anims.play('idle_anim');
player.setScale(0.75);
player.setFlipX(false);

let bodyHeight = player.height * 0.75 * player.scaleY;
player.body.setSize(player.width * player.scaleX, bodyHeight, true);
player.body.setOffset(player.width * player.scaleX * 0.18, player.height * player.scaleY - bodyHeight);
player.y -= 27.5;
player.setDepth(DEPTH.PLAYER);  // boksers boven vloer

// initialiseer state properties op het sprite-object
player.isAnimating = false;
player.isBlocking = false;
player.blockAnim = 'player_block'; // maak of wijzignaam naar jouw anim key als je die later toevoegt

// Tegenstander 
opponent = this.add.sprite(600, 430, 'oppo_idle');
opponent.health = 250;
this.physics.add.existing(opponent);
opponent.body.setCollideWorldBounds(true);
opponent.anims.play('oppo_idle_anim');
opponent.setScale(0.75);
opponent.setFlipX(false);

player.attackLock = false;  // tijdens eigen punch animatie
player.stunLock = false;   // tijdens hit-reactie animatie
opponent.attackLock = false;
opponent.stunLock = false;

let bodyHeightOpp = opponent.height * 0.75 * opponent.scaleY;
opponent.body.setSize(opponent.width * opponent.scaleX, bodyHeightOpp, true);
opponent.body.setOffset(player.width * player.scaleX * 0.1, opponent.height * opponent.scaleY - bodyHeight);
opponent.y -= 27.5; 
opponent.setDepth(DEPTH.OPPONENT);

// initialiseer opponent state
opponent.isAnimating = false;
opponent.isBlocking = false;
opponent.blockAnim = 'oppo_block'; // pas aan naar jouw anim key
opponent.isAttackAnimating = false;
player.isAttackAnimating = false;
opponent.lastBlockTime = 0; // timestamp van laatste block start
opponent.minBlockDuration = 1500; // minimaal 1,5 seconde block
opponent.blockCooldown = 2000; // mag max 1x per 2 sec block starten

// AI block properties
opponent.blockingLocked = false;
opponent.blockingQueued = false;

// 🔄 Flags resetten bij start of rematch
roundEnded = false;
player.attackLock = false;
player.isAnimating = false;
player.stunLock = false;
player.isAttackAnimating = false;

opponent.attackLock = false;
opponent.isAnimating = false;
opponent.stunLock = false;
opponent.isAttackAnimating = false;


// PLAYER linksboven
playerSilhouette = this.add.image(120, 590, 'playerSilhouette')
  .setOrigin(0, 1) // onderaan uitlijnen
  .setScrollFactor(0)
  .setDepth(DEPTH.HUD)
  .setFlipX(true);

// schaal naar een fijne HUD-hoogte (pas 80 aan naar smaak)
const targetHudHeight = 80;
const scaleP = targetHudHeight / playerSilhouette.height;
playerSilhouette.setScale(scaleP);

// silhouet altijd zichtbaar
playerSilhouette.setVisible(true).setTint(0x000000); 

// vulling (Graphics) die we masken met de silhouet
playerHealthBar = this.add.graphics().setScrollFactor(0).setDepth(1001);
playerMask = playerSilhouette.createBitmapMask();
playerHealthBar.setMask(playerMask);


// OPPONENT rechtsboven
opponentSilhouette = this.add.image(this.game.config.width - 120, 590, 'opponentSilhouette')
  .setOrigin(1, 1)
  .setScrollFactor(0)
  .setDepth(1000);

// zelfde schaal gebruiken
opponentSilhouette.setScale(scaleP);
opponentSilhouette.setVisible(false);

opponentHealthBar = this.add.graphics().setScrollFactor(0).setDepth(1001);
opponentMask = opponentSilhouette.createBitmapMask();
opponentHealthBar.setMask(opponentMask);

    // Camera fade-in: vanaf zwart naar normaal
    this.cameras.main.fadeIn(1750, 0, 0, 0); // 600ms fade, zwart (0,0,0)

// Helemaal als laatste in create:
    // Optioneel: healthbars pas updaten NA de fade
    this.cameras.main.once('camerafadeincomplete', () => {
        updateHealthBars();
    })
}



// --- Helper: check of sprite actie kan starten ---
function canStartAction(sprite) {
    // unify to check the actual lock flags you use
    return !sprite.isAnimating && !sprite.attackLock && !sprite.stunLock;
}

// --- Interrupt helper: stop huidige actie en clear queue van target ---
function interruptAction(target) {
    // stop eventuele attack animatie en clear queue
    target.attackLock = false;
    target.stunLock = false;
    target.isAnimating = false;
    target.isBlocking = false;

    // speciale player/opponent queues (global variabelen) - clear relevant queue
    if (target === player) {
        playerAttackQueue = [];
        playerPunching = false;
    }

    // zet idle animatie direct (veilig)
    if (target === player) target.anims.play('idle_anim', true);
    else target.anims.play('oppo_idle_anim', true);
}

// --- Update functie ---
function update(time, delta) {
    const speed = 100;
    const minDistance = 90;
    const distance = Phaser.Math.Distance.Between(player.x, player.y, opponent.x, opponent.y);

    let playerVelocity = 0;
    let opponentVelocity = opponentDirection * speed;

    // --- Speler beweging & animatie ---
    if (canStartAction(player)) {
        if (player.isBlocking) {
            // Blok animatie forceren
            if (player.anims.getName() !== player.blockAnim) {
                player.anims.play(player.blockAnim, true);
            }
        } else {
            // Beweging met minDistance check
            if (cursors.right.isDown && distance > minDistance) {
                playerVelocity = speed;
                player.anims.play('front_step_anim', true);
            } else if (cursors.left.isDown) {
                playerVelocity = -speed;
                player.anims.play('back_step_anim', true);
            } else {
                playerVelocity = 0;
                player.anims.play('idle_anim', true);
            }
        }

        player.body.setVelocityX(playerVelocity);
    } else {
        player.body.setVelocityX(0);
    }

            // --- Speler aanval combi's ---
        // Q + Down → jab to body
        if (Phaser.Input.Keyboard.JustDown(keyQ) && keyDown.isDown && canStartAction(player)) {
            console.log('Q + Down pressed → jab to body');
            queuePlayerAttack('jab_body');
        }

        // E + Down → cross to body
        if (Phaser.Input.Keyboard.JustDown(keyE) && keyDown.isDown && canStartAction(player)) {
            console.log('E + Down pressed → cross to body');
            queuePlayerAttack('cross_body');
        }

        // --- Speler blocking (W voor hoog, S voor laag ingedrukt houden) ---
        if (!player.attackLock) {

            // Hoog block
            if (keyW.isDown && !player.isBlocking) {
                player.isBlocking = true;
                player.blockAnim = 'player_block'; // standaard blok animatie voor hoog block
                player.isAnimating = true;
                player.body.setVelocityX(0);
                player.anims.play('player_enter_block', true);

                player.once('animationcomplete-player_enter_block', () => {
                    player.isAnimating = false;
                    if (player.isBlocking && player.anims.getName() !== player.blockAnim) {
                        player.anims.play(player.blockAnim, true);
                    }
                });

            // Laag block
            } else if (keyS.isDown && !player.isBlocking) {
                player.isBlocking = true;
                player.blockAnim = 'player_block_low'; // animatie voor laag block
                player.isAnimating = true;
                player.body.setVelocityX(0);
                player.anims.play('player_enter_block_low', true);

                player.once('animationcomplete-player_enter_block_low', () => {
                    player.isAnimating = false;
                    if (player.isBlocking && player.anims.getName() !== player.blockAnim) {
                        player.anims.play(player.blockAnim, true);
                    }
                });

            // Block loslaten
            } else if ((keyW.isUp && keyS.isUp) && player.isBlocking) {
                player.isBlocking = false;
                player.anims.play('idle_anim', true);
                player.body.setVelocityX(0);
            }
        }



    // --- Tegenstander beweging & animatie ---
    if (opponent.stunLock) {
        opponent.body.setVelocityX(0);
        return; // sla AI over als hij geraakt wordt
    }

    opponentMoveTimer += delta;
    if (opponentMoveTimer > 1000) {
        opponentDirection = Phaser.Math.Between(0, 1) === 0 ? -1 : 1;
        opponentMoveTimer = 0;
    }

    if (canStartAction(opponent)) {
        // Bereken opponentVelocity
        if (opponentDirection < 0) {
            // vooruit naar speler → alleen als afstand > minDistance
            opponentVelocity = (distance > minDistance) ? -speed : 0;
        } else if (opponentDirection > 0) {
            // achteruit (rechts) → altijd toegestaan
            opponentVelocity = speed;
        } else {
            opponentVelocity = 0;
        }

        opponent.body.setVelocityX(opponentVelocity);

        // Animaties
        if (!opponent.stunLock && !opponent.blockingLocked) {
            if (!opponent.isBlocking) {
                if (opponentVelocity === 0) {
                    opponent.anims.play('oppo_idle_anim', true);
                } else if (opponentVelocity < 0) {
                    opponent.anims.play('oppo_front_step_anim', true);
                } else if (opponentVelocity > 0) {
                    opponent.anims.play('oppo_back_step_anim', true);
                }
            }
        }
    } else {
        opponent.body.setVelocityX(0);
    }

    // --- AI Blocking ---
    const playerClose = Math.abs(player.x - opponent.x) < 200;
    const shouldTryBlock = !opponent.isBlocking && !opponent.blockingLocked;
    const now = Date.now();
    const timeSinceLastBlock = now - opponent.lastBlockTime;

    if (playerClose && shouldTryBlock && timeSinceLastBlock > opponent.blockCooldown) {
        if (Phaser.Math.Between(0, 100) < 50) {
            opponent.lastBlockTime = now;
            opponent.blockingLocked = true;
            opponent.isAnimating = true;

            opponent.anims.play('oppo_enter_block', true);

            opponent.scene.time.delayedCall(50, () => {
                opponent.once('animationcomplete-oppo_enter_block', () => {
                    opponent.anims.play('oppo_block', true);
                    opponent.blockingLocked = false;
                    opponent.isBlocking = true;

                    opponent.scene.time.addEvent({
                        delay: 3000, // 3s minimale block duration
                        callback: () => {
                            if (opponent.isBlocking && Phaser.Math.Between(0, 100) < 30) {
                                opponent.isBlocking = false;
                                opponent.anims.play('oppo_idle_anim', true);
                            }
                        }
                    });

                    opponent.isAnimating = false;
                });
            });
        }
    } else if (opponent.isBlocking && !opponent.blockingLocked) {
        if (Phaser.Math.Between(0, 100) < 20) {
            opponent.isBlocking = false;
            opponent.anims.play('oppo_idle_anim', true);
        }
    }

    // --- AI punches ---
    opponentPunchTimer += delta;
    if (opponentPunchTimer > Phaser.Math.Between(2000, 4000)) {
        const punchType = Phaser.Math.Between(0, 1) === 0 ? 'left' : 'right';
        punchOpponent(punchType);
        opponentPunchTimer = 0;
    }
}


function forceExitBlock() {
    if (player.isBlocking) {
        console.log("FORCE EXIT BLOCK");
        player.isBlocking = false;
        player.isAnimating = false;   // heel belangrijk, anders blijft hij 'bezig'
        player.anims.play('idle_anim', true);
        player.body.setVelocityX(0);
    }
}

// --- Queue functies ---
// Altijd in de queue stoppen, en dan processor laten beslissen
function queuePlayerAttack(side) {
    // Altijd block exit forceren voordat we een punch doen
    forceExitBlock();

    playerAttackQueue.push(side);
    console.log("queuePlayerAttack CALLED:", side, JSON.stringify(playerAttackQueue));

    console.log("QUEUE CHECK:", {
  attackLock: player.attackLock,
  stunLock: player.stunLock,
  isAnimating: player.isAnimating
});

    if (!player.attackLock && !player.stunLock && !player.isAnimating) {
        processNextPlayerAttack();
    }
}

// Processor functies: pakken telkens de eerste uit de queue
function processNextPlayerAttack() {
    if (playerAttackQueue.length === 0) return;
    const side = playerAttackQueue.shift();
    punchPlayer(side);
}

    // --- Punch functies ---
    function punchPlayer(side) {
        console.log(`punchPlayer called: ${side}`, {
            isBlocking: player.isBlocking,
            isAnimating: player.isAnimating,
            attackLock: player.attackLock,
            stunLock: player.stunLock,
            queue: JSON.stringify(playerAttackQueue)
        });
        if (roundEnded) return; // ✅ Stop meteen als ronde al voorbij is
        if (player.attackLock || player.stunLock) return;

        player.attackLock = true;
        player.isAnimating = true;
        player.isAttackAnimating = true; // ✅ nieuw toegevoegd
        console.log(`punch START: ${side}`, {
            isBlocking: player.isBlocking,
            isAnimating: player.isAnimating,
            attackLock: player.attackLock
        });

        let anim, damage, hitAnim;

        if (!hitAnim) hitAnim = 'oppo_get_light_hit_anim';

            // --- normale head punches ---
            if (side === 'left') {
                anim = 'jab_anim';
                damage = 10;
                hitAnim = 'oppo_get_light_hit_anim';
            } else if (side === 'right') {
                anim = 'cross_anim';
                damage = 15;
                hitAnim = 'oppo_get_hard_hit_anim';
            }

            // --- body punches ---
            else if (side === 'jab_body') {
                anim = 'jab_body_anim';
                damage = 8;
                hitAnim = 'oppo_get_hit_body_anim';
            } else if (side === 'cross_body') {
                anim = 'cross_body_anim';
                damage = 8;
                hitAnim = 'oppo_get_hit_body_anim';
            }

        player.anims.play(anim, true);

        // --- HIT DETECTIE TOEGEVOEGD ---
        player.lastAttackTime = Date.now();
        const hitDelay = side === 'left' ? 140 : 200; // match met anim timing
        player.scene.time.delayedCall(hitDelay, () => {
            if (Math.abs(player.x - opponent.x) < 112) {
                attemptHit(opponent, damage, hitAnim, 'oppo_idle_anim');
            }
        });

        player.once(`animationcomplete-${anim}`, () => {
            player.attackLock = false;
            player.isAnimating = false;
            player.isAttackAnimating = false; // ✅ reset na anim
            console.log(`punch COMPLETE: ${side}`, {
                isBlocking: player.isBlocking,
                isAnimating: player.isAnimating,
                attackLock: player.attackLock
            });

            if (!player.isBlocking) player.anims.play('idle_anim', true);

                // --- KO CHECK TOEGEVOEGD ---
        if (!roundEnded) {
            if (player.health <= 0) {
                roundEnded = true;
                endRound('opponent'); // tegenstander wint
            } else if (opponent.health <= 0) {
                roundEnded = true;
                endRound('player'); // speler wint
            }
        }

            if (playerAttackQueue.length > 0) {
                processNextPlayerAttack();
            }
        });
    }

    function punchOpponent(side) {
        if (roundEnded) return; // ✅ Stop meteen als ronde al voorbij is
        if (opponent.attackLock || opponent.stunLock) return;

        opponent.attackLock = true;
        opponent.isAnimating = true;
        opponent.isAttackAnimating = true; // ✅ nieuw toegevoegd
        opponentPunching = true;

        const anim = side === 'left' ? 'oppo_jab_anim' : 'oppo_cross_anim';
        const damage = side === 'left' ? 10 : 15;
        const hitAnim = side === 'left' ? 'get_light_hit_anim' : 'get_hard_hit_anim';

        opponent.anims.play(anim, true);

        const hitDelay = side === 'left' ? 140 : 200;
        opponent.scene.time.delayedCall(hitDelay, () => {
            if (opponent.attackLock && Math.abs(opponent.x - player.x) < 112) {
                attemptHit(player, damage, hitAnim, 'idle_anim');
            }
        });

        opponent.once(`animationcomplete-${anim}`, () => {
            if (opponent.stunLock) {
                console.log('[punchOpponent] punch animationcomplete maar opponent.stunLock=true → skip reset');
                return;
            }

            opponent.attackLock = false;
            opponent.isAnimating = false;
            opponent.isAttackAnimating = false; // ✅ reset na anim
            opponentPunching = false;
            opponent.anims.play('oppo_idle_anim', true);
            console.log('punch COMPLETE (opponent):', side);

                        // --- KO CHECK TOEGEVOEGD ---
            if (!roundEnded) {
                if (player.health <= 0) {
                    roundEnded = true;
                    endRound('opponent'); // tegenstander wint
                } else if (opponent.health <= 0) {
                    roundEnded = true;
                    endRound('player'); // speler wint
                }
            }
        });
    }

function endRound(winner) {
    console.log(`[GameScene] Round ended, winner: ${winner}`);

    // ✅ voorkomt dubbele aanroep
    if (roundEnded) return;
    roundEnded = true;

    // Blokkeer acties van beide boksers
    player.attackLock = true;
    opponent.attackLock = true;

    // ✅ KO animatie afspelen
    if (winner === 'opponent') {
        player.anims.play('player_KO', true);
    } else {
        opponent.anims.play('oppo_KO', true);
    }

    // ✅ Eventueel een fade toevoegen voor smooth overgang
    const scene = player.scene;

    // ✅ Wacht even, dan start de EndScene
        scene.time.delayedCall(1200, () => {
            scene.scene.launch('EndScene', { winner }); // EndScene bovenop GameScene
            scene.scene.pause();                         // pauzeer de GameScene
        });
}

// --- Hit functie met hitLock ---
function attemptHit(target, damageAmount, hitAnim, idleAnim, callback) {
    if (roundEnded) return; // ✅ Stop meteen als ronde al voorbij is
    // --- Blocking logic ---
    if (target.isBlocking) {
        console.log(`[HIT BLOCKED] ${target === player ? "Player" : "Opponent"}`);

        if (target.blockImpactAnim) {
            target.anims.play(target.blockImpactAnim, true);
            target.once(`animationcomplete-${target.blockImpactAnim}`, () => {
                if (target.isBlocking) {
                    target.anims.play(target.blockAnim, true);
                }
            });
        } else {
            if (target.anims.getName() !== target.blockAnim) {
                target.anims.play(target.blockAnim, true);
            }
        }

        target.attackLock = false;
        target.isAnimating = false;
        target.stunLock = false;

        if (callback) callback();
        return false;
    }

    // --- Niet geblokt → echte hit ---
    interruptAction(target);

    if (target === player) {
        playerAttackQueue = [];
    }

    if (typeof target.health !== 'number') target.health = 100;
    target.health -= damageAmount;
    if (target.health < 0) target.health = 0;

    //console.log(`[HIT] ${target === player ? "Player" : "Opponent"} geraakt: -${damageAmount} → health = ${target.health}`);


    updateHealthBars();

    // --- Nieuw: onthoud tijdstip van aanval ---
    if (target === player) {
        player.lastAttackTime = Date.now();
    }

    target.stunLock = true;
    target.isAnimating = true;
    //console.log(`[ANIM START] ${target === player ? "Player" : "Opponent"} speelt ${hitAnim}, stunLock = true`);

    target.anims.play(hitAnim, true);

    target.once(`animationcomplete-${hitAnim}`, () => {
        //console.log(`[ANIM COMPLETE] ${target === player ? "Player" : "Opponent"} klaar met ${hitAnim}`);
        target.stunLock = false;
        target.isAnimating = false;

        if (target.health > 0 && idleAnim) {
            //console.log(`[ANIM -> IDLE] ${target === player ? "Player" : "Opponent"} terug naar ${idleAnim}`);
            target.anims.play(idleAnim, true);
        }

        if (callback) callback();
    });

    if (target.health === 0) {
        endRound(target === player ? 'opponent' : 'player');
    }

    return true;
}

function updateHealthBars() {
    // === PLAYER ===
    playerHealthBar.clear();

    playerSilhouette.setVisible(true).setTint(0x000000);

    const pW = playerSilhouette.displayWidth;
    const pH = playerSilhouette.displayHeight;
    const pPercent = Phaser.Math.Clamp(player.health / 250, 0, 1);
    const pFillH = pH * pPercent;
    const pFillY = playerSilhouette.y - pFillH; // van onder naar boven vullen

    playerHealthBar.fillStyle(0x00ff00, 1);
    playerHealthBar.fillRect(
        playerSilhouette.x,
        pFillY,
        pW,
        pFillH
    );

    // === OPPONENT ===
    opponentHealthBar.clear();

    opponentSilhouette.setVisible(true).setTint(0x000000);

    const oW = opponentSilhouette.displayWidth;
    const oH = opponentSilhouette.displayHeight;
    const oPercent = Phaser.Math.Clamp(opponent.health / 250, 0, 1);
    const oFillH = oH * oPercent;
    const oFillY = opponentSilhouette.y - oFillH;

    opponentHealthBar.fillStyle(0x00ff00, 1);
    opponentHealthBar.fillRect(
        opponentSilhouette.x - oW,
        oFillY,
        oW,
        oFillH
    );
}


