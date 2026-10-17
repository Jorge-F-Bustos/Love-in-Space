import * as THREE from 'three';

export function setupInteractions(camera, controls, memoryGroup) {
  const ray = new THREE.Raycaster();
  const center = new THREE.Vector2();
  const toast = document.querySelector('#memory-toast');
  let hovered = null;
  let focus = null;
  let raycastDirty = true;
  let lastRaycast = 0;

  function check() {
    const now = performance.now();
    if (!raycastDirty && now - lastRaycast < 100) return;
    ray.setFromCamera(center, camera);
    const hit = ray.intersectObjects(memoryGroup.children, true)[0];
    const candidate = hit?.object?.parent;
    hovered = candidate?.userData?.data ? candidate : candidate?.parent?.userData?.data ? candidate.parent : null;
    raycastDirty = false;
    lastRaycast = now;
  }
  addEventListener('mousemove', () => { raycastDirty = true; check(); });
  addEventListener('click', (event) => {
    if (event.target.closest?.('#music-toggle, #joystick, .vertical-button, #enter-button')) return;
    if (!hovered || focus) {
      if (focus) focus = null;
      return;
    }
    focus = hovered;
    toast.textContent = focus.userData.data.title || focus.userData.data.caption || 'Un recuerdo solo para ti ♡';
    toast.classList.remove('is-hidden');
    setTimeout(() => toast.classList.add('is-hidden'), 3500);
  });
  return { get focus() { return focus; }, update: check };
}

export function setupTouch(controls) {
  const joystick = document.querySelector('#joystick');
  const knob = joystick.querySelector('.joystick-knob');
  const lookArea = document.querySelector('#look-area');
  let joystickActive = false;
  let joystickPointerId = null;
  let joystickCenter = null;
  let lastTouch = null;

  joystick.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    if (joystickActive) return;
    joystickActive = true;
    joystickPointerId = event.pointerId;
    const bounds = joystick.getBoundingClientRect();
    joystickCenter = { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 };
    joystick.setPointerCapture(event.pointerId);
    updateJoystick(event);
  });
  joystick.addEventListener('pointermove', (event) => {
    if (!joystickActive || event.pointerId !== joystickPointerId) return;
    updateJoystick(event);
  });
  function updateJoystick(event) {
    // El centro se fija al comenzar el toque y nunca sigue al mando visual.
    const radius = Math.min(joystick.clientWidth, joystick.clientHeight) * 0.5 - 21;
    let offsetX = event.clientX - joystickCenter.x;
    let offsetY = event.clientY - joystickCenter.y;
    const distance = Math.hypot(offsetX, offsetY);
    if (distance > radius) {
      const scale = radius / distance;
      offsetX *= scale;
      offsetY *= scale;
    }
    const normalizedDistance = Math.min(Math.hypot(offsetX, offsetY) / radius, 1);
    const deadZone = 0.14;
    if (normalizedDistance <= deadZone) {
      controls.joystick.x = 0;
      controls.joystick.y = 0;
      knob.style.transform = '';
      return;
    }
    const strength = (normalizedDistance - deadZone) / (1 - deadZone);
    const directionX = offsetX / radius;
    const directionY = offsetY / radius;
    controls.joystick.x = directionX * strength;
    controls.joystick.y = directionY * strength;
    knob.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  }
  const resetJoystick = (event) => {
    if (event && event.pointerId !== joystickPointerId) return;
    joystickActive = false;
    joystickPointerId = null;
    joystickCenter = null;
    knob.style.transform = '';
    controls.joystick.x = 0;
    controls.joystick.y = 0;
  };
  joystick.addEventListener('pointerup', resetJoystick);
  joystick.addEventListener('pointercancel', resetJoystick);
  joystick.addEventListener('lostpointercapture', resetJoystick);

  lookArea.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    lastTouch = { x: event.clientX, y: event.clientY };
    document.querySelector('#hint')?.classList.add('is-hidden');
    lookArea.setPointerCapture(event.pointerId);
  });
  lookArea.addEventListener('pointermove', (event) => {
    if (!lastTouch) return;
    controls.targetLook.yaw -= (event.clientX - lastTouch.x) * 0.006;
    controls.targetLook.pitch = THREE.MathUtils.clamp(controls.targetLook.pitch - (event.clientY - lastTouch.y) * 0.006, -1.42, 1.42);
    lastTouch = { x: event.clientX, y: event.clientY };
  });
  const stopLook = () => { lastTouch = null; };
  lookArea.addEventListener('pointerup', stopLook);
  lookArea.addEventListener('pointercancel', stopLook);

  document.querySelectorAll('.vertical-button').forEach((button) => {
    let activePointerId = null;
    const stop = (event) => {
      if (event && activePointerId !== null && event.pointerId !== activePointerId) return;
      activePointerId = null;
      controls.joystick.vertical = 0;
      if (event?.pointerId !== undefined && button.hasPointerCapture?.(event.pointerId)) button.releasePointerCapture(event.pointerId);
    };
    const start = (event) => {
      event.preventDefault();
      if (activePointerId !== null) return;
      activePointerId = event.pointerId;
      document.querySelector('#hint')?.classList.add('is-hidden');
      button.setPointerCapture?.(event.pointerId);
      controls.joystick.vertical = button.dataset.axis === 'up' ? 1 : -1;
    };
    button.addEventListener('pointerdown', start);
    button.addEventListener('pointerup', stop);
    button.addEventListener('pointercancel', stop);
    button.addEventListener('pointerleave', stop);
    button.addEventListener('lostpointercapture', stop);
    button.addEventListener('contextmenu', (event) => event.preventDefault());
  });
}
