import React from "react";
import * as THREE from "three";
import Header from "@/components/header";

const BoxPage = () => {
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const scene = new THREE.Scene();
      const aspect = window.innerWidth / window.innerHeight;
      const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      const div = document.getElementById("box");
      console.log("append");
      div?.appendChild(renderer.domElement);

      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshNormalMaterial();
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);
      camera.position.z = 5;

      const render = () => {
        requestAnimationFrame(render);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
      };
      render();
    }
  }, []);

  return (
    <div className='py-10 bg-black h-screen' id='box'>
      <Header title={"Box"} />
    </div>
  );
};

export default BoxPage;
