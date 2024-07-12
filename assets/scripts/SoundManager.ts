import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SoundManager')
export class SoundManager extends Component {
    static instance: SoundManager = null

    @property(AudioSource)
    audioSource: AudioSource = null
    @property(AudioClip) click: AudioClip = null
    @property(AudioClip) slide: AudioClip = null
    @property(AudioClip) wrong: AudioClip = null


    @property(Array(AudioClip)) pianoSound: Array<AudioClip> = Array<AudioClip>();


    onLoad() {
        SoundManager.instance = this
    }

    StopAudio() {
        this.audioSource.stop()
    }

    PlayClick() {
        this.audioSource.loop = false
        this.audioSource.clip = this.click
        this.audioSource.play()
    }

    PlaySlide() {
        this.audioSource.loop = false
        this.audioSource.clip = this.slide
        this.audioSource.play()
    }

    PlayWrong() {
        this.audioSource.loop = false
        this.audioSource.clip = this.wrong
        this.audioSource.play()
    }
}

