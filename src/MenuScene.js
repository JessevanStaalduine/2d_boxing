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


export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }


            async create() {
                // wacht tot het font geladen is
                try {
                await document.fonts.ready;
                } catch (e) {
                // fallback: als browsers iets raar doen, ga toch door
                console.warn('Fonts.ready failed:', e);
                }



                const shareTech = new FontFaceObserver('Share Tech');
                try {
                await shareTech.load(null, 5000); // timeout 5 sec
                // fonts loaded -> start MenuScene of teken tekst
                } catch (e) {
                console.warn('font load failed or timed out', e);
                // fallback: start toch
                }


            this.add.rectangle(400, 300, 800, 600, 0x020202).setDepth(DEPTH.BACKGROUND);


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
                            let bump = 0; // geen speler punches in menu
                            let phaseShift = rope.depth === DEPTH.ROPE_BACK ? 0.8 : 0;
                            let offset = (rope.isSide ? 1 : 2) * Math.sin(time + t * Math.PI + phaseShift) * weight + bump;
                            return new Phaser.Geom.Point(p.x, p.y + offset);
                        });

                        for (let j = 0; j < newPoints.length - 1; j++) {
                            let t = j / segments;
                            let color;
                            if (rope.colorSide === 'red' && t < 0.5) color = 0x990000;
                            else if (rope.colorSide === 'blue' && t >= 0.5) color = 0x003399;
                            else color = 0x686868;

                            rope.lineStyle(4, color);
                            rope.beginPath();
                            rope.moveTo(newPoints[j].x, newPoints[j].y);
                            rope.lineTo(newPoints[j + 1].x, newPoints[j + 1].y);
                            rope.strokePath();

                            rope.lineStyle(1, 0x000000, 0.65);
                            rope.beginPath();
                            rope.moveTo(newPoints[j].x, newPoints[j].y);
                            rope.lineTo(newPoints[j + 1].x, newPoints[j + 1].y);
                            rope.strokePath();
                        }
                    });
                }
            });


        this.add.text(400, 50, 'RING OF MAYHEM', {
            fontFamily: '"Share Tech", sans-serif',
            fontSize: '64px',
            color: '#c20000ff',
            stroke: '#000',
            strokeThickness: 6
        }).setOrigin(0.5);

        const startBtn = this.add.text(400, 150, 'START', {
            fontFamily: '"Share Tech", sans-serif',
            fontSize: '42px',
            color: '#020202',
            backgroundColor: '#c20000ff',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        startBtn.on('pointerover', () => startBtn.setStyle({ backgroundColor: '#0050a0ff' }));
        startBtn.on('pointerout', () => startBtn.setStyle({ backgroundColor: '#c20000ff' }));

        startBtn.on('pointerdown', () => {
            console.log('Start Game');

            // Fade-out effect van de huidige scene
            this.cameras.main.fadeOut(600, 0, 0, 0); // 600ms, zwart

            // Zodra de fade klaar is, start je de GameScene
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('GameScene');
            });
        });

        const controlsBtn = this.add.text(400, 230, 'CONTROLS', {
            fontFamily: '"Share Tech", sans-serif',
            fontSize: '42px',
            color: '#020202',
            backgroundColor: '#c20000ff',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

                controlsBtn.on('pointerover', () => controlsBtn.setStyle({ backgroundColor: '#0050a0ff' }));
                controlsBtn.on('pointerout', () => controlsBtn.setStyle({ backgroundColor: '#c20000ff' }));

                controlsBtn.on('pointerdown', () => this.scene.start('ControlsScene', { fromScene: 'MenuScene' }));


        const settingsBtn = this.add.text(400, 310, 'SETTINGS', {
            fontFamily: '"Share Tech", sans-serif',
            fontSize: '42px',
            color: '#020202',
            backgroundColor: '#c20000ff',
            padding: { x: 20, y: 10 }
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

                settingsBtn.on('pointerover', () => settingsBtn.setStyle({ backgroundColor: '#0050a0ff' }));
                settingsBtn.on('pointerout', () => settingsBtn.setStyle({ backgroundColor: '#c20000ff' }));

                settingsBtn.on('pointerdown', () => {
                    this.scene.start('SettingsScene', { from: 'MenuScene' });
                });
    }
}

export class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseScene' });
    }

    create() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // Donkere semi-transparante overlay
        this.add.rectangle(centerX, centerY, 800, 600, 0x000000, 0.6);

        // Titel
        this.add.text(centerX, 50, 'PAUSED', {
            fontFamily: '"Share Tech", sans-serif',
            fontSize: '64px',
            color: '#c20000ff',
            stroke: '#000000',
            strokeThickness: 6,
        }).setOrigin(0.5);

        // Resume knop
        const resumeBtn = this.add.text(centerX, centerY - 150, 'Resume', {
            fontFamily: '"Share Tech", sans-serif',
            fontSize: '48px',
            color: '#ffffff',
            backgroundColor: '#0077ff',
            padding: { x: 20, y: 10 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        const controlsBtn = this.add.text(centerX, centerY - 60, 'Controls', {
            fontFamily: '"Share Tech", sans-serif',
            fontSize: '48px',
            color: '#ffffff',
            backgroundColor: '#0077ff',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        const settingsBtn = this.add.text(centerX, centerY + 30, 'Settings', {
            fontFamily: '"Share Tech", sans-serif',
            fontSize: '48px',
            color: '#ffffff',
            backgroundColor: '#0077ff',
            padding: { x: 20, y: 10 }
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });        

        // Quit knop
        const quitBtn = this.add.text(centerX, centerY + 120, 'Quit', {
            fontFamily: '"Share Tech", sans-serif',
            fontSize: '48px',
            color: '#ffffff',
            backgroundColor: '#ff4444',
            padding: { x: 20, y: 10 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    // Hover effect voor alle buttons
        [resumeBtn, controlsBtn, settingsBtn, quitBtn].forEach(btn => {
            btn.on('pointerover', () => {
                if (btn === quitBtn) {
                    btn.setStyle({ backgroundColor: '#bc0000ff' }); // Quit hover
                } else {
                    btn.setStyle({ backgroundColor: '#004ea8ff' }); // Alle andere hover
                }
            });

            btn.on('pointerout', () => {
                if (btn === quitBtn) {
                    btn.setStyle({ backgroundColor: '#ff4444' }); // Quit normaal
                } else {
                    btn.setStyle({ backgroundColor: '#0077ff' }); // Andere normaal
                }
            });
        });

        // Klikacties
        resumeBtn.on('pointerdown', () => {
            this.scene.stop();               // sluit PauseScene
            this.scene.resume('GameScene');  // ga verder in de game
        });

        quitBtn.on('pointerdown', () => {
            this.scene.stop('GameScene');  // stop de game volledig
            this.scene.stop();              // stop PauseScene
            this.scene.start('MenuScene');  // ga naar het hoofdmenu
        });

        controlsBtn.on('pointerdown', () => {
            this.scene.pause(); // pauzeer het pauzemenu zelf
            this.scene.launch('ControlsScene', { fromScene: 'PauseScene' });
        });

        settingsBtn.on('pointerdown', () => {
            this.scene.launch('SettingsScene', { from: 'PauseScene' });
            this.scene.sleep(); // verberg het pauzemenu tijdelijk
        });
    }
}

export class ControlsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ControlsScene' });
    }

    create(data) {

        this.add.rectangle(400, 300, 800, 600, 0x020202).setOrigin(0.5);

        const { fromScene = 'MenuScene' } = data; // zodat we weten waar we vandaan komen

        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        this.add.rectangle(centerX, centerY, 800, 600, 0x000000, 0.6);
        this.add.text(centerX, 50, 'CONTROLS', {
            fontFamily: '"Share Tech", sans-serif',
            fontSize: '64px',
            color: '#ffffff',
            stroke: '#000',
            strokeThickness: 6
        }).setOrigin(0.5);

        this.add.text(centerX, 250, '←  = Move Left\n →  = Move Right\n W  = Block High\n S  = Block Low\n Q  = Left Punch\n E  = Right Punch\n A  = Left Body Punch\n D  = Right Body Punch\n SPACE = Cancel Combo\n P  = Pause', {
            fontFamily: '"Share Tech", sans-serif',
            fontSize: '28px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        // Back knop
        const backBtn = this.add.text(centerX, 500, 'BACK', {
            fontFamily: '"Share Tech", sans-serif',
            fontSize: '42px',
            color: '#ffffff',
            backgroundColor: '#0077ff',
            padding: { x: 30, y: 15 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        backBtn.on('pointerover', () => backBtn.setStyle({ backgroundColor: '#004ea8ff' }));
        backBtn.on('pointerout', () => backBtn.setStyle({ backgroundColor: '#0077ff' }));
        backBtn.on('pointerdown', () => {
            if (fromScene === 'PauseScene') {
                // Sluit alleen het controls-scherm en hervat het pauzemenu
                this.scene.stop(); // sluit ControlsScene
                this.scene.resume('PauseScene'); // hervat het pauze-menu
            } else {
                // Vanuit MenuScene gewoon terug naar menu
                this.scene.start('MenuScene');
            }
        });
    }
}

export class SettingsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SettingsScene' });
    }

    create(data) {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // 🩶 Donkere achtergrond
        this.add.rectangle(centerX, centerY, 800, 600, 0x000000, 0.8);

        // 🎵 Titel
        this.add.text(centerX, 100, 'SETTINGS', {
            fontFamily: '"Share Tech", sans-serif',
            fontSize: '64px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
        }).setOrigin(0.5);

        // 🎚️ Master Volume label
        this.add.text(centerX - 300, centerY - 100, 'Master Volume', {
            fontFamily: '"Share Tech", sans-serif',
            fontSize: '32px',
            color: '#ffffff',
        }).setOrigin(0, 0.5);

        // Slider lijn
        const sliderX = centerX + 100;
        const sliderY = centerY - 100;
        const sliderWidth = 250;

        const sliderLine = this.add.rectangle(sliderX, sliderY, sliderWidth, 6, 0xffffff).setOrigin(0.5);

        // Slider "knop"
        const sliderHandle = this.add.circle(sliderX + sliderWidth / 2, sliderY, 10, 0xffcc00).setInteractive({ draggable: true });

        // Volume percentage
        const volumeText = this.add.text(sliderX + sliderWidth / 2 + 50, sliderY, '100%', {
            fontFamily: '"Share Tech", sans-serif',
            fontSize: '24px',
            color: '#ffffff',
        }).setOrigin(0.5);

        // Volume waarde (tussen 0–1)
        let volume = 1.0;

        // Draggable gedrag
        this.input.setDraggable(sliderHandle);

        this.input.on('drag', (pointer, gameObject, dragX) => {
            if (gameObject === sliderHandle) {
                // Beperk de X-positie tot de sliderlijn
                dragX = Phaser.Math.Clamp(dragX, sliderX - sliderWidth / 2, sliderX + sliderWidth / 2);
                gameObject.x = dragX;

                // Bereken nieuw volume
                volume = Phaser.Math.RoundTo((dragX - (sliderX - sliderWidth / 2)) / sliderWidth, -2);
                volumeText.setText(`${Math.round(volume * 100)}%`);

                // (later als je geluid hebt)
                // this.sound.volume = volume;
            }
        });

        // 🎵 Music toggle
        const musicToggle = this.add.text(centerX, centerY, 'Music: ON', {
            fontFamily: '"Share Tech", sans-serif',
            fontSize: '36px',
            color: '#ffffff',
            backgroundColor: '#0077ff',
            padding: { x: 20, y: 10 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        let musicOn = true;
        musicToggle.on('pointerdown', () => {
            musicOn = !musicOn;
            musicToggle.setText(`Music: ${musicOn ? 'ON' : 'OFF'}`);
        });
        musicToggle.on('pointerover', () => musicToggle.setStyle({ backgroundColor: '#0055cc' }));
        musicToggle.on('pointerout', () => musicToggle.setStyle({ backgroundColor: '#0077ff' }));

        // 🔊 SFX toggle
        const sfxToggle = this.add.text(centerX, centerY + 80, 'SFX: ON', {
            fontFamily: '"Share Tech", sans-serif',
            fontSize: '36px',
            color: '#ffffff',
            backgroundColor: '#0077ff',
            padding: { x: 20, y: 10 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        let sfxOn = true;
        sfxToggle.on('pointerdown', () => {
            sfxOn = !sfxOn;
            sfxToggle.setText(`SFX: ${sfxOn ? 'ON' : 'OFF'}`);
        });
        sfxToggle.on('pointerover', () => sfxToggle.setStyle({ backgroundColor: '#0055cc' }));
        sfxToggle.on('pointerout', () => sfxToggle.setStyle({ backgroundColor: '#0077ff' }));

        // 🔙 Back-knop
        const backBtn = this.add.text(centerX, centerY + 200, 'BACK', {
            fontFamily: '"Share Tech", sans-serif',
            fontSize: '42px',
            color: '#ffffff',
            backgroundColor: '#c20000ff',
            padding: { x: 30, y: 15 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        backBtn.on('pointerover', () => backBtn.setStyle({ backgroundColor: '#ff3333' }));
        backBtn.on('pointerout', () => backBtn.setStyle({ backgroundColor: '#c20000ff' }));

        // 👇 Terug naar juiste menu
        backBtn.on('pointerdown', () => {
            if (data.from === 'PauseScene') {
                this.scene.stop();
                this.scene.wake('PauseScene'); // laat pauzemenu weer zien
            } else {
                this.scene.start('MenuScene'); // terug naar hoofdmenu
            }
        });
    }
}

export class EndScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EndScene' });
    }

    init(data) {
        // Ontvang data van de GameScene (zoals de winnaar)
        this.winner = data?.winner || 'opponent'; // fallback voor veiligheid
    }

    create() {
        const { centerX, centerY } = this.cameras.main;

        const message = this.winner === 'opponent' ? 'K.O. You Lose!' : 'K.O. You Win!';
        const color = this.winner === 'opponent' ? '#ff4444' : '#00ff88';

        // Donkere overlay voor “fade” effect
            this.add.rectangle(centerX, centerY, 1280, 720, 0x000000, 0.6); 

        // KO Tekst
        this.add.text(centerX, centerY - 100, message, {
            fontFamily: '"Share Tech", sans-serif',
            fontSize: '64px',
            color: color,
            stroke: '#000',
            strokeThickness: 8,
        }).setOrigin(0.5);

        // Rematch knop
        const rematchBtn = this.add.text(centerX, centerY + 30, 'Rematch', {
            fontFamily: '"Share Tech", sans-serif',
            fontSize: '48px',
            color: '#fff',
            backgroundColor: '#004ea8ff',
            padding: { x: 30, y: 15 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        // Quit knop
        const quitBtn = this.add.text(centerX, centerY + 130, 'Quit', {
            fontFamily: '"Share Tech", sans-serif',
            fontSize: '48px',
            color: '#fff',
            backgroundColor: '#bc0000ff',
            padding: { x: 30, y: 15 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        // Hover effecten
        [rematchBtn, quitBtn].forEach(btn => {
            btn.on('pointerover', () => btn.setStyle({ backgroundColor: btn === rematchBtn ? '#00326cff' : '#6b0000ff' }));
            btn.on('pointerout', () =>
                btn.setStyle({
                    backgroundColor: btn === rematchBtn ? '#004ea8ff' : '#bc0000ff',
                })
            );
        });

        // Klikacties
        rematchBtn.on('pointerdown', () => {
            console.log('[EndScene] Rematch clicked');
            this.scene.stop('EndScene');
            this.scene.stop('GameScene'); // stop de oude volledig
            this.scene.start('GameScene'); // start nieuw
        });

        quitBtn.on('pointerdown', () => {
            console.log('[EndScene] Quit clicked');
            this.scene.stop('GameScene');
            this.scene.stop('EndScene');
            this.scene.start('MenuScene'); // ✅ terug naar hoofdmenu
        });
    }
}