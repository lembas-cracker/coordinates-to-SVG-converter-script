function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function toFixed(value: number, precision: number): number {
  const factor = Math.pow(10, precision);
  return Math.round(value * factor) / factor;
}

function vectorToPoint(initialX: number, initialY: number, length: number, angle: number): { x: number; y: number } {
  const x = initialX + Math.cos(degreesToRadians(angle)) * length;
  const y = initialY + Math.sin(degreesToRadians(angle)) * length;
  return {
    x: toFixed(x, 2),
    y: toFixed(y, 2),
  };
}

function vectorsToPoints(vectors: [number, number][]): { x: number; y: number }[] {
  let initialX = 0;
  let initialY = 0;
  const points: { x: number; y: number }[] = [{ x: 0, y: 0 }];

  for (const [length, angle] of vectors) {
    const { x, y } = vectorToPoint(initialX, initialY, length, angle);
    initialX = x;
    initialY = y;
    points.push({ x, y });
  }

  return points;
}

function pointMmToCm(point: { x: number; y: number }): { x: number; y: number } {
  return {
    x: point.x / 10,
    y: point.y / 10,
  };
}

// Я спросила про проблему с ориентацией фигуры и не получила ответа.
// Проблема:
// Фигура выходит в ориентации отличной от фигуры на картинке, потому что начальная точка фигуры, указанной в задании, видимо, начинается в нижнем правом углу,
// но по стандарту SVG начальная точка должна быть в верхнем левом углу,
// поэтому я сделала по стандарту и теперь ее необходимо перевернуть горизонтально и вертикально, чтобы получилось, как на картинке
// Вывожу внизу оба варианта: полученные координаты и перевернутые координаты, совпадающие с картинкой из задания

function mirrorAndFlip(points: { x: number; y: number }[]): { x: number; y: number }[] {
  // находим измерения bounding box (ширина и высота)
  const minX = Math.min(...points.map(({ x }) => x));
  const maxX = Math.max(...points.map(({ x }) => x));
  const minY = Math.min(...points.map(({ y }) => y));
  const maxY = Math.max(...points.map(({ y }) => y));
  const width = maxX - minX;
  const height = maxY - minY;

  return points.map(({ x, y }) => ({ x: toFixed(width - x, 2), y: toFixed(height - y, 2) }));
}

// Переводим координаты в строку SVG path
function pointsToSvgPath(points: { x: number; y: number }[]): string {
  return "M " + points.map(({ x, y }) => `${x} ${y}`).join(" L ") + " Z";
}

const vectors: [number, number][] = [
  [1665, 0],
  [947, 90],
  [557, 0],
  [1300, 90],
  [2225, 180],
  [2239, 270],
];

const points = vectorsToPoints(vectors).map(pointMmToCm);

console.log("Points:", points.map(({ x, y }) => `${x} ${y}`).join(" "));
console.log("Path:", pointsToSvgPath(points));

// Переворачиваем координаты горизонтально и вертикально
const mirroredPoints = mirrorAndFlip(points);
console.log("Mirrored points:", mirroredPoints.map(({ x, y }) => `${x} ${y}`).join(" "));
console.log("Mirrored path:", pointsToSvgPath(mirrorAndFlip(points)));
