import { Asset, GLView } from 'expo';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import * as THREE from 'three';
import ExpoTHREE from 'expo-three';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <GLView
          style={{ flex: 1 }}
          onContextCreate={this._onGLContextCreate}
        />
      </View>
    );
  }
  _onGLContextCreate = async (gl) => {
    const scene = new THREE.Scene();
    const light = new THREE.PointLight( 0xff0000, 1, 100 );
    light.position.set( 50, 50, 50 );
    scene.add(light)

    const camera = new THREE.PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      1000
    );

    const geometry = new THREE.SphereBufferGeometry(1, 36, 36);
    const material = new THREE.MeshLambertMaterial({
      color: 0xafeeee,
      map: await ExpoTHREE.createTextureAsync({
        asset: Asset.fromModule(require("./img/panorama.png"))
      })
    });

    const renderer = ExpoTHREE.createRenderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    const sphere = new THREE.Mesh(geometry, material);
    sphere.castShadow = true;
    scene.add(sphere);
    camera.position.z = 2;

    const render = () => {
      requestAnimationFrame(render);
      sphere.rotation.x += 0.01;
      sphere.rotation.y += 0.01;
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    render();
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
