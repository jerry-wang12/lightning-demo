# Usage

```javascript
import { LightningElement, api } from 'lwc';
import mix from 'lightning/mixinBuilder';

const IphoneX = (superclass) => class extends superclass { 
    getCurrentLocation() {
        return '50 Fremont San Francisco, CA 94105';
    }
};

const Logger = (superclass) => class extends superclass {  
    log(...args) {
        console.log(...args);
    }
};

class Person {  
    whereAreYou() {
        return 'Iam in San Francisco.';
    }
}

class SuperPerson extends mix(Person).with(IphoneX, Logger) {  
    whereAreYou() {
        log(super.whereAreYour());
        log(`Exactly at ${this.getCurrentLocation}`);
    }
}

new SuperPerson().whereAreYou();  
```

it's going to print 
```
Iam in San Fracisco
Exactly at: 50 Fremont San Francisco, CA 94105
```

