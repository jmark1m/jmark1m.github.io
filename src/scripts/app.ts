// app.ts

import * as PIXI from 'pixi.js'
import { FpsMeter } from './fps-meter';
import sound from 'pixi-sound';

interface EngineParams {
    containerId: string,
    canvasW: number,
    canvasH: number,
    fpsMax: number
}

class Engine {
    public container: HTMLElement;
    public loader: PIXI.Loader;
    public renderer: PIXI.Renderer;
    public stage: PIXI.Container;
    public graphics: PIXI.Graphics;
    public fpsMax: number;

    constructor(params: EngineParams) {
        this.loader = PIXI.Loader.shared;
        this.renderer = PIXI.autoDetectRenderer({
            width: params.canvasW,
            height: params.canvasH,
            antialias: true
        });
        this.stage = new PIXI.Container();
        this.graphics = new PIXI.Graphics();
        this.fpsMax = params.fpsMax;
        this.container = params.containerId ? document.getElementById(params.containerId) || document.body : document.body;
        this.container.appendChild(this.renderer.view);
    } // constructor
} // Engine

const engine = new Engine({
    containerId: 'game',
    canvasW: window.innerWidth,
    canvasH: window.innerHeight,
    fpsMax: 60
});

let fpsMeter: FpsMeter;
const coinslot = PIXI.Sprite.from('images/coinslot.png');
let coinImages = ["images/coin1.png","images/coin2.png","images/coin3.png","images/coin4.png","images/coin5.png","images/coin6.png"];
let textureArray: PIXI.Texture[] = [];
let animatedCoin : PIXI.AnimatedSprite;
let titleText : PIXI.Text;
let mainText : PIXI.Text;
let creditText : PIXI.Text;
let gameState : number;
let credits : number;
let comments : string[] = [
    "Drag The Coin To The Slot!!",
    "Stuck At Home? Keep Going!", 
    "You still need more Credits!",
    "This game is expensive to play!",
    "Coronavirus got you down?",
    "The Local Arcade is closed?",
    "Arcades aren't essential?!",
    "You've come to the right spot!",
    "This is Arcade Memories.",
    "A Place to Remember All The Fun.",
    "Keep pumping in the coins.",
    "Should we play Skeeball\u00ae?",
    "Big Hundo Pocket!",
    "Gutter ball?",
    "Whack that mole.",
    "Two Whackers at the same time!",
    "Glow Minigolf is next, definately.",
    "Hole In One, Free Game!",
    "Salad bar is all you can eat.",
    "Winning tickets is easy.",
    "You've got this!",
    "The big bonus is 1000 tickets.",
    "I know you can win that big bonus.",
    "Keep Going.",
    "If you lose, mercy tickets for you.",
    "Winning isn't everything.",
    "Level Up!",
    "You won the JACKPOT!",
    "Time to cash in on the gummy candy.",
    "Climbing wall is easier for kids.",
    "Your still here?",
    "Pizza is here.",
    "Are you part of the lock-in?",
    "It's raining outside, no go-karts",
    "One Word, Claw Game.",
    "Okay, That was two words.",
    "Game of Skill, Or Game Of Chance?",
    "Depends of the menu settings!",
    "Big Squishy Balls!",
    "Lets Play Big Bass Wheel!",
    "Win The Big Bass Bonus!",
    "It's a game of skill.",
    "Greatest Game Of All Time.",
    "No really, Greatest Game Of All Time.",
    "Don't stop now, you can win it again.",
    "Card Swipes aren't the same.",
    "Laser Tag?!",
    "Red Vest, Blue Vest, Ready, Aim, Go.",
    "Tokens are best.",
    "Let's play QuickDrop",
    "Hurry, Before the Time Runs Out.",
    "JACKPOT!  That's two!",
    "How about a game of DDR?",
    "Basketball challenge?",
    "Maybe That Connect 4 Basketball Game!",
    "Virtual Reality.  Not ready yet.",
    "Boss FIGHT!",
    "Ticket Horde!",
    "You Won A Big Eraser!",
    "Wait in line at the prize counter.",
    "Can't decide on a prize?",
    "Pick the bike.",
    "Or the mystery box?",
    "Save them for next time?",
    "What's your favorite game?",
    "Arcade Closed!",
    "So who's memories are these?",
    "Just some designer who worked on games.",
    "For almost 15 years!",
    "15 years of my life!!",
    "It was fun while it lasted.",
    "But CoronaVirus takes its toll",
    "And now the world has changed.",
    "Thanks to my co-workers.",
    "I'll miss all of the constructive arguing!",
    "But in the end the games were better for it.",
    "The games I worked on follow.",
    "Ticket Troopers",
    "American Idol Superstar",
    "Hummer Space Adventure",
    "Hummer Off Roadin'",
    "Swish, Little Basketball",
    "Jam Session",
    "Crank It and Crank It Revolution",
    "Road Trip",
    "Beerball",
    "Sink It",
    "Full Tilt",
    "Pull My Finger(Purple Monkey Game)",
    "Nascar Showdown",
    "Big Bass Wheel",
    "Pig Out",
    "Artic Chomp",
    "Grid Iron Blitz",
    "Quik Drop",
    "Pop The Lock",
    "Grand Piano Keys",
    "Ticket Monster",
    "Perfection",
    "Prize Hub (not even a game!!)",
    "Scooby Doo Wheel",
    "Skeeball\u00ae (Fusion and Modern Editions)",
    "Connect 4 Basketball",
    "Hypernova",
    "And I'm not even going to list the prototypes!",
    "So many prototypes thrown in the trash.",
    "But Loved every minute off it.",
    "Love you all!",
    "Thanks Bay Tek!",
    "Goodbye arcade.",
    "Wait, let's come up with some new ideas?",
    "I hear trampolines are back in fashion!",
    "Maybe a light up bouncy trampoline!",
    "Dudes, we are so back in business!",
    "Hmmm, I'm just getting carried away now.",
    "Thanks for the memories!",
    "I'm going to go work for a bank maybe.",
    "See you around the town...",
    "Permanently Closed!",
    "Game Over",
    "Game Over",
    "Game Over",
    "No Really, Game Over.",
    "Stop Pumping in Credits Now.",
    "Game Over"
];


