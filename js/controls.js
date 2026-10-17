import * as THREE from 'three';

const worldUp = new THREE.Vector3(0, 1, 0);

export class FirstPersonControls {
  constructor(camera, element) {
    this.camera = camera;
    this.element = element;
    this.position = camera.position;
    this.keys = new Set();
    this.velocity = new THREE.Vector3();
    this.look = { yaw: 0, pitch: 0 };
    this.targetLook = { yaw: 0, pitch: 0 };
    this.joystick = { x: 0, y: 0, vertical: 0 };
    this.horizontal = new THREE.Vector2();
    this.input = new THREE.Vector3();
    this.forward = new THREE.Vector3();
    this.right = new THREE.Vector3();
    this.desired = new THREE.Vector3();
    this.enabled = false;
    this.isTouch = false;
    this.lookHelp = document.querySelector('#look-help');
    this.hint = document.querySelector('#hint');
    this.bindKeyboard();
    this.bindPointerLock();
  }

  bindKeyboard() {
    addEventListener('keydown', (event) => {
      if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space', 'ShiftLeft', 'ShiftRight'].includes(event.code)) {
        event.preventDefault();
        this.keys.add(event.code);
      }
    });
    addEventListener('keyup', (event) => {
      this.keys.delete(event.code);
    });
    addEventListener('blur', () => this.keys.clear());
  }

  bindPointerLock() {
    this.element.addEventListener('click', () => {
      if (this.enabled && !this.isTouch && document.pointerLockElement !== this.element) {
        this.element.requestPointerLock?.();
      }
    });
    document.addEventListener('mousemove', (event) => {
      if (!this.enabled || document.pointerLockElement !== this.element) return;
      this.targetLook.yaw -= event.movementX * 0.0024;
      this.targetLook.pitch -= event.movementY * 0.0024;
      this.targetLook.pitch = THREE.MathUtils.clamp(this.targetLook.pitch, -1.42, 1.42);
    });
    document.addEventListener('pointerlockchange', () => {
      const locked = document.pointerLockElement === this.element;
      this.lookHelp?.classList.toggle('is-hidden', locked || !this.enabled);
    });
  }

  update(deltaMs) {
    if (!this.enabled) return;
    const delta = Math.min(deltaMs / 1000, 0.05);
    this.targetLook.pitch = THREE.MathUtils.clamp(this.targetLook.pitch, -1.42, 1.42);
    this.look.yaw = THREE.MathUtils.lerp(this.look.yaw, this.targetLook.yaw, 1 - Math.exp(-16 * delta));
    this.look.pitch = THREE.MathUtils.lerp(this.look.pitch, this.targetLook.pitch, 1 - Math.exp(-16 * delta));
    this.camera.rotation.set(this.look.pitch, this.look.yaw, 0, 'YXZ');
    let side = 0;
    let forwardInput = 0;
    let vertical = 0;
    if (this.keys.has('KeyA')) side -= 1;
    if (this.keys.has('KeyD')) side += 1;
    if (this.keys.has('KeyW')) forwardInput += 1;
    if (this.keys.has('KeyS')) forwardInput -= 1;
    if (this.keys.has('Space')) vertical += 1;
    if (this.keys.has('ShiftLeft') || this.keys.has('ShiftRight')) vertical -= 1;
    vertical += this.joystick.vertical;
    side += this.joystick.x;
    forwardInput += -this.joystick.y;

    const horizontal = this.horizontal.set(side, forwardInput);
    if (horizontal.lengthSq() > 1) horizontal.normalize();
    const input = this.input.set(horizontal.x, THREE.MathUtils.clamp(vertical, -1, 1), horizontal.y);
    if (input.lengthSq() > 0.025) {
      this.lookHelp?.classList.add('is-hidden');
      this.hint?.classList.add('is-hidden');
    }
    // Se aplana la mirada actual para que el joystick no convierta el pitch en gravedad.
    const forward = this.forward;
    this.camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    const right = this.right.crossVectors(forward, worldUp).normalize();
    const desired = this.desired.copy(right).multiplyScalar(input.x).addScaledVector(forward, input.z);
    desired.y = input.y;
    desired.multiplyScalar(5.2);
    const response = input.lengthSq() ? 1 - Math.exp(-12 * delta) : 1 - Math.exp(-5 * delta);
    this.velocity.lerp(desired, response);
    this.position.addScaledVector(this.velocity, delta);

    // Límites suaves del pequeño universo, sin paredes ni suelo visibles.
    this.position.x = THREE.MathUtils.clamp(this.position.x, -29, 29);
    this.position.y = THREE.MathUtils.clamp(this.position.y, -18, 20);
    this.position.z = THREE.MathUtils.clamp(this.position.z, -54, 34);
    if (!input.lengthSq()) this.camera.position.y += Math.sin(performance.now() * 0.0008) * 0.00004;
  }
}
