import Expo, { GLView } from 'expo';
import React from 'react';
import { View } from 'react-native';
import * as THREE from 'three';
import ExpoTHREE from 'expo-three';

export default class App extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <GLView
          style={{ width:300, height:300 }}
          onContextCreate={this._onGLContextCreate}
        />
      </View>
    )
  }
  _onGLContextCreate = async (gl) => {
    const width = gl.drawingBufferWidth;
    const height = gl.drawingBufferHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    );
    const renderer = new ExpoTHREE.Renderer({ gl });
    renderer.setSize(width, height);

    const geometry = new THREE.TetrahedronBufferGeometry(0.1, 0)
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const sphere = new THREE.Mesh( geometry, material );
    scene.add(sphere);

    camera.position.z = 2;

  };
}
