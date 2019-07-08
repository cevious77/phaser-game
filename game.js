let game;

// global game options
let gameOptions = {

    // platform speed range, in pixels per second
    platformSpeedRange: [240, 240],

    // mountain speed, in pixels per second
    mountainSpeed: 80,

    // spawn range, how far should be the rightmost platform from the right edge
    // before next platform spawns, in pixels
    spawnRange: [150, 170],

    // platform width range, in pixels
    platformSizeRange: [470, 600],

    // a height range between rightmost platform and next platform to be spawned
    platformHeightRange: [-5, 5],

    // a scale to be multiplied by platformHeightRange
    platformHeighScale: 20,

    // platform max and min height, as screen height ratio
    platformVerticalLimit: [0.4, 0.8],

    // player gravity
    playerGravity: 900,

    // player jump force
    jumpForce: 500,

    // player starting X position
    playerStartPosition: 150,

    // consecutive jumps allowed
    jumps: 1800,

    // % of probability a coin appears on the platform
    coinPercent: 75,

    // % of probability a fire appears on the platform
    firePercent: 75,

   

    
    

}

window.onload = function() {

    // object containing configuration options
    let gameConfig = {
        type: Phaser.AUTO,
        width: 1334,
        height: 750,
        scene: [preloadGame, playGame],
        backgroundColor: 0x0B74300,

        // physics settings
        physics: {
            default: "arcade"
        }
    }

    // laserbullets;
 
    // speed;

    // cursors;
    // lastFired = 0;
    game = new Phaser.Game(gameConfig);
    window.focus();
    resize();
    window.addEventListener("resize", resize, false);
    
}

var direction = 'right';
var boutonFeu;
var cursors;