// ==============
// === STATES ===
// ==============

window.onload = load;

function load() {
    create();
} // load

function create() {
    /* ***************************** */
    /* Create your Game Objects here */
    /* ***************************** */
    gameState = 0;
    credits = 0;

    engine.loader.add('musical', 'audio/coin_up.wav').load(function() {
        // playButton.on('click', function() {
        //     sound.play('musical', { loop: true });
        //     playButton.visible = false;
        //     stopButton.visible = true;
        //     app.render();
        // });
    
        // stopButton.on('click', function() {
        //     sound.stop('musical');
        //     playButton.visible = true;
        //     stopButton.visible = false;
        //     app.render();
        // });
    });
    
    coinslot.anchor.set(0.5);
    coinslot.x = engine.renderer.width/2 + engine.renderer.width / 4;
    coinslot.y = engine.renderer.height / 2;
    coinslot.width = engine.renderer.width/8;
    coinslot.height = engine.renderer.width/8*(1.2);
    engine.stage.addChild(coinslot);

    titleText = new PIXI.Text("Arcade Memories", {
        fontSize: 50,
        fontFamily: 'Arial',
        fill: "#ffffff",
        align: "center",
        stroke: "#aaaaaa",
        strokeThickness: 0
    });
    recenterText(titleText);
    titleText.y = engine.renderer.height/28;
    engine.stage.addChild(titleText);
    createCommentText();

    creditText = new PIXI.Text("Credits 0", {
        fontSize: 50,
        fontFamily: 'Arial',
        fill: "#ffffff",
        align: "center",
        stroke: "#aaaaaa",
        strokeThickness: 0
    });
    recenterText(creditText);
    creditText.y = engine.renderer.height - engine.renderer.height/6;
    engine.stage.addChild(creditText);

    for (let i=0; i < 6; i++)
    {
         let texture = PIXI.Texture.from(coinImages[i]);
         textureArray.push(texture);
    };
    animatedCoin = new PIXI.AnimatedSprite(textureArray);
    animatedCoin.animationSpeed = 0.15;
    animatedCoin.anchor.set(0.5, 0.5);
    resetCoin();
    animatedCoin.interactive = true;
    animatedCoin.buttonMode = true;

        // setup events
    animatedCoin
        // events for drag start
        .on('mousedown', onDragStart)
        .on('touchstart', onDragStart)
        // events for drag end
        .on('mouseup', onDragEnd)
        .on('mouseupoutside', onDragEnd)
        .on('touchend', onDragEnd)
        .on('touchendoutside', onDragEnd)
        // events for drag move
        .on('mousemove', onDragMove)
        .on('touchmove', onDragMove);

    
    
    animatedCoin.width = engine.renderer.width/8;
    animatedCoin.height = engine.renderer.width/8;
    animatedCoin.onLoop = function() {
        animatedCoin.width = engine.renderer.width/8;
        animatedCoin.height = engine.renderer.width/8;
    };
    engine.stage.addChild(animatedCoin);
    animatedCoin.play();
    
    /* FPS */
    const fpsMeterItem = document.createElement('div');
    fpsMeterItem.classList.add('fps');
    engine.container.appendChild(fpsMeterItem);

    fpsMeter = new FpsMeter(() => {
        //fpsMeterItem.innerHTML = 'FPS: ' + fpsMeter.getFrameRate().toFixed(2).toString();
    });

    setInterval(update, 1000.0 / engine.fpsMax);
    render();
} // create

