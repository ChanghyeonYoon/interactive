import gsap from "gsap";
const BackgroundGradient = (colorA, colorB) => {
  var mesh = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2, 2, 1, 1),
    new THREE.ShaderMaterial({
      uniforms: {
        uColorA: { value: new THREE.Color(colorA) },
        uColorB: { value: new THREE.Color(colorB) },
      },
      vertexShader: `
            varying vec2 vUv;
            void main(){
                vUv = uv;
                float depth = -1.; //or maybe 1. you can experiment
                gl_Position = vec4(position.xy, depth, 1.);
            }
          `,
      fragmentShader: `
            varying vec2 vUv;
            uniform vec3 uColorA;
            uniform vec3 uColorB;
            void main(){
                gl_FragColor = vec4(
                    mix( uColorA, uColorB, vec3(vUv.y)),
                    1.
                );
            }
          `,
    }),
  );

  mesh.material.depthWrite = false;
  mesh.renderOrder = -99999;
  return mesh;
};

export class Stage {
  constructor(domCanvasElement, topColor, bottomColor) {
    this.canvas = domCanvasElement;
    this.scene = new THREE.Scene();

    this.sizes = {
      width: 0,
      height: 0,
    };

    /**
     * Background Gradient
     */

    this.background = BackgroundGradient(bottomColor, topColor);
    this.scene.add(this.background);

    /**
     * Camera
     */

    this.camera = new THREE.PerspectiveCamera(30, this.sizes.width / this.sizes.height, 0.1, 100);
    this.camera.position.set(0, 0, 6);
    this.scene.add(this.camera);

    /**
     * Camera Group
     */

    this.cameraGroup = new THREE.Group();

    this.scene.add(this.cameraGroup);

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: window.devicePixelRatio === 1 ? true : false,
    });

    renderer.physicallyCorrectLights = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

    this.renderer = renderer;

    window.addEventListener("resize", () => {
      this.onResize();
    });

    this.onResize();
  }

  onResize() {
    // Update sizes
    this.sizes.width = window.innerWidth;
    this.sizes.height = window.innerHeight;

    if (this.sizes.width < 800) this.camera.position.z = 10;
    else this.camera.position.z = 6;

    // Update camera
    this.camera.aspect = this.sizes.width / this.sizes.height;
    this.camera.updateProjectionMatrix();

    // Update renderer
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  add(item) {
    this.scene.add(item);
  }

  cameraAdd(item) {
    this.cameraGroup.add(item);
  }

  render(elapsedTime) {
    this.cameraGroup.position.copy(this.camera.position);
    this.cameraGroup.rotation.copy(this.camera.rotation);
    this.renderer.render(this.scene, this.camera);
  }
}

export class Loader {
  constructor(color = "black", shadow = "white", size = 1) {
    this.mesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2, 2, 1, 1),
      new THREE.ShaderMaterial({
        uniforms: {
          uColor: { value: new THREE.Color(color) },
          uColorShadow: { value: new THREE.Color(shadow) },
          uProgress: { value: 0 },
          uAlpha: { value: 1 },
          uNoiseSize: { value: size },
        },
        vertexShader: `
        
                
                void main(){
             
                    gl_Position = vec4(position.xy, 0.5, 1.);
                }
                `,
        fragmentShader: `

                uniform vec3 uColor;
                uniform float uAlpha;
            
                void main () {
                    gl_FragColor = vec4(uColor, uAlpha);
                }
            `,
        transparent: true,
        depthTest: false,
      }),
    );
  }

  get progress() {
    return this.mesh.material.uniforms.uProgress.value;
  }

  set progress(newValue) {
    this.mesh.material.uniforms.uProgress.value = newValue;
  }

  get alpha() {
    return this.mesh.material.uniforms.uAlpha.value;
  }

  set alpha(newValue) {
    this.mesh.material.uniforms.uAlpha.value = newValue;
  }

  get noiseSize() {
    return this.mesh.material.uniforms.uNoiseSize.value;
  }

  set noiseSize(newValue) {
    this.mesh.material.uniforms.uNoiseSize.value = newValue;
  }
}

