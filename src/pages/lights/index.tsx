import React from "react";
import Header from "@/components/header";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

const DESCRIPTIONS = [
  "light = new THREE.DirectionalLight( 0xdddddd, 0.8 );",
  "light.position.set( -80, 80, 80 );",
  "light.position.x = 80;",
  "light.target.position = 160;",
  "light.position.x = -80;",
  "light = new THREE.DirectionalLight( 0xdddddd, 0.8 );",
  "light = new THREE.DirectionalLight( 0xb4e7f2, 0.8 );",
  "light = new THREE.DirectionalLight( 0xb4e7f2, 0.2 );",
  "light = new THREE.DirectionalLight( 0xb4e7f2, 1.5 );",
  "light = new THREE.DirectionalLight( 0xb4e7f2, 0.8 );",
  "light = new THREE.PointLight( 0xb4e7f2, 0.8 );",
  "light = new THREE.PointLight( 0xb4e7f2, 0.8 );",
  "light = new THREE.SpotLight( 0xb4e7f2, 0.8 );",
  "light.angle = Math.PI / 9;",
  "light.angle = Math.PI / 5;",
  "light.penumbra = 0.4;",
  "light.penumbra = 0;",
  "light.penumbra = 0.8;",
  "light = new THREE.AmbientLight( 0x444444 );",
  "light = new THREE.AmbientLight( 0x000000 );",
  "light = new THREE.AmbientLight( 0x444444 );",
];

