import * as fs from 'fs';

const columns = 3;
const width = 600;
const columnGap = 0;

const sourceFile = process.argv[2];
const source = fs.readFileSync(sourceFile, 'utf8');

const length = source.length;
const itemsPerColumn = Math.floor(length / columns);
const columnWidth = Math.floor(((width - (columnGap * (columns - 1))) / columns));
const letterWidth = Math.floor(columnWidth / 4);

const map = Object.freeze({
  A: new Array(length).fill(false),
  C: new Array(length).fill(false),
  G: new Array(length).fill(false),
  T: new Array(length).fill(false),
});

for (let i = 0; i < length; ++i) {
  const letter = source[i];
  map[letter][i] = true;
}

function lineAtPosition(_, pos) {
  const column = Math.floor(pos / itemsPerColumn);
  let xOffset = (column * columnWidth) + (column * columnGap);
  let yOffset = pos - (column * itemsPerColumn);
  let color;

  if (map.A[pos]) {
    color = 'red';
  } else if (map.C[pos]) {
    xOffset += letterWidth;
    color = 'green';
  } else if (map.G[pos]) {
    xOffset += letterWidth * 2;
    color = 'blue';
  } else {
    xOffset += letterWidth * 3;
    color = 'black';
  }
  
  return `<line x1="${xOffset}" y1="${yOffset}" x2="${xOffset + letterWidth}" y2="${yOffset}" />`
}

let svg =
  `<svg viewBox="0 0 ${width} ${itemsPerColumn}" xmlns="http://www.w3.org/2000/svg" stroke="black"><g>` +
    [...Array(length)].map(lineAtPosition).join('') +
  '</g></svg>'

fs.writeFileSync('./output.svg', svg);
