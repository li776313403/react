/*
 * @Descripttion: 音视频设置
 * @version: v1.0
 * @Author: 李雯
 * @Date: 2021-12-20 20:10:20
 * @LastEditors: 李雯
 * @LastEditTime: 2021-12-24 09:13:30
 */
import React from "react";
import Enumerable from "linq-js";
import SoundMeter from "./common/js/soundmeter";
import { keyValuePair } from "./common/model";
import { Button, Select, message, Progress } from "antd";

const { Option } = Select;

interface IProps {}
interface IState {
  /**
   * @description: 选中的分辨率
   */
  resolvingPower: string | "";
  /**
   * @description: 音量大小
   */
  audioLevel: number | 0;
}

/**
 * @description: 控件集合
 */
const refs = {
  /**
   * @description: 视频ref
   */
  myVideoRef: React.createRef<HTMLVideoElement>(),
};
/**
 * @description: 分辨率
 */
const resolvingPower = {
  qvgaConstraints: {
    audio: true,
    video: {
      width: { exact: 320 },
      height: { exact: 240 },
    },
  } as MediaStreamConstraints,
  vgaConstraints: {
    audio: true,
    video: {
      width: { exact: 640 },
      height: { exact: 480 },
    },
  } as MediaStreamConstraints,
  hdConstraints: {
    audio: true,
    video: {
      width: { exact: 1280 },
      height: { exact: 720 },
    },
  } as MediaStreamConstraints,
  fullhdConstraints: {
    audio: true,
    video: {
      width: { exact: 1920 },
      height: { exact: 1080 },
    },
  } as MediaStreamConstraints,
  twokhdConstraints: {
    audio: true,
    video: {
      width: { exact: 2560 },
      height: { exact: 1440 },
    },
  } as MediaStreamConstraints,
  fourhdConstraints: {
    audio: true,
    video: {
      width: { exact: 4096 },
      height: { exact: 2160 },
    },
  } as MediaStreamConstraints,
};

/**
 * @description: 静态变量
 */
const models = {
  /**
   * @description: 媒体信息
   */
  stream: null as MediaStream,
  /**
   * @description: 音频管理API
   */
  audioContext: null as AudioContext,
  /**
   * @description: 音量监测定时器
   */
  audioTimer: null as NodeJS.Timer,
  /**
   * @description: 音频计量
   */
  soundMeter: null as SoundMeter,
};

/**
 * @description: 数据集合
 */
const datas = {
  /**
   * @description: 分辨率数据
   */
  resolvingPower: [
    { value: "qvga", label: "qvga" },
    { value: "vga", label: "vga" },
    { value: "hd", label: "高清" },
    { value: "fullhd", label: "超清" },
    { value: "twokhd", label: "2k" },
    { value: "fourhd", label: "4k" },
  ] as Array<keyValuePair>,
};

/**
 * @description: window扩展
 */
declare global {
  interface Window {
    /**
     * @description: 音频管理API
     */
    webkitAudioContext: any;
  }
}

/**
 * @description: 音视频设置
 */
class AudioVideoSettings extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      resolvingPower: "qvga",
      audioLevel: 0,
    };
  }
  /**
   * @description:  分辨率改变事件
   * @param {string} e 分辨率对应键
   */
  resolvingPowerChange = (e: string): void => {
    this.setState({ resolvingPower: e });
    // 已有视频在播放的话,关闭所有轨道
    if (models.stream) {
      models.stream.getTracks().forEach((item) => {
        item.stop();
      });
    }
    // 根据约束获取视频
    const model = Enumerable.from(datas.resolvingPower)
      .where((p) => p.value === e)
      .firstOrDefault({ value: "qvga", label: "qvga" });
    const constraints = resolvingPower[
      model.value + "Constraints"
    ] as MediaStreamConstraints;
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(this.getStream)
      .catch(this.getStreamError);
  };
  /**
   * @description: 获取视频成功后触发
   * @param {MediaStream} e 视频信息
   */
  getStream = (e: MediaStream): void => {
    const video = refs.myVideoRef.current;
    if (video) {
      models.stream = e;
      video.srcObject = e;
      models.soundMeter.connectToSource(e);
      if (models.audioTimer) {
        clearInterval(models.audioTimer);
      }
      models.audioTimer = setInterval(() => {
        // 读取音量值，在乘以一个系数，可以得到音量的宽度
        const number = parseFloat(models.soundMeter.instant.toFixed(2));
        const val = parseFloat((number * 348).toFixed(2)) + 1;
        this.setState({ audioLevel: val });
      }, 1000 * 0.1);
    } else {
      return;
    }
  };
  /**
   * @description: 获取视频失败后触发
   * @param {any} e 错误信息
   */
  getStreamError = (e: any): void => {
    message.error("当前摄像头不支持此分辨率", 1.5);
  };
  /**
   * @description: 动态设置
   */
  dynamicSettings = (): void => {
    if (models.stream) {
      const name = "fullhd" as string;
      const constraints = resolvingPower[name + "Constraints"]
        .video as MediaTrackConstraints;
      models.stream
        .getVideoTracks()[0]
        .applyConstraints(constraints)
        .then(() => {
          this.setState({ resolvingPower: name });
          message.success("设置成功", 1.5);
        })
        .catch(() => {
          message.error("当前摄像头不支持此分辨率", 1.5);
          return;
        });
    } else {
      message.info("没有需要动态设置的视频", 1.5);
      return;
    }
  };
  /**
   * @description: 音量检测
   */
  volumeDetection = (): void => {
    try {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      models.audioContext = new window.AudioContext();
      models.soundMeter = new SoundMeter(models.audioContext);
    } catch {
      console.log("网页音频API不支持");
      return;
    }
  };
  /**
   * @description: 初始化
   */
  initializationInit() {
    this.volumeDetection();
    this.resolvingPowerChange(datas.resolvingPower[0].value);
  };
  /**
   * @description: 页面加载完成后执行
   */  
  componentDidMount() {
    this.initializationInit();
  };
  /**
   * @description: 页面卸载完成后执行
   */  
  componentWillUnmount() {
    if (models.audioTimer) {
      clearInterval(models.audioTimer);
    }
  };
  /**
   * @description: 渲染
   */  
  render() {
    return (
      <div className="container">
        <h1>
          <span>音视频设置</span>
        </h1>
        <video ref={refs.myVideoRef} playsInline autoPlay />
        <br />
        音量:
        <Progress
          percent={this.state.audioLevel}
          status="active"
          style={{ width: "300px" }}
        />
        <br />
        <Select
          style={{ width: "100px", marginLeft: "20px" }}
          defaultValue={this.state.resolvingPower}
          value={this.state.resolvingPower}
          onChange={this.resolvingPowerChange}
        >
          {datas.resolvingPower.map((item) => {
            return (
              <Option value={item.value} key={item.value}>
                {item.label}
              </Option>
            );
          })}
        </Select>
        <Button onClick={this.dynamicSettings} style={{ marginLeft: "20px" }}>
          动态设置
        </Button>
      </div>
    );
  }
}

export default AudioVideoSettings;
