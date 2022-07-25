import React, { useEffect, useState } from 'react';
import Canvas from './Canvas';
import Image from './Image';
import imageBoard from './static/board.png';
import imageRed from './static/red.png';
import imageYellow from './static/yellow.png';
import { ConnectBoardRenderer, HoleType } from '../../ConnectBoardDriver';
import { SimpleSpread } from './common';

type Coordinate = [number, number];

const imageHolePositions: Coordinate[] = [
  // Row 0
  [285, 333], // Position 0, Column 0
  [318, 330], // Position 1, Column 1
  [351, 327], // Position 2, Column 2
  [384, 324], // Position 3, Column 3
  [417, 321], // Position 4, Column 4
  [450, 318], // Position 5, Column 5
  [483, 315], // Position 6, Column 6
  // Row 1
  [283, 377.5], // Position 7, Column 0
  [317, 374.5], // Position 8, Column 1
  [350.3, 371.5], // Position 9, Column 2
  [383.5, 368.5], // Position 10, Column 3
  [416.6, 365], // Position 11, Column 4
  [449.6, 362.5], // Position 12, Column 5
  [482, 358], // Position 13, Column 6
  // Row 2
  [284, 424], // Position 14, Column 0
  [316, 419], // Position 15, Column 1
  [350, 416], // Position 16, Column 2
  [383, 413], // Position 17, Column 3
  [416.7, 406], // Position 18, Column 4
  [449.6, 405.5], // Position 19, Column 5
  [482, 399], // Position 20, Column 6
  // Row 3
  [282, 467.5], // Position 21, Column 0
  [317, 463.5], // Position 22, Column 1
  [349, 460.5], // Position 23, Column 2
  [383.5, 454.5], // Position 24, Column 3
  [416.6, 451], // Position 25, Column 4
  [450, 447], // Position 26, Column 5
  [480.8, 442], // Position 27, Column 6
  // Row 4
  [283, 512], // Position 28, Column 0
  [317, 508], // Position 29, Column 1
  [349, 502], // Position 30, Column 2
  [385, 498], // Position 31, Column 3
  [416.9, 493], // Position 32, Column 4
  [450.5, 489], // Position 33, Column 5
  [480.8, 484], // Position 34, Column 6
  // Row 5
  [283, 556], // Position 35, Column 0
  [318, 550], // Position 36, Column 1
  [349.5, 545], // Position 37, Column 2
  [384.8, 539], // Position 38, Column 3
  [417.5, 535], // Position 39, Column 4
  [451, 527], // Position 40, Column 5
  [480, 523], // Position 41, Column 6
];

interface HoleTypeMap {
  [HoleType.Red]: HTMLImageElement,
  [HoleType.Yellow]: HTMLImageElement,
}

class ReactConnectBoardRenderer implements ConnectBoardRenderer {
  private canvas: HTMLCanvasElement;

  private boardImg: HTMLImageElement;

  private redImg: HTMLImageElement;

  private yellowImg: HTMLImageElement;

  private canvasContext: CanvasRenderingContext2D;

  private holeBuffer: Record<number, HoleType> = {};

  private holeTypeMap: HoleTypeMap;

  private positionMap: Coordinate[];

  constructor(canvas: HTMLCanvasElement, boardImg: HTMLImageElement, redImg: HTMLImageElement, yellowImg: HTMLImageElement) {
    // HTML Elements
    this.canvas = canvas;
    this.boardImg = boardImg;
    this.redImg = redImg;
    this.yellowImg = yellowImg;

    // Initialize reference maps
    this.holeTypeMap = {
      [HoleType.Red]: this.redImg,
      [HoleType.Yellow]: this.yellowImg,
    };

    this.positionMap = imageHolePositions;

    // Try to initialize the canvas
    const context = this.canvas.getContext('2d');
    if (context === null) {
      throw 'failed to initialize context';
    }
    this.canvasContext = context;

    // Initialize the board
    this.resetHoleBuffer();

    // Draw the board to finish initialization
    this.resetBoard();
  }

  writeHoleValue(value: HoleType, position: number): void {
    this.holeBuffer[position] = value;
  }

  resetBoard() {
    this.canvasContext.drawImage(this.boardImg, 0, 0);
  }

  resetHoleBuffer() {
    this.holeBuffer = {};
  }

  flush() {
    // Reset the board first so that we have a clean slate to draw on. This enables us
    // to not need a specific image for rendering an empty hole.
    this.resetBoard();

    // Now iterate over the buffer of holes we were told to write
    Object.entries(this.holeBuffer).forEach(([posString, value]: [string, HoleType]) => {
      // We don't draw anything for empty holes
      if (value === HoleType.Empty) {
        return;
      }

      // Have to reparse the position value into a number because javascript objects are stupid
      const position = parseInt(posString);

      // convert HoleType into the image to render
      const img = this.holeTypeMap[value];

      // convert position to image coordinates
      const coordinate = this.positionMap[position];
      if (coordinate === undefined) {
        console.error(`Attempted to access invalid board hole: ${position}`);
        return;
      }
      const [x, y] = coordinate;

      // Draw the hole image
      this.canvasContext.drawImage(img, x, y);
    });

    // Reset the hole buffer now that we've written everything
    this.resetHoleBuffer();
  }
}

interface CustomConnectBoardProps {
  onLoad: (renderer: ReactConnectBoardRenderer) => void
}

export type ReactConnectBoardProps = SimpleSpread<React.HTMLAttributes<HTMLElement>, CustomConnectBoardProps>

export const ReactConnectBoard: React.FC<ReactConnectBoardProps> = (props: ReactConnectBoardProps) => {
  const { onLoad, ...elemProps } = props;
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const [redImgRef, setRedImgRef] = useState<HTMLImageElement | null>(null);
  const [yellowImgRef, setYellowImgRef] = useState<HTMLImageElement | null>(null);
  const [boardImgRef, setBoardImgRef] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!canvasRef || !boardImgRef || !redImgRef || !yellowImgRef) {
      return;
    }

    const renderer = new ReactConnectBoardRenderer(canvasRef, boardImgRef, redImgRef, yellowImgRef);
    onLoad(renderer);
  }, [canvasRef, boardImgRef, redImgRef, yellowImgRef]);

  return (
    <div {...elemProps}>
      <Canvas id="board-canvas" width={720} height={715} onReady={setCanvasRef} />
      <Image src={imageBoard} style={{ display: 'none' }} onLoad={setBoardImgRef} />
      <Image src={imageRed} style={{ display: 'none' }} onLoad={setRedImgRef} />
      <Image src={imageYellow} style={{ display: 'none' }} onLoad={setYellowImgRef} />
    </div>
  );
};
