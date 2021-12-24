/*
 * @Descripttion: 首页
 * @version: v1.0
 * @Author: 李雯
 * @Date: 2021-12-19 12:46:05
 * @LastEditors: 李雯
 * @LastEditTime: 2021-12-20 18:49:43
 */
import React from "react";
import ReactDOM from "react-dom";
//导入主组件
import App from "./App";
//导入antd样式
import "antd/dist/antd.css";
//导入全局样式
import "../styles/css/styles.scss";

//将根组件App渲染至首页div里
ReactDOM.render(<App /> ,document.getElementById("app"));