const ripVertexShader = `
	uniform float uTearAmount;
	uniform float uTearWidth;
	uniform float uTearXAngle;
	uniform float uTearYAngle;
	uniform float uTearZAngle;
	uniform float uTearXOffset;
	uniform float uXDirection;
	uniform float uRipSide;
	uniform float uRipSeed;

	varying vec2 vUv;
	varying float vAmount;

	mat4 rotationX( in float angle ) {
		return mat4(	1.0,		0,			0,			0,
						0, 	cos(angle),	-sin(angle),		0,
						0, 	sin(angle),	 cos(angle),		0,
						0, 			0,			  0, 		1);
	}

	mat4 rotationY( in float angle ) {
		return mat4(	cos(angle),		0,		sin(angle),	0,
								0,		1.0,			 0,	0,
						-sin(angle),	0,		cos(angle),	0,
								0, 		0,				0,	1);
	}

	mat4 rotationZ( in float angle ) {
		return mat4(	cos(angle),		-sin(angle),	0,	0,
						sin(angle),		cos(angle),		0,	0,
								0,				0,		1,	0,
								0,				0,		0,	1);
	}

	void main(){

		float ripAmount = 0.0;
		float yAmount = max(0.0, (uTearAmount - (1.0 - uv.y)));
		float zRotate = uTearZAngle * yAmount;
		float xRotate = uTearXAngle * yAmount;
		float yRotate = uTearYAngle * yAmount;
		vec3 rotation = vec3(xRotate* yAmount, yRotate* yAmount, zRotate* yAmount);


		float halfHeight = float(HEIGHT) * 0.5;
		float halfWidth = (float(WIDTH) - uTearWidth * 0.5) * 0.5;

		vec4 vertex = vec4(position.x + (halfWidth * uXDirection) - halfWidth, position.y + halfHeight, position.z, 1.0);

		vertex = vertex * rotationY(rotation.y ) * rotationX(rotation.x  ) * rotationZ(rotation.z  );
		vertex.x += uTearXOffset * yAmount + ripAmount + halfWidth ;
		vertex.y -= halfHeight;

		vec4 modelPosition = modelMatrix * vertex;
		vec4 viewPosition = viewMatrix * modelPosition;
		vec4 projectedPosition = projectionMatrix * viewPosition;

		gl_Position = projectedPosition;

		vUv = uv;
		vAmount = yAmount;
	}
`;

const ripFragmentShader = `
	uniform sampler2D uMap;
	uniform sampler2D uRip;
	uniform sampler2D uBorder;

	uniform vec3 uShadeColor;
	uniform float uUvOffset;
	uniform float uRipSide;
	uniform float uTearXAngle;
	uniform float uShadeAmount;
	uniform float uTearWidth;
	uniform float uWhiteThreshold;
	uniform float uTearOffset;

	varying vec2 vUv;
	varying float vAmount;

	void main () {

		bool rightSide = uRipSide == 1.0;
		float ripAmount = -1.0;
		float width = float(WIDTH);
		float widthOverlap = (uTearWidth * 0.5) + width;

		bool frontSheet = uTearXAngle > 0.0;

		float xScale = widthOverlap / float(FULL_WIDTH);
		vec2 uvOffset = vec2(vUv.x * xScale + uUvOffset, vUv.y);
		vec4 textureColor = texture2D(uMap, uvOffset);
		vec4 borderColor = texture2D(uBorder, uvOffset);
		if(borderColor.r > 0.0) textureColor = vec4(vec3(0.95), 1.0);

		float ripRange = uTearWidth / widthOverlap;
		float ripStart = rightSide ? 0.0 : 1.0 - ripRange;

		float alpha = 1.0;

		float ripX = (vUv.x - ripStart) / ripRange;
		float ripY = vUv.y * 0.5 + (0.5 * uTearOffset);
		vec4 ripCut = texture2D(uRip, vec2(ripX, ripY));
		vec4 ripColor = texture2D(uRip, vec2(ripX * 0.9, ripY - 0.02));

		float whiteness = dot(vec4(1.0), ripCut) / 4.0;

		if (!rightSide && whiteness <= uWhiteThreshold)
		{
			whiteness = dot(vec4(1.0), ripColor) / 4.0;
			if(whiteness >= uWhiteThreshold) textureColor = ripColor;
			else alpha = 0.0;
		} 
		if (rightSide && whiteness >= uWhiteThreshold) alpha = 0.0;

		gl_FragColor = mix(vec4(textureColor.rgb, alpha), vec4(uShadeColor, alpha), vAmount * uShadeAmount);
	}
`;

