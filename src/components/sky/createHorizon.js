import * as THREE from "three";

// 캔버스 텍스처로 방위 라벨 스프라이트 생성
function makeLabelSprite(text, colorHex) {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = colorHex;
  ctx.font = "bold 72px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 64, 70);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(8, 8, 1);
  return { sprite, texture, material };
}

/**
 * 지평선 링 + 방위 라벨 그룹 생성. 월드 좌표 고정(회전 안 함).
 */
export function createHorizon({ radius = 99 } = {}) {
  const group = new THREE.Group();
  const disposables = [];

  // 지평선 링
  const segs = 128;
  const pts = [];
  for (let i = 0; i <= segs; i++) {
    const t = (i / segs) * Math.PI * 2;
    pts.push(Math.cos(t) * radius, 0, Math.sin(t) * radius);
  }
  const ringGeo = new THREE.BufferGeometry();
  ringGeo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  const ringMat = new THREE.LineBasicMaterial({
    color: 0x4ba1f7,
    transparent: true,
    opacity: 0.3,
    depthTest: false,
    depthWrite: false,
  });
  const ring = new THREE.LineLoop(ringGeo, ringMat);
  group.add(ring);
  disposables.push(ringGeo, ringMat);

  // 방위 라벨 (N=+Z, E=+X, S=-Z, W=-X)
  const cardinals = [
    { text: "N", x: 0, z: 1, color: "#7cc4ff" },
    { text: "E", x: 1, z: 0, color: "#8da0d1" },
    { text: "S", x: 0, z: -1, color: "#8da0d1" },
    { text: "W", x: -1, z: 0, color: "#8da0d1" },
  ];
  for (const c of cardinals) {
    const { sprite, texture, material } = makeLabelSprite(c.text, c.color);
    sprite.position.set(c.x * radius, 3, c.z * radius);
    group.add(sprite);
    disposables.push(texture, material);
  }

  return {
    group,
    dispose() {
      disposables.forEach((d) => d.dispose());
    },
  };
}
