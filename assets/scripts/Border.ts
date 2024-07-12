import { _decorator, Component, Node, Size, UITransform, v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Border')
export class Border extends Component {
    start() {
        let parent = this.node.parent;
        let parentTransform = parent.getComponent(UITransform);
        this.node.getChildByName("sprite").getComponent(UITransform).setContentSize(parentTransform.contentSize);
        this.node.getComponent(UITransform).setContentSize(new Size(parentTransform.contentSize.x-1, parentTransform.contentSize.y-1));
        this.node.getComponent(UITransform).setAnchorPoint(parentTransform.anchorPoint)
        this.node.getChildByName("sprite").getComponent(UITransform).setAnchorPoint(parentTransform.anchorPoint)
    }
}