// preloadGame scene
class preloadGame extends Phaser.Scene{
    constructor(){
        super("PreloadGame");
    }
    preload(){
        this.load.image("platform", "platform.png");

        // player is a sprite sheet made by 24x48 pixels
        this.load.spritesheet("player", "player.png", {
            
            frameWidth: 68,
            frameHeight: 72
        });

        // the coin is a sprite sheet made by 20x20 pixels
        this.load.spritesheet("coin", "coin.png", {
            frameWidth: 30,
            frameHeight: 32
        });

        // the firecamp is a sprite sheet made by 32x58 pixels
        this.load.spritesheet("fire", "fire.png", {
            frameWidth: 40,
            frameHeight: 70
        });

        // mountains are a sprite sheet made by 512x512 pixels
        this.load.spritesheet("mountain", "mountain.png", {
            frameWidth: 1024,
            frameHeight: 1024
        });

        this.load.audio("playSound", "jumpArcade.flac");

        this.load.spritesheet("bullet", "laser-bullet.png", {
            frameWidth: 15,
            frameHeight: 15
        })
    }
    create(){

     



        // Bullet = new Phaser.Class({

        //     Extends: Phaser.GameObjects.spritesheet,
    
        //     initialize:
    
        //     function Bullet (scene)
        //     {
        //         Phaser.GameObjects.Image.call(this, scene, 0, 0, 'laserbullet');
    
        //         this.speed = Phaser.Math.GetSpeed(400, 1);
        //     },
    
        //     letfire: function (x, y)
        //     {
        //         this.setPosition(x, y - 50);
    
        //         this.setActive(true);
        //         this.setVisible(true);
        //     },
    
        //     update: function (time, delta)
        //     {
        //         this.y -= this.speed * delta;
    
        //         if (this.y < -50)
        //         {
        //             this.setActive(false);
        //             this.setVisible(false);
        //         }
        //     }
    
        // });
    
       








        // setting player animation
        this.anims.create({
            key: "run",
            frames: this.anims.generateFrameNumbers("player", {
                start: 5,
                end: 8
            }),
            frameRate: 13,
            repeat: -12
        });

        this.anims.create({
            key: "shoot",
            frames: this.anims.generateFrameNumbers("player", {
                start: 1,
                end: 1
            }),
        });

        // setting coin animation
        this.anims.create({
            key: "rotate",
            frames: this.anims.generateFrameNumbers("coin", {
                start: 0,
                end: 4
            }),
            frameRate: 7,
            yoyo: true,
            repeat: -18
        });

        // setting fire animation
        this.anims.create({
            key: "burn",
            frames: this.anims.generateFrameNumbers("fire", {
                start: 0,
                end: 4
            }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create ({
            key: "pewpew",
            frames: this.anims.generateFrameNumbers("bullet", {
                start: 0,
                end: 1
            }),
            frameRate: 10,
            repeat: -12


        });

        this.scene.start("PlayGame");
    }
}

// playGame scene
class playGame extends Phaser.Scene{
    constructor(){
        super("PlayGame");
    }
      
 
   

    create(){

       





        // group with all active mountains.
        this.mountainGroup = this.add.group();

        // group with all active platforms.
        this.platformGroup = this.add.group({

            // once a platform is removed, it's added to the pool
            removeCallback: function(platform){
                platform.scene.platformPool.add(platform)
            }
        });

        // platform pool
        this.platformPool = this.add.group({

            // once a platform is removed from the pool, it's added to the active platforms group
            removeCallback: function(platform){
                platform.scene.platformGroup.add(platform)
            }
        });

        this.laserBulletGroup = this.add.group ({
            removeCallback: function(laserbullet){
                laserbullet.scene.laserBulletPool.add(laserbullet)
            }
        });

        this.laserBulletPool = this.add.group({
            removeCallback: function(laserbullet){
                laserbullet.scene.laserBulletGroup.add(laserbullet)
            }

        });

        // group with all active coins.
        this.coinGroup = this.add.group({

            // once a coin is removed, it's added to the pool
            removeCallback: function(coin){
                coin.scene.coinPool.add(coin)
            }
        });

        // coin pool
        this.coinPool = this.add.group({

            // once a coin is removed from the pool, it's added to the active coins group
            removeCallback: function(coin){
                coin.scene.coinGroup.add(coin)
            }
        });

        // group with all active firecamps.
        this.fireGroup = this.add.group({

            // once a firecamp is removed, it's added to the pool
            removeCallback: function(fire){
                fire.scene.firePool.add(fire)
            }
        });

        // fire pool
        this.firePool = this.add.group({

            // once a fire is removed from the pool, it's added to the active fire group
            removeCallback: function(fire){
                fire.scene.fireGroup.add(fire)
            }
        });

        // this.laserbullets = this.add.group({
        //     classType: Bullet,
        //     maxSize: 10,
        //     runChildUpdate: true
        // });

        // adding a mountain
        this.addMountains()

        // keeping track of added platforms
        this.addedPlatforms = 0;

        // number of consecutive jumps made by the player so far
        this.playerJumps = 0;

        // adding a platform to the game, the arguments are platform width, x position and y position
        this.addPlatform(game.config.width, game.config.width / 2, game.config.height * gameOptions.platformVerticalLimit[1]);

        // adding the player;
        this.player = this.physics.add.sprite(gameOptions.playerStartPosition, game.config.height * 0.7, "player");
        this.player.setGravityY(gameOptions.playerGravity);
        this.player.setDepth(2);

        // the player is not dying
        this.dying = false;

        // setting collisions between the player and the platform group
        this.platformCollider = this.physics.add.collider(this.player, this.platformGroup, function(){

            // play "run" animation if the player is on a platform
            if(!this.player.anims.isPlaying){
                this.player.anims.play("run");
            } 
                
            
                
            
        }, null, this);

        // setting collisions between the player and the coin group
        this.physics.add.overlap(this.player, this.coinGroup, function(player, coin){


            this.dying = true;
            this.player.anims.stop();
            this.player.setFrame(2);
            this.player.body.setVelocityY(-200);
            this.physics.world.removeCollider(this.platformCollider);
            
        }, null, this);

        //     this.tweens.add({
        //         targets: coin,
        //         y: coin.y - 100,
        //         alpha: 0,
        //         duration: 800,
        //         ease: "Cubic.easeOut",
        //         callbackScope: this,
        //         onComplete: function(){
        //             this.coinGroup.killAndHide(coin);
        //             this.coinGroup.remove(coin);
        //         }
        //     });

        // }, null, this);

        // setting collisions between the player and the fire group
        this.physics.add.overlap(this.player, this.fireGroup, function(player, fire){

            this.dying = true;
            this.player.anims.stop();
            this.player.setFrame(2);
            this.player.body.setVelocityY(-200);
            this.physics.world.removeCollider(this.platformCollider);

        }, null, this);

        // checking for input
        this.input.keyboard.createCursorKeys();
        this.input.on("pointerup", this.tirer, this);
        this.input.on("pointerdown", this.jump, this);
        
        // this.input.keyboard.up.isDown.laserbullet();
    }

    // adding mountains
    addMountains(){
        let rightmostMountain = this.getRightmostMountain();
        if(rightmostMountain < game.config.width * 5){
            let mountain = this.physics.add.sprite(rightmostMountain + Phaser.Math.Between(500, 500), game.config.height + Phaser.Math.Between(100, 100), "mountain");
            mountain.setOrigin(0.5, 1);
            mountain.body.setVelocityX(gameOptions.mountainSpeed * -1)
            this.mountainGroup.add(mountain);
            if(Phaser.Math.Between(0, 1)){
                mountain.setDepth(0.5);
            }
            mountain.setFrame(Phaser.Math.Between(0))
            this.addMountains()
        }
    }

    // getting rightmost mountain x position
    getRightmostMountain(){
        let rightmostMountain = -200;
        this.mountainGroup.getChildren().forEach(function(mountain){
            rightmostMountain = Math.max(rightmostMountain, mountain.x);
        })
        return rightmostMountain;
    }

    // the core of the script: platform are added from the pool or created on the fly
    addPlatform(platformWidth, posX, posY){
        this.addedPlatforms ++;
        let platform;
        if(this.platformPool.getLength()){
            platform = this.platformPool.getFirst();
            platform.x = posX;
            platform.y = posY;
            platform.active = true;
            platform.visible = true;
            this.platformPool.remove(platform);
            let newRatio =  platformWidth / platform.displayWidth;
            platform.displayWidth = platformWidth;
            platform.tileScaleX = 1 / platform.scaleX;
        }
        else{
            platform = this.add.tileSprite(posX, posY, platformWidth, 32, "platform");
            this.physics.add.existing(platform);
            platform.body.setImmovable(true);
            platform.body.setVelocityX(Phaser.Math.Between(gameOptions.platformSpeedRange[0], gameOptions.platformSpeedRange[1]) * -1);
            platform.setDepth(2);
            this.platformGroup.add(platform);
        }
        this.nextPlatformDistance = Phaser.Math.Between(gameOptions.spawnRange[0], gameOptions.spawnRange[1]);

        // if this is not the starting platform...
        if(this.addedPlatforms > 1){

            // is there a coin over the platform?
            if(Phaser.Math.Between(1, 100) <= gameOptions.coinPercent){
                if(this.coinPool.getLength()){
                    let coin = this.coinPool.getFirst();
                    coin.x = posX;
                    coin.y = posY - 150;
                    coin.alpha = 1;
                    coin.active = true;
                    coin.visible = true;
                    this.coinPool.remove(coin);
                }
                else{
                    let coin = this.physics.add.sprite(posX, posY - 150, "coin");
                    coin.setImmovable(true);
                    coin.setVelocityX(platform.body.velocity.x);
                    coin.anims.play("rotate");
                    coin.setDepth(2);
                    this.coinGroup.add(coin);
                }
            }

            // is there a fire over the platform?
            if(Phaser.Math.Between(1, 100) <= gameOptions.firePercent){
                if(this.firePool.getLength()){
                    let fire = this.firePool.getFirst();
                    fire.x = posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth);
                    fire.y = posY - 46;
                    fire.alpha = 1;
                    fire.active = true;
                    fire.visible = true;
                    this.firePool.remove(fire);
                }
                else{
                    let fire = this.physics.add.sprite(posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth), posY - 46, "fire");
                    fire.setImmovable(true);
                    fire.setVelocityX(platform.body.velocity.x);
                    fire.setSize(8, 2, true)
                    fire.anims.play("burn");
                    fire.setDepth(2);
                    this.fireGroup.add(fire);
                }
            }
        }
    }

    
    
    // the player jumps when on the ground, or once in the air as long as there are jumps left and the first jump was on the ground
    // and obviously if the player is not dying
    jump(){
        if((!this.dying) && (this.player.body.touching.down || (this.playerJumps > 0 && this.playerJumps < gameOptions.jumps))){
            if(this.player.body.touching.down){
                this.playerJumps = 0;
            }
            this.player.setVelocityY(gameOptions.jumpForce * -1);
            this.playerJumps ++;

            // stops animation
            this.player.anims.play("shoot");
        }
    }

    tirer(){   // alert ( "PEW PEW PEW")
   
// on crée la balle a coté du joueur
this.bullet = this.laserBulletGroup.create(this.player.x  + 35 , this.player.y   , 'bullet');
// parametres physiques de la balle.
// this.bullet.setCollideWorldBounds(true);
this.bullet.gravity = false;
// platform.body.setVelocityX(Phaser.Math.Between(gameOptions.platformSpeedRange[0], gameOptions.platformSpeedRange[1]) * -1);
this.bullet=(this.bullet.x + 1000) // vitesse en x et en y 
// this.bullet.create(this.player.x ++ , this.player.y ++) ;

}



    update(){

        if ( Phaser.Input.Keyboard.isDown(tirer)) {
            tirer(this.player);
     }


       
     
        }
    

  
   





    update(){


       

        

        





        // game over
        if(this.player.y > game.config.height){ alert("My Name Is BILLY !!!")
            this.scene.start("PlayGame");
        }

        this.player.x = gameOptions.playerStartPosition;

        // recycling platforms
        let minDistance = game.config.width;
        let rightmostPlatformHeight = 0;
        this.platformGroup.getChildren().forEach(function(platform){
            let platformDistance = game.config.width - platform.x - platform.displayWidth / 2;
            if(platformDistance < minDistance){
                minDistance = platformDistance;
                rightmostPlatformHeight = platform.y;
            }
            if(platform.x < - platform.displayWidth / 2){
                this.platformGroup.killAndHide(platform);
                this.platformGroup.remove(platform);
            }
        }, this);

        // recycling coins
        this.coinGroup.getChildren().forEach(function(coin){
            if(coin.x < - coin.displayWidth / 2){
                this.coinGroup.killAndHide(coin);
                this.coinGroup.remove(coin);
            }
        }, this);

        // recycling fire
        this.fireGroup.getChildren().forEach(function(fire){
            if(fire.x < - fire.displayWidth / 2){
                this.fireGroup.killAndHide(fire);
                this.fireGroup.remove(fire);
            }
        }, this);

        // recycling mountains
        this.mountainGroup.getChildren().forEach(function(mountain){
            if(mountain.x < - mountain.displayWidth){
                let rightmostMountain = this.getRightmostMountain();
                mountain.x = rightmostMountain + Phaser.Math.Between(100, 350);
                mountain.y = game.config.height + Phaser.Math.Between(0, 100);
                mountain.setFrame(Phaser.Math.Between(0, 3))
                if(Phaser.Math.Between(0, 1)){
                    mountain.setDepth(1);
                }
            }
        }, this);

        

        // adding new platforms
        if(minDistance > this.nextPlatformDistance){
            let nextPlatformWidth = Phaser.Math.Between(gameOptions.platformSizeRange[0], gameOptions.platformSizeRange[1]);
            let platformRandomHeight = gameOptions.platformHeighScale * Phaser.Math.Between(gameOptions.platformHeightRange[0], gameOptions.platformHeightRange[1]);
            let nextPlatformGap = rightmostPlatformHeight + platformRandomHeight;
            let minPlatformHeight = game.config.height * gameOptions.platformVerticalLimit[0];
            let maxPlatformHeight = game.config.height * gameOptions.platformVerticalLimit[1];
            let nextPlatformHeight = Phaser.Math.Clamp(nextPlatformGap, minPlatformHeight, maxPlatformHeight);
            this.addPlatform(nextPlatformWidth, game.config.width + nextPlatformWidth / 2, nextPlatformHeight);
        };




        // if (cursors.left.isDown) {
        //     player.direction = 'left';
        //     player.setVelocityX(-160);
        //     player.anims.play('left', true);
        // }
        // else if (cursors.right.isDown) {
        //     player.direction = 'right';
        //     player.setVelocityX(160);
        //     player.anims.play('right', true);
        // };


    //     if (cursors.up.isDown && time > lastFired)
    // {
    //     var laserbullet = laserbullets.get();

    //     if (laserbullet)
    //     {
    //         laserbullet.fire(player.x, player.y);

    //         lastFired = time + 50;
    //     }
    // };




    }
};
function resize(){
    let canvas = document.querySelector("canvas");
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let windowRatio = windowWidth / windowHeight;
    let gameRatio = game.config.width / game.config.height;
    if(windowRatio < gameRatio){
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else{
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}