export class Photo {
  constructor(textures, destoryCallback) {
    this.destroyCallback = destoryCallback;
    this.photoTexture = textures.photo;
    this.borderTexture = textures.border;
    this.ripTexture = textures.rip;
    this.interactive = false;

    this.group = new THREE.Group();
    this.group.rotation.z = (Math.random() * 2 - 1) * Math.PI;
    this.group.position.y = 10;

    setTimeout(() => {
      this.interactive = true;
    }, 400);

    const introAnimation = gsap.timeline({
      delay: 0.3,
      defaults: {
        duration: 0.8,
        ease: "power3.out",
      },
    });
    introAnimation.to(this.group.rotation, { z: 0 }, 0);
    introAnimation.to(this.group.position, { y: 0 }, 0);

    const width = 3;
    const tearWidth = 0.4;

    this.sheetSettings = {
      widthSegments: 30,
      heightSegments: 50,
      tearOffset: Math.random(),
      width: width,
      height: 2,
      tearAmount: 0,
      tearWidth: tearWidth,
      ripWhiteThreshold: 0.7,
      left: {
        uvOffset: 0,
        ripSide: 0,
        tearXAngle: -0.01,
        tearYAngle: -0.1,
        tearZAngle: 0.05,
        tearXOffset: 0,
        direction: -1,
        shadeColor: new THREE.Color("white"),
        shadeAmount: 0.2,
      },
      right: {
        uvOffset: ((width - tearWidth) / width) * 0.5,
        ripSide: 1,
        tearXAngle: 0.2,
        tearYAngle: 0.1,
        tearZAngle: -0.1,
        tearXOffset: 0,
        direction: 1,
        shadeColor: new THREE.Color("black"),
        shadeAmount: 0.4,
      },
    };

    this.sides = [
      {
        id: "left",
        mesh: null,
        material: null,
      },
      {
        id: "right",
        mesh: null,
        material: null,
      },
    ];

    this.sheetPlane = new THREE.PlaneBufferGeometry(
      this.sheetSettings.width / 2 + this.sheetSettings.tearWidth / 2,
      this.sheetSettings.height,
      this.sheetSettings.widthSegments,
      this.sheetSettings.heightSegments,
    );

    this.sides.forEach((side) => {
      side.material = this.getRipMaterial(side.id);
      side.mesh = new THREE.Mesh(this.sheetPlane, side.material);

      if (this.sheetSettings[side.id].tearXAngle > 0) {
        side.mesh.position.z += 0.0001;
      }
      this.group.add(side.mesh);
    });
  }

