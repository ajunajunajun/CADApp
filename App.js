import { GLView } from 'expo';
import React, { Component } from 'react';
import { View, StyleSheet, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import * as THREE from "three";
import ExpoTHREE from 'expo-three';

import data from './src/containers/materiallist.json';

console.disableYellowBox = true;

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onPressFlag: 'false', onPressCount: 0,
      materialX: '', materialY: '',materialZ: '',
    };
  }
  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <TouchableOpacity style={{ flex: 1 }}
          onPress={this._setonPressFlag}
        >
          <GLView style={{ flex: 1 }}
            onContextCreate={this._onGLContextCreate}
          />
        </TouchableOpacity>
        <Button
          onPress={this._setMaterial}
          title="button"
        />
      </View>
    )
  }

  _onGLContextCreate = async (gl) => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000
    );
    camera.position.x = 8;
    camera.position.y = 8;
    camera.position.z = 8;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    const renderer = ExpoTHREE.createRenderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    const floorgeometry = new THREE.BoxGeometry(30, 1, 30);
    const floormaterial = new THREE.MeshNormalMaterial({ color: 0x00ff00 });
    const floor = new THREE.Mesh( floorgeometry, floormaterial );
    scene.add(floor);
    floor.position.y = -1;

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      if(this.state.onPressFlag === 'true'){
        const geometry = new THREE.BoxGeometry(this.state.materialX, this.state.materialY, this.state.materialZ);
        const material = new THREE.MeshNormalMaterial({ color: 0x00ff00 });
        const mesh = new THREE.Mesh( geometry, material );
        scene.add(mesh);
        this.state.onPressCount += 1;
        mesh.position.y = this.state.onPressCount;
        this.setState({onPressFlag: 'false'});
      }
      gl.endFrameEXP();
    }
    animate();
  };

  _setonPressFlag = () => {
    this.setState({onPressFlag: 'true'});
  };
  _setMaterial = () => {
    this.setState({
      materialX:data.block[2].x,
      materialY:data.block[2].y,
      materialZ:data.block[2].z
    });
  };
}

const styles = StyleSheet.create({
});
