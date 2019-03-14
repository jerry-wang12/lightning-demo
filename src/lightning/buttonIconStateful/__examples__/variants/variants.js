import { LightningElement, track } from 'lwc';

export default class ButtonIconStatefulVariants extends LightningElement {
    @track likeStateInverse = false;
    @track answerStateInverse = false;
    @track likeStateFilled = false;
    @track answerStateFilled = false;

    handleLikeButtonInverseClick() {
        this.likeStateInverse = !this.likeStateInverse;
    }

    handleAnswerButtonInverseClick() {
        this.answerStateInverse = !this.answerStateInverse;
    }

    handleLikeButtonFilledClick() {
        this.likeStateFilled = !this.likeStateFilled;
    }

    handleAnswerButtonFilledClick() {
        this.answerStateFilled = !this.answerStateFilled;
    }
}
