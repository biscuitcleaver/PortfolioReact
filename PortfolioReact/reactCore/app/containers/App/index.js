import React from 'react';
import { Switch, Route } from 'react-router-dom';
import HomePage from 'containers/HomePage/Loadable';
import styles from 'containers/App/Styles/app.less';

export default function App() {
  return (
    <div className={styles.body}>
      <Switch>
        <Route exact path="/" component={HomePage} />
      </Switch>
    </div>
  );
}
