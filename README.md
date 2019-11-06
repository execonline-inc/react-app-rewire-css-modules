# react-app-rewire-react-toolbox

Add [CSS Module](https://github.com/css-modules/css-modules) loaders to your [create-react-app](https://github.com/facebookincubator/create-react-app) via [react-app-rewired](https://github.com/timarney/react-app-rewired).

## Installation

This package is not yet published to the npm registry. Install from GitHub:

```
yarn add --dev KaplanTestPrep/react-app-rewire-css-modules react-app-rewired
```

### Example

In your `package.json`
```diff
  /* package.json */

  "scripts": {
-   "start": "react-scripts start",
+   "start": "react-app-rewired start",
-   "build": "react-scripts build",
+   "build": "react-app-rewired build",
-   "test": "react-scripts test --env=jsdom",
+   "test": "react-app-rewired test --env=jsdom"
}
```

In your react-app-rewired configuration:

```javascript
/* config-overrides.js */
const rewireCssModules = require('react-app-rewire-css-modules');
const customProperties = {
  '--checkbox-color': 'purple',
  '--input-text-label-color': 'purple'
};

module.exports = function override(config, env, customProperties) {
  config = rewireCssModules(config, env, customProperties);
  return config;
};
```

In your React application:

```scss
// src/App.module.css

.input {
  color: aqua;
  
  &:hover {
    color: lawngreen;
  }
}
```

```jsx harmony
// src/App.js

import React from 'react';
import styles from './App.css';
import { Input } from '@abot/react-higgs/lib/input'; // Note: not from @abot/react-higgs/lib/input/Input
import inputTheme from './App.module.css';

export default ({text}) => (
    <div>
      <Input label="xxx" theme={inputTheme}/>
    </div>
)
```
