import React from "react";
import Header from "@/components/header";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

const Interaction_Cubes = () => {
  const camera = React.useRef<any>();
  const mouse = React.useRef<any>();
  const renderer = React.useRef<any>();
  const INTERSECTED = React.useRef<any>();

  let radius = 100;
  let theta = 0;

  let container;

  function onWindowResize() {
    camera.current.aspect = window.innerWidth / window.innerHeight;
    camera.current.updateProjectionMatrix();

    renderer.current.setSize(window.innerWidth, window.innerHeight);
  }

  function onDocumentMouseMove(event: any) {
    event.preventDefault();

    mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  const init = () => {
    const scene = new THREE.Scene();
    container = document.getElementById("interaction_cubes");

    const info = document.createElement("div");
    info.style.position = "absolute";
    info.style.top = "10px";
    info.style.width = "100%";
    info.style.textAlign = "center";
    info.innerHTML = '<a href="http://threejs.org" target="_blank">three.js</a> webgl - interactive cubes';
    container?.appendChild(info);

    camera.current = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    const geometry = new THREE.BoxGeometry(20, 20, 20);

    for (let i = 0; i < 2000; i++) {
      const object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }));

      object.position.x = Math.random() * 800 - 400;
      object.position.y = Math.random() * 800 - 400;
      object.position.z = Math.random() * 800 - 400;

      object.rotation.x = Math.random() * 2 * Math.PI;
      object.rotation.y = Math.random() * 2 * Math.PI;
      object.rotation.z = Math.random() * 2 * Math.PI;

      object.scale.x = Math.random() + 0.5;
      object.scale.y = Math.random() + 0.5;
      object.scale.z = Math.random() + 0.5;

      scene.add(object);
    }

    const raycaster = new THREE.Raycaster();

    renderer.current = new THREE.WebGLRenderer();
    renderer.current.setClearColor(0xf0f0f0);
    renderer.current.setSize(window.innerWidth, window.innerHeight);
    renderer.current.sortObjects = false;
    container?.appendChild(renderer.current.domElement);

    function render() {
      theta += 0.1;

      camera.current.position.x = radius * Math.sin(THREE.Math.degToRad(theta));
      camera.current.position.y = radius * Math.sin(THREE.Math.degToRad(theta));
      camera.current.position.z = radius * Math.cos(THREE.Math.degToRad(theta));
      camera.current.lookAt(scene.position);

      // find intersections

      const vector = new THREE.Vector3(mouse.current.x, mouse.current.y, 1).unproject(camera.current);

      raycaster.set(camera.current.position, vector.sub(camera.current.position).normalize());

      const intersects = raycaster.intersectObjects(scene.children);

      if (intersects.length > 0) {
        if (INTERSECTED.current != intersects[0].object) {
          if (INTERSECTED.current) INTERSECTED.current.material.emissive.setHex(INTERSECTED.current.currentHex);

          INTERSECTED.current = intersects[0].object;
          INTERSECTED.current.currentHex = INTERSECTED.current.material.emissive.getHex();
          INTERSECTED.current.material.emissive.setHex(0xff0000);
        }
      } else {
        if (INTERSECTED.current) INTERSECTED.current.material.emissive.setHex(INTERSECTED.current.currentHex);

        INTERSECTED.current = null;
      }

      renderer.current.render(scene, camera.current);
    }

    const animate = () => {
      requestAnimationFrame(animate);
      render();
    };

    animate();
  };

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      mouse.current = new THREE.Vector2();
      init();
      document.addEventListener("mousemove", onDocumentMouseMove, false);
      window.addEventListener("resize", onWindowResize, false);
      return () => {
        document.removeEventListener("mousemove", onDocumentMouseMove, false);
        window.removeEventListener("resize", onWindowResize, false);
      };
    }
  }, []);

  return (
    <div className='py-10 bg-black h-screen' id='interaction_cubes'>
      <Header title={"Interaction Cubes"} />
      <div className='bg-[#1C1C1E] text-3xl fixed bottom-40 z-10 w-screen flex gap-5 justify-center' />
    </div>
  );
};

export default Interaction_Cubes;
