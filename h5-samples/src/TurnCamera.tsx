/*
 * @Descripttion:设备控制
 * @version:V1.0
 * @Author: 李雯
 * @Date: 2021-12-19 12:51:12
 * @LastEditors: 李雯
 * @LastEditTime: 2021-12-20 20:16:57
 */
import React from "react";
import { Button, message, Select } from "antd";
import "../styles/css/video-filter.scss";
const { Option } = Select;
interface IProps {}
interface IState {
  constaints: {
    audio: boolean | true;
    video: boolean | true;
  };
  //  视频元素
  myVideoRef: React.RefObject<HTMLVideoElement> | null;
  // 视频元素
  myVideoRef2: React.RefObject<HTMLVideoElement> | null;
  // 音频元素
  myAudioRef: React.RefObject<HTMLAudioElement> | null;
  // 画布
  myCanvas: React.RefObject<HTMLCanvasElement> | null;
}

class TurnCamera extends React.Component<IProps, IState> {
  constructor(porps: IProps) {
    super(porps);
    this.state = {
      // 音视频是否开启
      constaints: {
        audio: true,
        video: true,
      },
      // 视频元素
      myVideoRef: React.createRef(),
      // 视频元素
      myVideoRef2: React.createRef(),
      // 音频元素
      myAudioRef: React.createRef(),
      // 画布
      myCanvas: React.createRef(),
    } as IState;
  }
  render() {
    return (
      <div className="container">
        <h1>
          <span>设备控制</span>
        </h1>
        <video
          className="video"
          ref={this.state.myVideoRef}
          autoPlay
          playsInline
        />
        <audio ref={this.state.myAudioRef} autoPlay />
        <Button className="button" onClick={this.openCamera}>
          打开媒体
        </Button>
        <Select
          defaultValue="video"
          style={{ width: "100px" }}
          onChange={this.filterChange}
        >
          <Option value="video">没有滤镜</Option>
          <Option value="blur">模糊</Option>
          <Option value="grayscale">灰度</Option>
          <Option value="invert">反转</Option>
          <Option value="sepia">深褐色</Option>
        </Select>
        <video
          className="video"
          ref={this.state.myVideoRef2}
          autoPlay
          playsInline
        />
        <Button className="button" onClick={this.shareScreen}>
          共享屏幕
        </Button>
        <canvas className="canvas" ref={this.state.myCanvas} />
        <Button className="button" onClick={this.takeSnap}>
          截图
        </Button>
      </div>
    );
  }
  /**
   * @description: 打开摄像头
   */
  openCamera = () => {
    navigator.mediaDevices
      .getUserMedia(this.state.constaints) //获取媒体
      .then(this.handleSuccess)
      .catch(this.handleError);
  };
  /**
   * @description: 获取正在使用的媒体成功后触发
   * @param {*}
   * @return {*}
   */
  handleSuccess = (stream: MediaStream): any => {
    const video = this.state.myVideoRef.current;
    const audio = this.state.myAudioRef.current;
    if (video !== null && audio !== null) {
      video.srcObject = stream;
      audio.srcObject = stream;
    } else {
      return;
    }
  };
  /**
   * @description: 获取正在使用的媒体失败后触发
   */
  handleError = (error: any) => {
    let str = "" as string;
    if (error.name === "NotFoundError") {
      str = "没有检查到可用于使用的媒体设备(视频头和麦克风)";
    } else {
      str = "";
    }
    message.error(`getUserMedia错误:${error.name}:${error.message}-${str}`, 2);
  };
  /**
   * @description: 截图
   */
  takeSnap = () => {
    let video = this.state.myVideoRef.current;
    let canvas = this.state.myCanvas.current;
    if (video !== null && canvas !== null) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (context !== null) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
      } else {
        return;
      }
    } else {
      return;
    }
  };
  /**
   * @description: 共享屏幕
   */
  shareScreen = () => {
    navigator.mediaDevices
      .getDisplayMedia({ video: true })
      .then(this.shareScreenHandleSuccess)
      .catch(this.shareScreenHandleError);
  };
  /**
   * @description: 开始共享
   * @param {JSON} stream 媒体信息
   */
  shareScreenHandleSuccess = (stream: MediaStream) => {
    const video = this.state.myVideoRef2.current;
    if (video !== null) {
      video.srcObject = stream;
    } else {
      return;
    }
  };
  /**
   * @description: 取消共享
   * @param {JSON} stream 媒体信息
   */
  shareScreenHandleError = (error: any) => {
    let str: string;
    if (error.name === "NotFoundError") {
      str = "没有检查到可用于使用的媒体设备(视频头和麦克风)";
    } else {
      str = "";
    }
    message.error(`getUserMedia错误:${error.name}:${error.message}-${str}`, 2);
  };
  /**
   * @description: 滤镜
   */
  filterChange = (value: string) => {
    const video = this.state.myVideoRef.current;
    if (video !== null) {
      video.className = value;
    } else {
      return;
    }
  };
}
export default TurnCamera;
