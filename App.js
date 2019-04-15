import { GLView } from 'expo';
import React, { Component } from 'react';
import { View, StyleSheet, Text, TextInput, PanResponder, Animated } from 'react-native';
import * as THREE from "three";
import ExpoTHREE from 'expo-three';

console.disableYellowBox = true;

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      pan: new Animated.ValueXY(),
      MeshXValue: '1', MeshYValue: '1', MeshZValue: '1'
    };
  }
  componentWillMount() {
    this._val = { x:0, y:0 };
    this.state.pan.addListener((value) => this._val = value);
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gesture) => true,
      onPanResponderGrant: (e, gesture) => {
        this.state.pan.setOffset({
          x: this._val.x,
          y: this._val.y
        });
        this.state.pan.setValue({ x:0, y:0});
      },
      onPanResponderMove: Animated.event([
        null,
        { dx: this.state.pan.x, dy: this.state.pan.y }
      ])
    });
  }

  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <Animated.View
          {...this.panResponder.panHandlers}
          style={{ flex:4, transform: this.state.pan.getTranslateTransform() }}
        >
          <GLView style={{ flex: 1 }}
            onContextCreate={this._onGLContextCreate}
          />
        </Animated.View>
        <View style={styles.textview}>
          <View style={styles.text}>
            <Text style={styles.textfont}>meshscalax:</Text>
            <TextInput style={{ backgroundColor: '#dddddd' }}
              value={this.state.MeshXValue}
              onChangeText={this._handleXValueChange}
            />
          </View>
          <View style={styles.text}>
            <Text style={styles.textfont}>meshscalay:</Text>
            <TextInput style={{ backgroundColor: '#dddddd' }}
              value={this.state.MeshYValue}
              onChangeText={this._handleYValueChange}
            />
          </View>
          <View style={styles.text}>
            <Text style={styles.textfont}>meshscalaz:</Text>
            <TextInput style={{ backgroundColor: '#dddddd' }}
              value={this.state.MeshZValue}
              onChangeText={this._handleZValueChange}
            />
          </View>
        </View>
      </View>
    )
  }

  _handleXValueChange = MeshXValue => {
    this.setState({ MeshXValue });
  };
  _handleYValueChange = MeshYValue => {
    this.setState({ MeshYValue });
  };
  _handleZValueChange = MeshZValue => {
    this.setState({ MeshZValue });
  };

  _onGLContextCreate = async (gl) => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000
    );
    camera.position.z = 5;
    const renderer = ExpoTHREE.createRenderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshNormalMaterial({ color: 0x00ff00 });
    const mesh = new THREE.Mesh( geometry, material );
    scene.add(mesh);

    const animate = () => {
      requestAnimationFrame(animate);
      mesh.scale.set(this.state.MeshXValue,this.state.MeshYValue,this.state.MeshZValue);
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.02;
      renderer.render(scene, camera);
      gl.endFrameEXP();
    }
    animate();
  };
}

const styles = StyleSheet.create({
  textview: {
    flex: 1,
    backgroundColor: '#eeeeee',
  },
  text: {
    flex:1,
    flexDirection:'row',
    alignItems: 'center',
    justifyContent:'center',
  },
  textfont: {
    fontSize:20
  }
});
