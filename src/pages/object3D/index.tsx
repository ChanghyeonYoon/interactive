import React from "react";
import Header from "@/components/header";

const Object3D = () => {
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 15000);
      camera.position.z = 2500;
      const scene = new THREE.Scene();
      const geometry = new THREE.BoxGeometry(100, 100, 100);
      const material = new THREE.MeshNormalMaterial();
      const root = new THREE.Mesh(geometry, material);
      scene.add(root);
      root.position.x = 0;

      const renderer = new THREE.WebGLRenderer();

      const init = () => {
        let amount = 200,
          object,
          parent = root;

        for (let i = 0; i < amount; i++) {
          object = new THREE.Mesh(geometry, material);
          object.position.x = 100;
          parent.add(object);
          parent = object;
        }

        parent = root;

        for (let i = 0; i < amount; i++) {
          object = new THREE.Mesh(geometry, material);
          object.position.x = -100;
          parent.add(object);
          parent = object;
        }

        parent = root;

        for (let i = 0; i < amount; i++) {
          object = new THREE.Mesh(geometry, material);
          object.position.y = -100;
          parent.add(object);
          parent = object;
        }

        parent = root;

        for (let i = 0; i < amount; i++) {
          object = new THREE.Mesh(geometry, material);
          object.position.y = 100;
          parent.add(object);
          parent = object;
        }

        parent = root;

        for (let i = 0; i < amount; i++) {
          object = new THREE.Mesh(geometry, material);
          object.position.z = -100;
          parent.add(object);
          parent = object;
        }

        parent = root;

        for (let i = 0; i < amount; i++) {
          object = new THREE.Mesh(geometry, material);
          object.position.z = 100;
          parent.add(object);
          parent = object;
        }

        renderer.setClearColor(0xffffff);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.sortObjects = false;
        const div = document.getElementById("object3D");
        div?.appendChild(renderer.domElement);
      };

      const render = () => {
        let time = Date.now() * 0.001;

        let rx = Math.sin(time * 0.7) * 0.2;
        let ry = Math.sin(time * 0.3) * 0.1;
        let rz = Math.sin(time * 0.2) * 0.1;

        camera.position.x += camera.position.x * 0.05;
        camera.position.y += camera.position.y * 0.05;

        camera.lookAt(scene.position);

        root.traverse(function (object: any) {
          object.rotation.x = rx;
          object.rotation.y = ry;
          object.rotation.z = rz;
        });

        renderer.render(scene, camera);
      };

      const animate = () => {
        requestAnimationFrame(animate);
        render();
      };

      init();
      animate();
    }
  }, []);

  return (
    <div className='py-10 bg-black h-screen' id='object3D'>
      <Header title={"Object 3D"} />
    </div>
  );
};

export default Object3D;