function update() {
    fpsMeter.updateTime();

    /* ***************************** */
    /* Update your Game Objects here */
    /* ***************************** */

} // update

function render() {
    requestAnimationFrame(render);

    /* ***************************** */
    /* Render your Game Objects here */
    /* ***************************** */

    engine.renderer.render(engine.stage);
    fpsMeter.tick();
} // render

function onDragStart(event)
{
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.8;
    this.dragging = true;
}

function onDragEnd()
{
    this.alpha = 1;

    this.dragging = false;

    // set the interaction data to null
    this.data = null;

    if( boxesIntersect( animatedCoin, coinslot ) )
    {
        gameState = gameState + 1;
        credits = credits + 1;
        mainText.scale.set(1);
        if( credits < comments.length )
            mainText.text = comments[credits];
        else
            mainText.text = comments[comments.length-1];
        recenterText(mainText);

        //newState(gameState);
        resetCoin();
        creditText.text = "Credits " + credits.toString();
        sound.play('musical', { loop: false });
    }
}

function resetCoin()
{
    animatedCoin.x = engine.renderer.width / 4;
    animatedCoin.y = engine.renderer.height / 2;
}

function createCommentText()
{
    engine.stage.removeChild(mainText);
    mainText = new PIXI.Text(comments[credits], {
        fontSize: 50,
        fontFamily: 'Arial',
        fill: "#ffffff",
        align: "center",
        stroke: "#aaaaaa",
        strokeThickness: 0
    });
    recenterText(mainText);
    mainText.y = engine.renderer.height/6;
    engine.stage.addChild(mainText);
}

function recenterText(someText : PIXI.Text)
{
    let scalefac : number = 1;
    //console.log(" " + someText.width +  engine.renderer.width);
    while( someText.width >= engine.renderer.width-50 )
    {
        //someText.width = engine.renderer.width-50;
        someText.scale.x = scalefac;
        scalefac = scalefac - 0.05;
    }
    someText.x = engine.renderer.width/2 - someText.width/2;
}

function onDragMove()
{
    if (this.dragging)
    {
        var newPosition = this.data.getLocalPosition(this.parent);
        this.position.x = newPosition.x;
        this.position.y = newPosition.y;
    }
}

function boxesIntersect(a, b)
{
  var ab = a.getBounds();
  var bb = b.getBounds();
  return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
}
