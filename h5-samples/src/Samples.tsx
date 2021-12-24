/*
 * @Descripttion:菜单
 * @version:v1.0
 * @Author: 李雯
 * @Date: 2021-12-19 13:16:05
 * @LastEditors: 李雯
 * @LastEditTime: 2021-12-20 20:12:40
 */
import React from "react";
import { List } from "antd";
import { Link } from "react-router-dom";
//标题和路径
const data = [
  { title: "首页", path: "/" },
  { title: "设备控制", path: "turnCamera" },
  { title: "音视频设置", path: "audioVideoSettings" },
];
//示例组件
class Samples extends React.Component {
  render() {
    return (
      <div>
        {/* 示例列表 */}
        <List
          header={<div>WebRTC示例</div>}
          footer={<div>Footer</div>}
          bordered
          //数据源
          dataSource={data}
          //列表项
          renderItem={(item) => (
            <List.Item>
              {/* 连接 */}
              <Link to={item["path"]}>{item["title"]}</Link>
            </List.Item>
          )}
        />
      </div>
    );
  }
}
//导出示例组件
export default Samples;
