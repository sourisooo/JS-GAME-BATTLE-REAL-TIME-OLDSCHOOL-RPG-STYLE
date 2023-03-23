
window.addEventListener('load',function() {

    const loading = this.document.getElementById('loading');
    loading.style.display='none';
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width= window.innerWidth;
    canvas.height =window.innerHeight;
  

    class InputHandler {

        constructor(game){

            this.game=game;
            this.keys = [];
         
       

            window.addEventListener('keydown', (e) =>
            
                {

                    if(
         
                    
                 (this.keys.indexOf(e.key) === -1) )
                    
                 
                 {this.keys.push(e.key);}
                        

                 if(this.game.player.combo.comboA.key.length>this.game.player.combo.actualCombo.length)
                     
                        
                {this.game.player.combo.actualCombo.push(e.key)}else{this.game.player.combo.actualCombo=0;this.game.player.combo.actualCombo=[]};

              

                });



            
            

                window.addEventListener('keyup', (e) =>
            
                {

                    if(this.keys.indexOf(e.key)>-1) 
                    
                    {

                        this.keys.splice(this.keys.indexOf(e.key),1);

                    }
                    
   

                });


        }



    }

    


    class UI {

        constructor(game){

            this.game=game;
            this.fontSize=40;
            this.fontFamiliy='Helvetica';
            this.color='blue';

        }


        draw(context){

            context.save();
            context.fillStyle=this.color;
            context.shadowOffsetX=2;
            context.shadowOffsetY=2;
            context.shadowColor='black';

            context.font=this.fontSize+'px '+this.fontFamiliy;
            context.fillText('Actually using: '+this.game.input.keys,20,40);
            context.fillText('Combo success: '+this.game.player.combo.success+" //Defense trigger: "+this.game.player.combo.def.trigger,25,150);
            context.fillText('Last combos successfully done: '+this.game.player.combo.combN.join(),25,190);

            context.fillText('Damage done '+(this.game.player.combo.combD)+' //Enemy damage blocked: '+this.game.enemy.damageblocked,25,230);
            context.fillText('Defense command: '+(this.game.player.combo.def.key),25,270);
            context.fillText('Combo command: '+(this.game.player.combo.comboA.key),25,310);
            context.fillText('Actual command Performed: '+(this.game.player.combo.actualCombo),25,350);

            context.fillText('Ennemy is preparing: '+this.game.enemy.attack.name,1200,800);
            context.fillText('Timer before execution: '+(this.game.enemy.time).toFixed(1)+" of "+this.game.enemy.attack.Cooldown/10,1200,850);
            context.fillText('Damage done by ennemy: '+this.game.enemy.damagedone,1200,900);
            

            if(this.game.player.powerUp)context.fillStyle='#ffffbd';

            context.fillStyle=this.color;
            for(let i=0;i<this.game.ammo;i++)
            {context.fillRect(20+5*i,50,3,20)}

            const formattedTime = (this.game.gameTime*0.001).toFixed(1);
            context.fillText('Timer before command update: '+""+(this.game.player.combo.time).toFixed(1)+" of "+this.game.player.combo.comboA.timecommand/10,20,100);

            if(this.game.gameOver)

            {

                context.textAlign='center';
                let message1;
                let message2;
                
              
                message1='Game Over';
                message2='Press R to restart the game'

                context.font='50px '+this.fontFamiliy;
                context.fillText(message1,window.innerWidth*0.5,window.innerHeight*0.5-40);
                context.font='25px '+this.fontFamiliy;
                context.fillText(message2,window.innerWidth*0.5,window.innerHeight*0.5+40);
                
                

            }


            context.restore();

        }



    }


    class Player{

        constructor(game){

            this.game=game;
            this.width=291;
            this.height=302;
            this.x=0;
            this.y=window.innerHeight/2;

            this.image=player;
            this.combo=new Combo(this);

        this.frameX=0;
        this.frameY=0;
        this.speed=1;
        this.maxSpeed=4;
        this.maxFrame=16;
        this.fps=30;
        this.frameTimer=1;
        this.frameInterval=1000/this.fps;
        
          

        }

        update(deltaTime){
            // this.x += this.speed;
            
            this.combo.update(deltaTime);



            

        }

        draw(context,deltaTime){



            if(this.frameTimer>this.frameInterval)

            {

                if(this.frameX<this.maxFrame)this.frameX++;
                else this.frameX=0;
                this.frameTimer=0;
            } else {this.frameTimer+=deltaTime;};

    
            context.drawImage(this.image,this.width*this.frameX,this.height*this.frameY,this.width,this.height, this.x,this.y,this.width,this.height);

            this.combo.draw(context,deltaTime);
                    


        }


       

    }



    class Enemy {


        constructor(game){
            
            this.frameX=0;
            this.frameY=0;
            this.fps =20;
            this.frameInterval =1000/this.fps;
            this.frameTimer=1;
     
            this.game=game;
          
            this.width=229;
            this.height=171;

            this.image=enemyrun;

            this.bite=bite;
            this.firaga=firaga;
            this.wildrush=wildrush;
            this.gethit=gethit;
            this.evade=evade;

            this.speedX=Math.random()+30;
            this.speedY=0;
            this.maxFrame=4;
            this.speed=1;

            this.x=this.game.width-300;
            this.y=this.game.height/2+50;

            this.enemyanimation=[];
            this.gethitanimation=[];
            this.shieldanimaation=[];

    
            this.attackA={Damage:75,Cooldown:2000,name:"bite",animation:new SkillAnimation(this.game,bite,1200,500,256,256,1,0,0,0,0)};
            this.attackB={Damage:150,Cooldown:4000,name:"firaga",animation:new SkillAnimation(this.game,firaga,1200,500,256,256,1,0,0,0,0)};
            this.attackC={Damage:300,Cooldown:6000,name:"wildrush",animation:new SkillAnimation(this.game,wildrush,1200,500,256,256,1,0,0,0,0)};

            this.attackrandomizer=[this.attackA,this.attackB,this.attackC];
            this.attack={};
            this.damagedone=0;
            this.time=0;
            this.timer=5000;
            this.key=0;
            this.damageblocked=0;
       

        }

        update(deltaTime){

            // this.x-=this.speed*5;


            if(this.time<this.timer/10){this.time+=0.8;
                // console.log(this.time);
            }



       else {

            this.key=Math.floor(Math.random()*3)

           this.attack=this.attackrandomizer[this.key];

           this.enemyanimation.push(new SkillAnimation(this.game,document.getElementById(this.key),1200,500,256,256,1,0,0,0,0));

           this.timer=this.attack.Cooldown;

           if((this.game.player.combo.def.trigger==false))
            
                    {
                        
                        this.damagedone+=this.attack.Damage;
                        this.gethitanimation.push(new SkillAnimation(this.game,this.gethit,0,window.innerHeight/2,308,296,1,0,0,0,10));
                        
                        this.shieldanimaation=0;
                        this.shieldanimaation=[];

                        game.player.combo.success=false;

            
                    
                    } else {
                        
                        this.shieldanimaation.push(new SkillAnimation(this.game,this.evade,400,500,256,256,1,0,0,0,0));
                        this.damageblocked=this.damageblocked+this.attack.Damage;
                    
                         }
       

            // console.log(this.attack,this.damagedone,this.timer);

            // console.log(this.enemyanimation,document.getElementById(this.key));

            this.time=0;

       }

        }


        draw(context,deltaTime){

            if(this.frameTimer>this.frameInterval)

            {

                if(this.frameX<this.maxFrame)this.frameX++;
                else this.frameX=0;
                this.frameTimer=0;
            } else {this.frameTimer+=deltaTime;};


            
            context.drawImage(this.image,this.frameX*this.width,this.height*this.frameY,this.width,this.height,this.x,this.y,this.width,this.height);


       

            this.enemyanimation.forEach(e=>
                

                {

                    e.draw(context,deltaTime);



                });

        

               
      
                this.gethitanimation.forEach(g=>
                

                    {
    
                        g.draw(context,deltaTime);
    
    
    
                    });

             
                    this.shieldanimaation.forEach(a=>
                

                        {
        
                            a.draw(context,deltaTime);
        
        
        
                        });
    

                        // console.log(this.gethitanimation);


        }



    }



    class Combo {

        constructor(game){

            this.game=game;
            this.width=404;
            this.height=309;

            this.speed=20;
            this.markedForDeletion=false;
            this.image=fireshot;
            this.image2=roll;
            this.image3=fire;
            this.cBimage=attack;
            this.cCimage=spell;
            this.cDimage=item;

            this.defense=[0,1,2,3,4,5,6,7,8,9]
            this.def = {key:[],name:"defense",trigger:false};
            this.comboA = {key:[],name:"",damage:0,index:0,timecommand:0};
            this.comboB = {key:["A","B","C","D"],name:"attack",damage:50,index:1,timecommand:3000,icon:attack};
            this.comboC = {key:["X","ArrowUp","W","M","ArrowRight"],name:"spell",damage:200,index:2,timecommand:4500,icon:spell};
            this.comboD = {key:["A","ArrowUp","ArrowDown","M","ArrowRight"],name:"item",damage:300,index:3,timecommand:5000,icon:item};
            this.actualCombo = [];
            this.success=false;
            this.combN=[];
            this.combD=0;
            this.timer=5000;
            this.comboRamdomize = [this.comboB,this.comboC,this.comboD ];
            this.interval=1;
            this.time=500;

            this.x=0;
            this.y=window.innerHeight/2;
            this.frameX=0;
            this.frameY=0;
            this.speed=1;
            this.maxSpeed=4;
            this.maxFrame=16;
            this.fps=30;
            this.frameTimer=1;
            this.frameInterval=1000/this.fps;
            this.projectiles=[];

            this.widthR=292;
            this.heightR=291;


        }

        update(deltaTime){


          

            if(this.time<this.timer/10){this.time+=0.8
                }



           else {


            this.def = {key:[this.defense[Math.floor(Math.random()*10)],this.defense[Math.floor(Math.random()*10)]],trigger:false}

            this.comboA=(this.comboRamdomize[Math.floor(Math.random()*3)]);

            this.timer=this.comboA.timecommand;

           

            // console.log(this.comboA.timecommand,game.gameTime,this.comboA.timecommand-game.gameTime,this.timer)    
            
            // console.log(this.time);
             this.time=0}


            if((this.comboA.key.join() == this.actualCombo.join())&&(this.comboA.key.join()!=""))
            
            {this.combN.push(this.comboA.name),this.combD=this.combD+this.comboA.damage,this.success=true;game.gameTime=0,this.actualCombo=0,this.actualCombo=[],this.time=this.timer/10,game.enemy.gethitanimation=0,game.enemy.gethitanimation=[]}

            else if(this.comboA.key.length==this.actualCombo.length){this.actualCombo=0;this.actualCombo=[];this.success=false};
            
            // if(this.comboA.timecommand>game.gameTime){this.success=false};
          

            if((this.def.key.join() == this.actualCombo.join())&&(this.def.key.join()!=""))
            
            {this.def.trigger=true;game.enemy.gethitanimation=0;game.enemy.gethitanimation=[]}

            // console.log(game.enemy.gethitanimation);


            if(this.success==true){

            if (this.projectiles.length<10)

            {
                
                
                
                this.frameX=0;
            
                {this.projectiles.push(new SkillAnimation(this.game,this.image3,200,610,209,54,20,10,0,0,14));};

                // console.log(this.x,this.y,this.projectiles);
            }

                // console.log(this.projectiles.length,this.game.input.shots.length);
            };

            this.projectiles.forEach(p=>

                {
                    if((p.x>window.innerWidth/2)||(game.player.combo.success==false)) (p.markedForDeletion=true)

                    // console.log(game.player.combo.success);

                });
            

                this.projectiles.forEach(p =>
                
                    {
                            game.checkCollision(p,game.enemy)
    
                    })



                this.projectiles=this.projectiles.filter(p => !p.markedForDeletion);


            this.projectiles.forEach(p=>

                {
                    p.update(deltaTime);

                });


                // console.log(this.projectiles);



        // };
          
            


        }

        draw(context,deltaTime){


        

            if(this.frameTimer>this.frameInterval)

            {
           
                if(this.frameX<this.maxFrame)this.frameX++;
                else this.frameX=0;
                this.frameTimer=0;
            } else {this.frameTimer+=deltaTime;};

    
            if((this.def.trigger==true)){

            context.drawImage(this.image2,this.widthR*this.frameX,this.heightR*this.frameY,this.widthR,this.heightR, this.x,this.y,this.widthR,this.heightR);
      
            } else if(this.success==true){

                context.drawImage(this.image,this.width*this.frameX,this.height*this.frameY,this.width,this.height, this.x,this.y,this.width,this.height);
          
                }


            this.projectiles.forEach(p=>

                {
                    p.draw(context);

                });

        }

    }


    class SkillAnimation {

        constructor(game,animation,x,y,width,height,speed,speedC,frameX,frameY,maxFrame){

                this.game=game;

                this.width=width;
                this.height=height;
    
                this.speed=speed;
                this.speedC=speedC;
                this.markedForDeletion=false;
        
                this.png=animation;
                this.timer=3000;
                this.interval=1;
                this.time=0;

                this.x=x;
                this.y=y;

                this.frameX=frameX;
                this.frameY=frameY;
                this.speed=1;
                this.maxSpeed=4;
                this.maxFrame=maxFrame;
                this.fps=30;
                this.frameTimer=1;
                this.frameInterval=1000/this.fps;
              

        }


  



        update(deltaTime){

            this.x+=this.speed*this.speedC;
            // console.log(this.x,this.speed);


        }


        draw(context,deltaTime){






        if(this.frameTimer>this.frameInterval)

            {

                if(this.frameX<this.maxFrame)this.frameX++;
                else this.frameX=0;
                this.frameTimer=0;
            } else {this.frameTimer+=deltaTime;};



            context.drawImage(this.png,this.width*this.frameX,this.height*this.frameY,this.width,this.height, this.x,this.y,this.width,this.height);


                
        }

    


    }




    class Game {

        constructor(width,height){

            this.width=width;
            this.height=height;
            this.player = new Player(this);
            this.input= new InputHandler(this);
            this.ui=new UI(this);
            this.keys=[];
            this.gameTime=0;
            this.speed=1;
            this.enemy= new Enemy(this);
       
        }

        update(deltaTime){

           this.gameTime+=deltaTime;

            this.player.update(deltaTime);
              
            this.enemy.update(deltaTime);
         
            };

               

        

        draw(context,deltaTime){

            this.gameTime+=deltaTime;

            this.ui.draw(context);
            this.player.draw(context,deltaTime);
            this.enemy.draw(context,deltaTime);

            // console.log(this.enemy);

        }


        checkCollision(p,e){

            if((p.x+200)>e.x)(p.markedForDeletion=true);
            // console.log(p.x,e.x,p.markedForDeletion);
        }



    }





const game = new Game(canvas.width,canvas.height);
let lastTime=0;

function animate(timeStamp){

    const deltaTime=timeStamp-lastTime;
    lastTime=timeStamp;

    ctx.clearRect(0,0,canvas.width,canvas.height);

    game.update(deltaTime);
    game.draw(ctx,deltaTime);

    

    requestAnimationFrame(animate);

}

animate(0);

})