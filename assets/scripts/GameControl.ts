import { _decorator, geometry, Camera, CCInteger, Component, EventTouch, isValid, log, MeshRenderer, Node, SkeletalAnimation, SkinnedMeshRenderer, SpriteRenderer, sys, Tween, tween, UITransform, v2, v3, Vec2, Vec3, view, GeometryRenderer, instantiate, math, SphereLight, SphereLightComponent, Color, Animation, director, game, Canvas, Size, Layout, Sprite, ColorKey, UIOpacity, Label, macro, ResolutionPolicy, Prefab } from 'cc';
import { SoundManager } from './SoundManager';
import { DevSDK } from './DevSDK';
import Utils from './Utils';
const { ccclass, property } = _decorator;

@ccclass('GameControl')
export class GameControl extends Component {
  static instance: GameControl;


  @property(Node) canvas: Node = null
  @property(Node) dummyImage: Node = null
  @property(Node) hint: Node = null
  @property(Node) final: Node = null
  @property(Node) button: Node = null
  @property(Node) container: Node = null
  @property(Prefab) border: Prefab = null


  gameDone: boolean = false;
  row: number = 3;
  colum: number = 3;
  dumped:boolean = false;
  pointer: Node = null;
  arrayDummy: Array<Array<Node>> = [];
  originArrUuid: Array<Array<string>> = [];

  isBusy:boolean = false;

  onLoad() {
    GameControl.instance = this;
    DevSDK.gameReady()
    this.dumpImage();
  }

  dumpImage(){
    if(this.dumped) return;
    this.dumped = true;
    let parentNode = this.dummyImage.parent;
    let originSize = this.dummyImage.getChildByName("sprite").getComponent(UITransform).contentSize;
    //divine
    for (let i = 0; i < this.row; i++) {
      this.arrayDummy.push([])
      for (let j = 0; j < this.colum; j++) {
        let dummy = instantiate(this.dummyImage);
        let calX = (i+1-(this.row/2));
        let calY = (j+1-(this.colum/2));
        let dummyTransform = dummy.getComponent(UITransform);
        dummyTransform.setContentSize(new Size(originSize.width/ this.row, originSize.height/this.colum))
        dummyTransform.setAnchorPoint(v2(calX, calY))
        parentNode.addChild(dummy);
        let newBorder = instantiate(this.border);
        dummy.addChild(newBorder);
        this.arrayDummy[i].push(dummy)
      }
    }
    //selectP
    this.pointer = this.arrayDummy[0][0];
    this.pointer.getComponent(UIOpacity).opacity = 0;
    parentNode.getComponent(UITransform).setContentSize(originSize);
    parentNode.removeChild(this.dummyImage);
    this.originArrUuid = this.arrayDummy.map(x=>x.map(y=>y.uuid))
    this.scheduleOnce(()=>{
      this.mixImage(20);
    }, 0.3)
  }