  getRipMaterial(side) {
    const material = new THREE.ShaderMaterial({
      defines: {
        HEIGHT: this.sheetSettings.height,
        WIDTH: this.sheetSettings.width / 2,
        FULL_WIDTH: this.sheetSettings.width,
        HEIGHT_SEGMENTS: this.sheetSettings.heightSegments,
        WIDTH_SEGMENTS: this.sheetSettings.widthSegments,
      },
      uniforms: {
        uMap: { value: this.photoTexture },
        uRip: { value: this.ripTexture },
        uBorder: { value: this.borderTexture },
        uRipSide: { value: this.sheetSettings[side].ripSide },
        uTearWidth: { value: this.sheetSettings.tearWidth },
        uWhiteThreshold: { value: this.sheetSettings.ripWhiteThreshold },
        uTearAmount: { value: this.sheetSettings.tearAmount },
        uTearOffset: { value: this.sheetSettings.tearOffset },
        uUvOffset: { value: this.sheetSettings[side].uvOffset },
        uTearXAngle: { value: this.sheetSettings[side].tearXAngle },
        uTearYAngle: { value: this.sheetSettings[side].tearYAngle },
        uTearZAngle: { value: this.sheetSettings[side].tearZAngle },
        uTearXOffset: { value: this.sheetSettings[side].tearXOffset },
        uXDirection: { value: this.sheetSettings[side].direction },
        uShadeColor: { value: this.sheetSettings[side].shadeColor },
        uShadeAmount: { value: this.sheetSettings[side].shadeAmount },
      },
      transparent: true,
      vertexShader: ripVertexShader,
      fragmentShader: ripFragmentShader,
    });

    return material;
  }

  shouldCompleteRip() {
    return this.sheetSettings.tearAmount >= 1.5;
  }

  updateUniforms() {
    if (this.interactive && this.shouldCompleteRip()) {
      this.remove();
    } else {
      if (this.sheetSettings.tearAmount === 0) this.sheetSettings.tearOffset = Math.random();
      this.sides.forEach((side) => {
        const uniforms = side.mesh.material.uniforms;

        uniforms.uTearAmount.value = this.sheetSettings.tearAmount;
        uniforms.uTearOffset.value = this.sheetSettings.tearOffset;
        uniforms.uUvOffset.value = this.sheetSettings[side.id].uvOffset;
        uniforms.uTearXAngle.value = this.sheetSettings[side.id].tearXAngle;
        uniforms.uTearYAngle.value = this.sheetSettings[side.id].tearYAngle;
        uniforms.uTearZAngle.value = this.sheetSettings[side.id].tearZAngle;
        uniforms.uTearXOffset.value = this.sheetSettings[side.id].tearXOffset;
        uniforms.uXDirection.value = this.sheetSettings[side.id].direction;
        uniforms.uShadeColor.value = this.sheetSettings[side.id].shadeColor;
        uniforms.uShadeAmount.value = this.sheetSettings[side.id].shadeAmount;
        uniforms.uWhiteThreshold.value = this.sheetSettings.ripWhiteThreshold;
      });
    }
  }

  completeRip() {
    if (this.sheetSettings.tearAmount >= 1.15) this.remove();
    else this.reset();
  }

  reset() {
    gsap.to(this.sheetSettings, { tearAmount: 0, onUpdate: () => this.updateUniforms() });
  }

  remove() {
    this.interactive = false;
    this.destroyCallback();
    const removeAnimation = gsap.timeline({
      defaults: { duration: 1, ease: "power2.in" },
      onComplete: () => this.destroyMe(),
    });
    removeAnimation.to(this.sheetSettings, {
      tearAmount: 1.5 + Math.random() * 1.5,
      ease: "power2.out",
      onUpdate: () => this.updateUniforms(),
    });
    removeAnimation.to(this.group.position, { z: 1 }, 0);

    this.sides.forEach((side) => {
      removeAnimation.to(
        side.mesh.position,
        { y: -3 + Math.random() * -3, x: (2 + Math.random() * 3) * (this.sheetSettings[side.id].ripSide - 0.5) },
        0,
      );
      removeAnimation.to(
        side.mesh.rotation,
        { z: (-2 + Math.random() * -3) * (this.sheetSettings[side.id].ripSide - 0.5) },
        0,
      );
    });
  }

  destroyMe() {
    this.sheetPlane.dispose();
    this.sides.forEach((side) => {
      side.material.dispose();
      this.group.remove(side.mesh);
    });
  }
}
