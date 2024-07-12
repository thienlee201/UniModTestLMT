import { Color, Component, Vec2, _decorator, color, v2 } from "cc";

const { ccclass, property } = _decorator;

export default class Utils extends Component {

    public static BACKGROUND_WHITE_COLOR: string = 'ebfaff';

    public static worldSpaceToLocal(worldSpace: Vec2, local: Node) {

    }

    public static getRandomRainbowColor(): Color {
        var primaryColor = this.random(0, 2)
        var secondaryColor = this.random(0, 2)
        var colorAsArray = [0, 0, 0]
        colorAsArray[secondaryColor] = this.random(0, 255)
        colorAsArray[primaryColor] = 255

        return color(colorAsArray[0], colorAsArray[1], colorAsArray[2])
    }

    public static getOneOrMinusOne() {
        return (this.random(0, 1) == 1) ? 1 : -1;
    }

    public static Vec2ToAngle(vec2: Vec2): number {
        return Math.atan2(vec2.y, vec2.x) * 180 / Math.PI
    }

    public static angleToVec2Normal(angle: number): Vec2 {
        return v2(Math.cos(angle / (180 / Math.PI)), Math.sin(angle / (180 / Math.PI)))
    }

    public static random(minInclusive: number, maxInclusive: number): number {
        return Math.floor(Math.random() * (maxInclusive - minInclusive + 1)) + minInclusive;
    }

    public static booleanRandom(trueChance: number = 1, totalChance: number = 1): boolean {
        if (this.random(0, totalChance) <= trueChance) return true
        else return false
    }

    // cc.tween(this.soundButton)
    //         .to(0.05, { position: cc.v3(this.soundButton.position.x, this.soundButton.position.y - 7) })
    //         .to(0.05, { position: cc.v3(this.soundButton.position) }).start();
}