  moveImage(event: EventTouch){
    if(event.currentTarget == this.pointer || this.isBusy || this.gameDone) {
      return;
    };
    this.isBusy = true;
    let duration = .3;
    let target = event.currentTarget;
    let indexX=0;
    let indexY=0;
    let pointerIndexX=0;
    let pointerIndexY=0;
    for (let i = 0; i < this.arrayDummy.length; i++) {
      for (let j = 0; j < this.arrayDummy[0].length; j++) {
        if(target.uuid == this.arrayDummy[i][j].uuid){
          indexX = i;
          indexY = j;
        }
        if(this.pointer.uuid  == this.arrayDummy[i][j].uuid){
          pointerIndexX = i;
          pointerIndexY = j;
        }
      }
    }
    let rangeX = this.pointer.getComponent(UITransform).contentSize.width;
    let rangeY = this.pointer.getComponent(UITransform).contentSize.height;
    let pointerPos = this.pointer.getPosition();
    let targetPos = target.getPosition();
    let moved = false;
    if(indexX==pointerIndexX && indexY==pointerIndexY+1){
      tween(this.pointer).to(duration, {position: v3(pointerPos.x, pointerPos.y-rangeY)}).start();
      tween(target).to(duration, {position: v3(targetPos.x, targetPos.y+rangeY)}).start();
      moved=true;
    }
    else if(indexX==pointerIndexX && indexY==pointerIndexY-1){
      tween(this.pointer).to(duration, {position: v3(pointerPos.x, pointerPos.y+rangeY)}).start();
      tween(target).to(duration, {position: v3(targetPos.x, targetPos.y-rangeY)}).start();
      moved=true;
    }
    else if(indexX==pointerIndexX+1 && indexY==pointerIndexY){
      tween(this.pointer).to(duration, {position: v3(pointerPos.x-rangeX, pointerPos.y)}).start();
      tween(target).to(duration, {position: v3(targetPos.x+rangeX, targetPos.y)}).start();
      moved=true;
    }
    else if(indexX==pointerIndexX-1 && indexY==pointerIndexY){
      tween(this.pointer).to(duration, {position: v3(pointerPos.x+rangeX, pointerPos.y)}).start();
      tween(target).to(duration, {position: v3(targetPos.x-rangeX, targetPos.y)}).start();
      moved=true;
    }
    if(moved == true){
      let temp = this.arrayDummy[indexX][indexY];
      this.arrayDummy[indexX][indexY] = this.arrayDummy[pointerIndexX][pointerIndexY];
      this.arrayDummy[pointerIndexX][pointerIndexY] = temp;
      SoundManager.instance.PlaySlide();
    }else{
      SoundManager.instance.PlayWrong();
    }
    this.scheduleOnce(()=>{
      this.gameDone = true;
      for (let i = 0; i < this.arrayDummy.length; i++) {
        for (let j = 0; j < this.arrayDummy[0].length; j++) {
          if(this.arrayDummy[i][j].uuid!=this.originArrUuid[i][j]){
            this.gameDone=false
          }
        }
      }
      this.isBusy = false;
      if(this.gameDone){
        this.endGame();
      }
    }, duration)
  }


