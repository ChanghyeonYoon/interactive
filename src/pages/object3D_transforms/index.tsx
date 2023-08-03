import React from "react";
import Header from "@/components/header";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

const DESCRIPTIONS = [
  "mesh.position.x = 0",
  "mesh.position.x = -100",
  "mesh.scale.set(2,2,2)",
  "mesh.rotation.y = Math.PI / 4",
  "mesh.rotation.y = Math.PI * 5 / 4",
];

const Object3D_Transforms = () => {
  const [step, setStep] = React.useState(1);

  const [_mesh, setMesh] = React.useState<any>();

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100000);
      camera.position.set(-10, 100, 300);
      const scene = new THREE.Scene();
      const material = new THREE.MeshNormalMaterial();
      const geometry = new THREE.BoxGeometry(80, 80, 80, 1, 1, 1);
      const mesh = new THREE.Mesh(geometry, material);
      setMesh(mesh);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

      mesh.rotation.y = Math.PI / 4;
      mesh.position.set(0, 0, 0);
      scene.add(mesh);

      const wireframe = new THREE.WireframeGeometry(geometry);
      const line = new THREE.LineSegments(wireframe);
      line.material.color.setHex(0x000000);
      mesh.add(line);

      renderer.setClearColor(0x000000, 0); // the default
      renderer.setSize(window.innerWidth, window.innerHeight);

      const container = document.getElementById("object3D_transforms");
      container?.appendChild(renderer.domElement);

      const controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableKeys = false;

      const render = () => {
        renderer.render(scene, camera);
      };

      let paused = false;

      const animate = () => {
        requestAnimationFrame(animate);
        if (!paused) {
          render();
          controls.update();
          TWEEN.update();
        }
      };

      animate();
    }
  }, []);

  const setupTween = (obj: any, prop: any, targetValue: any) => {
    const update = function () {
      obj[prop] = current.property;
    };

    const current = { property: obj[prop] };
    const target = { property: targetValue };

    const tween = new TWEEN.Tween(current).to(target, 800).easing(TWEEN.Easing.Cubic.Out).onUpdate(update);

    tween.start();
  };

  const applyStep = () => {
    if (!_mesh) return;
    console.log(step);
    if (step == 1) {
      setupTween(_mesh.position, "x", 0);
    } else if (step == 2) {
      setupTween(_mesh.position, "x", -100);

      setupTween(_mesh.scale, "x", 1);
      setupTween(_mesh.scale, "y", 1);
      setupTween(_mesh.scale, "z", 1);
    } else if (step == 3) {
      setupTween(_mesh.scale, "x", 2);
      setupTween(_mesh.scale, "y", 2);
      setupTween(_mesh.scale, "z", 2);
    } else if (step == 4) {
      setupTween(_mesh.rotation, "y", Math.PI / 4);
    } else if (step == 5) {
      setupTween(_mesh.rotation, "y", (Math.PI * 5) / 4);
    }
  };

  const forward = () => {
    if (step >= 5) {
      setStep(5);
      return;
    }
    setStep((p) => p + 1);
  };

  const back = () => {
    if (step <= 0) {
      setStep(0);
      return;
    }
    setStep((p) => p - 1);
  };

  React.useEffect(() => {
    applyStep();
  }, [step]);
  return (
    <div className='py-10 bg-black h-screen' id='object3D_transforms'>
      <Header title={"Object 3D Transforms"} />
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
