// Preserves the existing expanded world layout without assigning it a nucleus.
export function expandWorldPosition(position) {
  const radius = Math.hypot(position.x, position.y, position.z);
  const factor = radius < 10 ? 1.22 : radius < 20 ? 1.14 : 1.08;
  return {
    x: position.x * factor,
    y: position.y * factor,
    z: position.z * factor
  };
}