const Object3D_Transforms = () => {
  const [step, setStep] = React.useState(1);
  const material = React.useRef<any>();
  const white = React.useRef<any>();
  const lightBlue = React.useRef<any>();
  const darkGrey = React.useRef<any>();
  const black = React.useRef<any>();

  const ambLight = React.useRef<any>();
  const dLight = React.useRef<any>();
  const dLightHelper = React.useRef<any>();
  const sLight = React.useRef<any>();
  const sLightHelper = React.useRef<any>();
  const pLight = React.useRef<any>();
  const pLightHelper = React.useRef<any>();

  let container;

  let controls;

  let paused = false;

  const init = () => {
    white.current = new THREE.Color(0xdddddd);
    lightBlue.current = new THREE.Color(0xb4e7f2);
    darkGrey.current = new THREE.Color(0x444444);
    black.current = new THREE.Color(0x000000);
    const scene = new THREE.Scene();

    container = document.getElementById("lights");

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100000);
    camera.position.y = 75;
    camera.position.z = 250;
    camera.lookAt(scene.position);

    // add objects here

    // ambient light
    ambLight.current = new THREE.AmbientLight(darkGrey.current);
    scene.add(ambLight.current);

    // directional light
    dLight.current = new THREE.DirectionalLight(white.current, 0.8);
    dLight.current.position.set(-80, 80, 80);
    scene.add(dLight.current);

    dLightHelper.current = new THREE.DirectionalLightHelper(dLight.current, 15);
    scene.add(dLightHelper.current);

    // point light
    pLight.current = new THREE.PointLight(lightBlue.current, 0.8); // distance
    pLight.current.position.set(-80, 80, 80);
    scene.add(pLight.current);

    pLightHelper.current = new THREE.PointLightHelper(pLight.current, 10);
    scene.add(pLightHelper.current);

    pLight.current.visible = false;
    pLightHelper.current.visible = false;

    // spot light
    sLight.current = new THREE.SpotLight(lightBlue.current, 0.8, 0, Math.PI / 9, 0.4); // hex, intensity, distance, angle, penumbra
    sLight.current.position.set(-80, 80, 80);
    scene.add(sLight.current);

    const sLightStartPosition = sLight.current.position.clone();
    const sLightNewPosition = sLightStartPosition.clone().multiplyScalar(1.3);

    sLightHelper.current = new THREE.SpotLightHelper(sLight.current);
    scene.add(sLightHelper.current);

    sLight.current.visible = false;
    sLightHelper.current.visible = false;

    material.current = new THREE.MeshPhongMaterial({ color: 0xaaaaaa, shininess: 40 });

    let planeGeo = new THREE.PlaneBufferGeometry(700, 700, 1, 1);
    const mesh = new THREE.Mesh(planeGeo, material.current);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -65;
    scene.add(mesh);

    let geometry = new THREE.SphereGeometry(60, 24, 16);
    const mesh2 = new THREE.Mesh(geometry, material.current);
    scene.add(mesh2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0); // the default
    renderer.setSize(window.innerWidth, window.innerHeight);

    container?.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableKeys = false;

    const render = () => {
      renderer.render(scene, camera);
    };

    const animate = () => {
      requestAnimationFrame(animate);
      if (!paused) {
        render();
        // controls.update();
        TWEEN.update();
      }
    };

    animate();
  };

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      init();
    }
  }, []);

  const setupTween = (obj: any, prop: any, targetValue: any) => {
    const update = function () {
      obj[prop] = current.property;
      dLight.current.target.updateMatrixWorld(); // https://github.com/mrdoob/three.js/issues/5555
      dLightHelper.current.update();
      sLightHelper.current.update();
    };

    const current = { property: obj[prop] };
    const target = { property: targetValue };

    const tween = new TWEEN.Tween(current).to(target, 800).easing(TWEEN.Easing.Cubic.Out).onUpdate(update);

    tween.start();
  };

  const applyStep = () => {
    if (step == 1) {
    } else if (step == 2) {
      setupTween(dLight.current.position, "x", -80);
    } else if (step == 3) {
      setupTween(dLight.current.position, "x", 80);
      setupTween(dLight.current.target.position, "x", 0);
    } else if (step == 4) {
      setupTween(dLight.current.target.position, "x", 160);
      setupTween(dLight.current.position, "x", 80);
    } else if (step == 5) {
      setupTween(dLight.current.position, "x", -80);
      setupTween(dLight.current.target.position, "x", 0);
    } else if (step == 6) {
      setupTween(dLight.current.color, "r", white.current.r);
      setupTween(dLight.current.color, "g", white.current.g);
      setupTween(dLight.current.color, "b", white.current.b);
    } else if (step == 7) {
      setupTween(dLight.current.color, "r", lightBlue.current.r);
      setupTween(dLight.current.color, "g", lightBlue.current.g);
      setupTween(dLight.current.color, "b", lightBlue.current.b);

      setupTween(dLight.current, "intensity", 0.8);
    } else if (step == 8) {
      setupTween(dLight.current, "intensity", 0.2);
    } else if (step == 9) {
      setupTween(dLight.current, "intensity", 1.5);
    } else if (step == 10) {
      setupTween(dLight.current, "intensity", 0.8);

      dLight.current.visible = true;
      pLight.current.visible = false;
      dLightHelper.current.visible = true;
      pLightHelper.current.visible = false;
      material.current.needsUpdate = true;
    } else if (step == 11) {
      dLight.current.visible = false;
      pLight.current.visible = true;
      dLightHelper.current.visible = false;
      pLightHelper.current.visible = true;
      material.current.needsUpdate = true;

      setupTween(pLight.current.position, "x", -80);
      setupTween(pLight.current.position, "y", 80);
      setupTween(pLight.current.position, "z", 80);
    } else if (step == 12) {
      setupTween(pLight.current.position, "x", 50);
      setupTween(pLight.current.position, "y", 30);
      setupTween(pLight.current.position, "z", 75);

      pLight.current.visible = true;
      sLight.current.visible = false;
      pLightHelper.current.visible = true;
      sLightHelper.current.visible = false;
      material.current.needsUpdate = true;
    } else if (step == 13) {
      pLight.current.visible = false;
      sLight.current.visible = true;
      pLightHelper.current.visible = false;
      sLightHelper.current.visible = true;
      material.current.needsUpdate = true;
    } else if (step == 14) {
      setupTween(sLight.current, "angle", Math.PI / 9);
    } else if (step == 15) {
      setupTween(sLight.current, "angle", Math.PI / 5); // should be no more than Math.PI/2
    } else if (step == 16) {
      setupTween(sLight.current, "penumbra", 0.4);
    } else if (step == 17) {
      setupTween(sLight.current, "penumbra", 0);
    } else if (step == 18) {
      setupTween(sLight.current, "penumbra", 0.8);
      sLightHelper.current.visible = true;
    } else if (step == 19) {
      sLightHelper.current.visible = false;
      setupTween(ambLight.current.color, "r", darkGrey.current.r);
      setupTween(ambLight.current.color, "g", darkGrey.current.g);
      setupTween(ambLight.current.color, "b", darkGrey.current.b);
    } else if (step == 20) {
      setupTween(ambLight.current.color, "r", black.current.r);
      setupTween(ambLight.current.color, "g", black.current.g);
      setupTween(ambLight.current.color, "b", black.current.b);
    } else if (step == 21) {
      setupTween(ambLight.current.color, "r", darkGrey.current.r);
      setupTween(ambLight.current.color, "g", darkGrey.current.g);
      setupTween(ambLight.current.color, "b", darkGrey.current.b);
    }
  };

  const forward = () => {
    if (step >= 21) {
      setStep(21);
      return;
    }
    setStep((p) => p + 1);
  };

  const back = () => {
    if (step <= 1) {
      setStep(1);
      return;
    }
    setStep((p) => p - 1);
  };

  React.useEffect(() => {
    applyStep();
  }, [step]);

  return (
    <div className='py-10 bg-black h-screen' id='lights'>
      <Header title={"Lights"} />
      <div className='bg-[#1C1C1E] text-3xl fixed bottom-40 z-10 w-screen flex gap-5 justify-center'>
        <SyntaxHighlighter style={atomDark} language='javascript'>
          {DESCRIPTIONS[step - 1]}
        </SyntaxHighlighter>
      </div>
      <div className='fixed bottom-20 z-10 w-full flex gap-5 justify-center'>
        <button onClick={back} className='bg-white rounded-md px-4 py-2'>
          Previous
        </button>
        <button onClick={forward} className='bg-white rounded-md px-4 py-2'>
          Next
        </button>
      </div>
    </div>
  );
};

export default Object3D_Transforms;
