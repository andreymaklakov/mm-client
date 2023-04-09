function random(min, max) {
  return Math.round(min - 0.5 + Math.random() * (max - min + 1));
}

export function getRandomColor() {
  const random1 = random(0, 255);
  const random2 = random(0, 255);
  const random3 = random(0, 255);

  return `rgb(${random1}, ${random2}, ${random3})`;
}
