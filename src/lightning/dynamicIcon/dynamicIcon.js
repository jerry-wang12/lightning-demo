import { LightningElement, api } from 'lwc';
import { classSet } from 'lightning/utils';
import { normalizeString as normalize } from 'lightning/utilsPrivate';
import eqHtml from './eq.html';
import ellieHtml from './ellie.html';
import scoreHtml from './score.html';
import strengthHtml from './strength.html';
import trendHtml from './trend.html';
import waffleHtml from './waffle.html';
import defaultHtml from './default.html';

/**
 * Represents various animated icons with different states.
 */
export default class LightningDynamicIcon extends LightningElement {
    /**
     * The alternative text used to describe the dynamic icon.
     * This text should describe what's happening.
     * For example, 'Graph is refreshing', not what the icon looks like, 'Graph'.
     * @type {string}
     */
    @api alternativeText;

    /**
     * The Lightning Design System name of the dynamic icon.
     * Valid values are: ellie, eq, score, strength, trend, and waffle.
     * @type {string}
     * @required
     */
    @api type;

    /**
     * The option attribute changes the appearance of the dynamic icon.
     * The options available depend on the type.
     * eq: play (default) or stop
     * score: positive (default) or negative
     * strength: -3, -2, -1, 0 (default), 1, 2, 3
     * trend: neutral (default), up, or down
     * @type {string}
     */
    @api option;

    // Return html based on the specified icon type
    render() {
        const { normalizedType } = this;
        switch (normalizedType) {
            case 'ellie':
                return ellieHtml;
            case 'eq':
                return eqHtml;
            case 'score':
                return scoreHtml;
            case 'strength':
                return strengthHtml;
            case 'trend':
                return trendHtml;
            case 'waffle':
                return waffleHtml;
            default:
                return defaultHtml;
        }
    }

    get normalizedType() {
        return normalize(this.type, {
            fallbackValue: '',
            validValues: [
                'ellie',
                'eq',
                'score',
                'strength',
                'trend',
                'waffle',
            ],
        });
    }

    get normalizedOption() {
        const { normalizedType } = this;
        switch (normalizedType) {
            case 'eq':
                return normalize(this.option, {
                    fallbackValue: 'play',
                    validValues: ['play', 'stop'],
                });
            case 'score':
                return normalize(this.option, {
                    fallbackValue: 'positive',
                    validValues: ['positive', 'negative'],
                });
            case 'strength':
                return normalize(this.option, {
                    fallbackValue: '0',
                    validValues: ['-3', '-2', '-1', '0', '1', '2', '3'],
                });
            case 'trend':
                return normalize(this.option, {
                    fallbackValue: 'neutral',
                    validValues: ['up', 'down', 'neutral'],
                });
            default:
                return '';
        }
    }

    // Only the EQ icon needs its class computed
    get computedEqClass() {
        const { normalizedOption } = this;
        const classes = classSet('slds-icon-eq');

        if (normalizedOption === 'play') {
            classes.add('slds-is-animated');
        }

        return classes.toString();
    }
}