  mixImage(step){
    let pointerIndexX=0;
    let pointerIndexY=0;
    let duration = .05;
    for (let i = 0; i < this.arrayDummy.length; i++) {
      for (let j = 0; j < this.arrayDummy[0].length; j++) {
        if(this.pointer  == this.arrayDummy[i][j]){
          pointerIndexX = i;
          pointerIndexY = j;
        }
      }
    }
    let rangeX = this.pointer.getComponent(UITransform).contentSize.width;
    let rangeY = this.pointer.getComponent(UITransform).contentSize.height;
    for (let i = 0; i < step; i++) {
      this.scheduleOnce(async ()=>{
        let randomIndex = await this.selectAnNumber();
        let pointerPos = this.pointer.getPosition();
        if(randomIndex==1){
          if(pointerIndexY>=this.arrayDummy[0].length-1) return;
          let target = this.arrayDummy[pointerIndexX][pointerIndexY+1];
          let targetPos = target.getPosition();
          tween(this.pointer).to(duration, {position: v3(pointerPos.x, pointerPos.y-rangeY)}).start();
          tween(target).to(duration, {position: v3(targetPos.x, targetPos.y+rangeY)}).start();
          let temp = this.arrayDummy[pointerIndexX][pointerIndexY+1];
          this.arrayDummy[pointerIndexX][pointerIndexY+1] = this.arrayDummy[pointerIndexX][pointerIndexY];
          this.arrayDummy[pointerIndexX][pointerIndexY] = temp;
          pointerIndexY++;
        }
        else if(randomIndex==3){
          if(pointerIndexY<=0) return;
          let target = this.arrayDummy[pointerIndexX][pointerIndexY-1];
          let targetPos = target.getPosition();
          tween(this.pointer).to(duration, {position: v3(pointerPos.x, pointerPos.y+rangeY)}).start();
          tween(target).to(duration, {position: v3(targetPos.x, targetPos.y-rangeY)}).start();
          let temp = this.arrayDummy[pointerIndexX][pointerIndexY-1];
          this.arrayDummy[pointerIndexX][pointerIndexY-1] = this.arrayDummy[pointerIndexX][pointerIndexY];
          this.arrayDummy[pointerIndexX][pointerIndexY] = temp;
          pointerIndexY--;
        }
        else if(randomIndex==2){
          if(pointerIndexX>=this.arrayDummy.length-1) return;
          let target = this.arrayDummy[pointerIndexX+1][pointerIndexY];
          let targetPos = target.getPosition();
          tween(this.pointer).to(duration, {position: v3(pointerPos.x-rangeX, pointerPos.y)}).start();
          tween(target).to(duration, {position: v3(targetPos.x+rangeX, targetPos.y)}).start();
          let temp = this.arrayDummy[pointerIndexX+1][pointerIndexY];
          this.arrayDummy[pointerIndexX+1][pointerIndexY] = this.arrayDummy[pointerIndexX][pointerIndexY];
          this.arrayDummy[pointerIndexX][pointerIndexY] = temp;
          pointerIndexX++;
        }
        else if(randomIndex==4){
          if(pointerIndexX<=0) return;
          let target = this.arrayDummy[pointerIndexX-1][pointerIndexY];
          let targetPos = target.getPosition();
          tween(this.pointer).to(duration, {position: v3(pointerPos.x+rangeX, pointerPos.y)}).start();
          tween(target).to(duration, {position: v3(targetPos.x-rangeX, targetPos.y)}).start();
          let temp = this.arrayDummy[pointerIndexX-1][pointerIndexY];
          this.arrayDummy[pointerIndexX-1][pointerIndexY] = this.arrayDummy[pointerIndexX][pointerIndexY];
          this.arrayDummy[pointerIndexX][pointerIndexY] = temp;
          pointerIndexX--;
        }
      }, (duration+0.01)*i)
    }

    this.scheduleOnce(()=>{
      let fakeNode = new Node();
      fakeNode.angle = 255;
      tween(fakeNode).to(0.5, {angle: 0}, {onUpdate:()=>{
        this.final.getComponent(UIOpacity).opacity = fakeNode.angle;
      }}).call(()=>{this.final.active=false; this.isBusy = false; fakeNode.destroy();}).start();
    }, step*0.061)
  }

  lastNumberSelected: number =0;
  async selectAnNumber(){
    let newNum = 0;
    newNum = Utils.random(1, 4);
    while(newNum==this.lastNumberSelected+2||newNum==this.lastNumberSelected-2){
      newNum = Utils.random(1, 4);
    }
    this.lastNumberSelected = newNum;
    return newNum;
  }


  showHint(){
    if(this.isBusy) return;
    this.isBusy = true;
    let fakeNode = new Node();
    fakeNode.angle = 0;
    this.hint.getComponent(UIOpacity).opacity = 0;
    this.hint.active = true;
    tween(fakeNode).to(0.5, {angle: 255}, {onUpdate:()=>{
      this.hint.getComponent(UIOpacity).opacity = fakeNode.angle;
    }}).call(()=>{
      tween(fakeNode).delay(0.3).to(.5, {angle: 0}, {onUpdate:()=>{
        this.hint.getComponent(UIOpacity).opacity = fakeNode.angle;
      }}).call(()=>{
        this.hint.active = false;
        this.isBusy = false;
        fakeNode.destroy();
      }).start();
    }).start();
  }

  endGame(){
    DevSDK.gameEnd();
    this.button.getChildByName("lb").getComponent(Label).string = "Download";
    this.button.getComponent(Sprite).color = Color.YELLOW;
    let fakeNode = new Node();
    fakeNode.angle = 0;
    this.final.active = true;
    tween(fakeNode).to(0.5, {angle: 255}, {onUpdate:()=>{
      this.final.getComponent(UIOpacity).opacity = fakeNode.angle;
    }}).call(()=>{fakeNode.destroy();}).start();
  }

  onClickButton(){
    SoundManager.instance.PlayClick();
    if(!this.gameDone){
      this.showHint();
    }else{
      this.onClickTryItNow()
    }
  }

  onClickTryItNow() {
    DevSDK.openStore();
  }
}

