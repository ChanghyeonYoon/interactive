import React from "react";
import Header from "@/components/header";

const Interaction_GUI = () => {
  const camera = React.useRef<any>();
  const mouse = React.useRef<any>();
  const renderer = React.useRef<any>();
  const controls = React.useRef<any>();
  const INTERSECTED = React.useRef<any>();

  let container;

  function setupGui(mesh: any) {
    // dat.GUI debugging -----------------------------------------
    const gui = new dat.GUI();
    const f1 = gui.addFolder("mesh position");
    f1.add(mesh.position, "x", -400, 400);
    f1.add(mesh.position, "y", -400, 400);
    f1.open();

    const f2 = gui.addFolder("mesh rotation");
    f2.add(mesh.rotation, "x", -Math.PI / 4, Math.PI / 4);
    f2.add(mesh.rotation, "y", -Math.PI / 4, Math.PI / 4);
    f2.open();
  }

  function onWindowResize() {
    camera.current.aspect = window.innerWidth / window.innerHeight;
    camera.current.updateProjectionMatrix();

    renderer.current.setSize(window.innerWidth, window.innerHeight);
  }

  function onDocumentMouseMove(event: any) {
    event.preventDefault();
    if (!mouse.current) return;

    mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  const init = () => {
    const scene = new THREE.Scene();
    container = document.getElementById("interaction_gui");

    const info = document.createElement("div");
    info.style.position = "absolute";
    info.style.top = "10px";
    info.style.width = "100%";
    info.style.textAlign = "center";
    info.innerHTML = '<a href="http://threejs.org" target="_blank">three.js</a> webgl - interactive cubes';
    container?.appendChild(info);

    renderer.current = new THREE.WebGLRenderer({ antialias: true });
    renderer.current.setClearColor(0xf0f0f0);
    renderer.current.setSize(window.innerWidth, window.innerHeight);
    renderer.current.sortObjects = false;
    container?.appendChild(renderer.current.domElement);

    camera.current = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
    camera.current.position.z = 1000;

    controls.current = new THREE.OrbitControls(camera.current, renderer.current.domElement);

    const aLight = new THREE.AmbientLight(0x444444);
    scene.add(aLight);

    const light = new THREE.DirectionalLight(0xffffff, 0.9);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    const light2 = new THREE.DirectionalLight(0xffffff, 0.9);
    light2.position.set(-1, -1, -1).normalize();
    scene.add(light2);

    const geometry = new THREE.BoxGeometry(60, 60, 60);

    for (let i = 0; i < 250; i++) {
      // var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
      const object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: 0xaaaaaa }));

      object.position.x = Math.random() * 800 - 400;
      object.position.y = Math.random() * 800 - 400;
      object.position.z = Math.random() * 800 - 400;

      object.rotation.x = Math.random() * 2 * Math.PI;
      object.rotation.y = Math.random() * 2 * Math.PI;
      object.rotation.z = Math.random() * 2 * Math.PI;

      // object.scale.x = Math.random() + 0.5;
      // object.scale.y = Math.random() + 0.5;
      // object.scale.z = Math.random() + 0.5;

      scene.add(object);
    }

    const mesh = new THREE.Mesh(new THREE.BoxGeometry(40, 40, 40), new THREE.MeshNormalMaterial());

    mesh.position.set(-200, -200, 500);
    scene.add(mesh);

    mesh.add(new THREE.AxisHelper(50));

    const arrowHelper = new THREE.ArrowHelper(
      new THREE.Vector3(0, 0, -1),
      new THREE.Vector3(0, 0, 0),
      1100,
      0xff0000,
      70,
    );
    mesh.add(arrowHelper);

    setupGui(mesh);

    const projector = new THREE.Projector();
    const raycaster = new THREE.Raycaster();

    const render = () => {
      // theta += 0.1;

      // camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
      // camera.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) );
      // camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );
      // camera.lookAt( scene.position );

      // find intersections
      const vector = new THREE.Vector3(mouse.current?.x || 0, mouse.current?.y || 0, 1);
      projector.unprojectVector(vector, camera.current);

      // raycaster.set( camera.position, vector.sub( camera.position ).normalize() );

      // ----

      const matrix = new THREE.Matrix4();
      matrix.extractRotation(mesh.matrix);

      let direction = new THREE.Vector3(0, 0, -1);
      direction = direction.applyMatrix4(matrix);

      raycaster.set(mesh.position, direction);

      // ----

      const intersects = raycaster.intersectObjects(scene.children);

      if (intersects.length > 0) {
        if (INTERSECTED.current != intersects[0].object) {
          if (INTERSECTED.current) INTERSECTED.current.material.color.setHex(INTERSECTED.current.currentHex);

          INTERSECTED.current = intersects[0].object;
          INTERSECTED.current.currentHex = INTERSECTED.current.material.color.getHex();
          INTERSECTED.current.material.color.setHex(0xff0000);
        }
      } else {
        if (INTERSECTED.current) INTERSECTED.current.material.color.setHex(INTERSECTED.current.currentHex);

        INTERSECTED.current = null;
      }

      renderer.current.render(scene, camera.current);
    };

    const animate = () => {
      requestAnimationFrame(animate);

      render();
      controls.current.update();
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
    <div className='py-10 bg-black h-screen' id='interaction_gui'>
      <Header title={"Interaction GUI"} />
      <div className='bg-[#1C1C1E] text-3xl fixed bottom-40 z-10 w-screen flex gap-5 justify-center' />
    </div>
  );
};

export default Interaction_GUI;
