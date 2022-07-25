import { ComponentStory } from '@storybook/react';
import React, { useEffect, useState } from 'react';
import { ConnectBoardRenderer, HoleType } from '../../ConnectBoardDriver';
import { ReactConnectBoard, ReactConnectBoardProps } from './ConnectBoard'

export default {
  title: 'Connect Components/ConnectBoard',
  component: ReactConnectBoard
}

const BasicTemplate: ComponentStory<typeof ReactConnectBoard> =
    (args: ReactConnectBoardProps) => (<ReactConnectBoard {...args} />);

export const DefaultConnectBoard = BasicTemplate.bind({});
const defaultOnLoad = () => {};
DefaultConnectBoard.args = {
    onLoad: defaultOnLoad,
}

export const FirstRedConnectBoard = BasicTemplate.bind({});
const firstRedOnLoad = (renderer: ConnectBoardRenderer) => {
    renderer.writeHoleValue(HoleType.Red, 0);
    renderer.flush();
};
FirstRedConnectBoard.args = {
  onLoad: firstRedOnLoad,
};

type HolePosition = [HoleType, number];

interface ManualTestComponentProps {
    holes: HolePosition[],
}

const ManualTestComponent: React.FC<ManualTestComponentProps> = (props: ManualTestComponentProps) => {
    let [renderer, setRenderer] = useState<ConnectBoardRenderer | null>(null)

    useEffect(() => {
        // We only want to process the holes in the props if the renderer is present
        if (renderer === null) {
            return
        }

        props.holes.forEach(([holeType, position]: HolePosition) => {
            // The renderer is confirmed to be not null, but the type
            // guard doesn't seem to have applied into this scope :thinking:
            renderer!.writeHoleValue(holeType, position);
        });

        renderer.flush()
    }, [props, renderer])

    return <ReactConnectBoard onLoad={setRenderer} />;
}

const ManualTestTemplate: ComponentStory<typeof ManualTestComponent> =
    (args: ManualTestComponentProps) => <ManualTestComponent {...args} />;

export const ManualTestConnectBoard = ManualTestTemplate.bind({});
ManualTestConnectBoard.args = {
    holes: [
        [HoleType.Yellow, 0],
    ],
}

interface LoopTestComponentProps {
    intervalMs: number,
}

const LoopTestComponent: React.FC<LoopTestComponentProps> = (props: LoopTestComponentProps) => {
    let [renderer, setRenderer] = useState<ConnectBoardRenderer | null>(null)
    let [position, setPosition] = useState<number>(0)

    let onIteration = () => {
        // Skip rendering this iteration if the renderer isn't present
        if (renderer === null) {
            console.log("onIteration aborting due to null renderer")
            return
        }

        const holeType = position % 2 === 0 ? HoleType.Red : HoleType.Yellow;
        renderer.writeHoleValue(holeType, position);
        renderer.flush()

        // Increment the position, wrapping around to position 0 once we reach the end
        let newPosition = position === 41 ? 0 : position + 1;
        setPosition(newPosition)
    };

    useEffect(() => {
        // We only want to process the holes in the props if the renderer is present
        if (renderer === null) {
            console.log("aborting due to null renderer")
            return
        }

        console.log("Starting iteration loop")
        setTimeout(onIteration, props.intervalMs)
    }, [props, renderer, position])

    return <ReactConnectBoard onLoad={setRenderer} />;
}

const LoopTestTemplate: ComponentStory<typeof LoopTestComponent> =
    (args: LoopTestComponentProps) => <LoopTestComponent {...args} />;

export const TestHolePropsTemplate = LoopTestTemplate.bind({});
TestHolePropsTemplate.args = {
    intervalMs: 200,
}