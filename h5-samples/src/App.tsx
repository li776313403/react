/*
 * @Descripttion:路由配置页面
 * @version:v1.0
 * @Author: 李雯
 * @Date: 2021-12-19 12:49:52
 * @LastEditors: 李雯
 * @LastEditTime: 2021-12-20 20:13:51
 */
import React from 'react';
import { HashRouter as Router, useRoutes } from 'react-router-dom';
import Samples from './Samples';
import TurnCamera from './TurnCamera';
import AudioVideoSettings from './AudioVideoSettings';

/**
 * @description: 路由配置
 */
class App extends React.Component {
  /**
   * @description: 路由信息
   */
  rou() {
    let routes = useRoutes([
      { path: '/', element: <Samples /> },
      { path: 'turnCamera', element: <TurnCamera /> },
      { path: 'audioVideoSettings', element: <AudioVideoSettings /> },
    ]);
    return routes;
  }
  render() {
    return (
      <Router>
        <this.rou />
      </Router>
    );
  }
}

export default App;
