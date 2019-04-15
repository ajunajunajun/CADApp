import { GLView } from 'expo';
import React, { Component } from 'react';
import { View, StyleSheet, Text, TextInput, KeyboardAvoidingView } from 'react-native';
import * as THREE from "three";
import ExpoTHREE from 'expo-three';

console.disableYellowBox = true;

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = { MeshXValue: '1', MeshYValue: '1', MeshZValue: '1'};
  }
  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <GLView style={{ flex: 4 }}
          onContextCreate={this._onGLContextCreate}
        />
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
