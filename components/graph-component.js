import React, { PureComponent } from 'react';
   // install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/bar
import { ResponsiveBar } from 'nivo';
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

class GraphComponent extends PureComponent {
    constructor(props) {
        super(props);
    }

  render() {
    const data = [
      {
        "country": "AD",
        "hot dog": 73,
        "hot dogColor": "hsl(219, 70%, 50%)",
        "burger": 145,
        "burgerColor": "hsl(44, 70%, 50%)",
        "sandwich": 4,
        "sandwichColor": "hsl(333, 70%, 50%)",
        "kebab": 65,
        "kebabColor": "hsl(78, 70%, 50%)",
        "fries": 67,
        "friesColor": "hsl(19, 70%, 50%)",
        "donut": 109,
        "donutColor": "hsl(167, 70%, 50%)"
      },
      {
        "country": "AE",
        "hot dog": 30,
        "hot dogColor": "hsl(124, 70%, 50%)",
        "burger": 188,
        "burgerColor": "hsl(321, 70%, 50%)",
        "sandwich": 164,
        "sandwichColor": "hsl(8, 70%, 50%)",
        "kebab": 63,
        "kebabColor": "hsl(140, 70%, 50%)",
        "fries": 108,
        "friesColor": "hsl(2, 70%, 50%)",
        "donut": 141,
        "donutColor": "hsl(128, 70%, 50%)"
      },
      {
        "country": "AF",
        "hot dog": 107,
        "hot dogColor": "hsl(73, 70%, 50%)",
        "burger": 181,
        "burgerColor": "hsl(64, 70%, 50%)",
        "sandwich": 57,
        "sandwichColor": "hsl(281, 70%, 50%)",
        "kebab": 183,
        "kebabColor": "hsl(90, 70%, 50%)",
        "fries": 81,
        "friesColor": "hsl(170, 70%, 50%)",
        "donut": 183,
        "donutColor": "hsl(110, 70%, 50%)"
      },
      {
        "country": "AG",
        "hot dog": 37,
        "hot dogColor": "hsl(71, 70%, 50%)",
        "burger": 80,
        "burgerColor": "hsl(79, 70%, 50%)",
        "sandwich": 93,
        "sandwichColor": "hsl(60, 70%, 50%)",
        "kebab": 2,
        "kebabColor": "hsl(236, 70%, 50%)",
        "fries": 126,
        "friesColor": "hsl(44, 70%, 50%)",
        "donut": 91,
        "donutColor": "hsl(83, 70%, 50%)"
      },
      {
        "country": "AI",
        "hot dog": 139,
        "hot dogColor": "hsl(346, 70%, 50%)",
        "burger": 143,
        "burgerColor": "hsl(196, 70%, 50%)",
        "sandwich": 98,
        "sandwichColor": "hsl(262, 70%, 50%)",
        "kebab": 41,
        "kebabColor": "hsl(211, 70%, 50%)",
        "fries": 66,
        "friesColor": "hsl(256, 70%, 50%)",
        "donut": 9,
        "donutColor": "hsl(186, 70%, 50%)"
      },
      {
        "country": "AL",
        "hot dog": 185,
        "hot dogColor": "hsl(339, 70%, 50%)",
        "burger": 137,
        "burgerColor": "hsl(10, 70%, 50%)",
        "sandwich": 171,
        "sandwichColor": "hsl(89, 70%, 50%)",
        "kebab": 68,
        "kebabColor": "hsl(263, 70%, 50%)",
        "fries": 147,
        "friesColor": "hsl(10, 70%, 50%)",
        "donut": 4,
        "donutColor": "hsl(300, 70%, 50%)"
      },
      {
        "country": "AM",
        "hot dog": 40,
        "hot dogColor": "hsl(280, 70%, 50%)",
        "burger": 141,
        "burgerColor": "hsl(285, 70%, 50%)",
        "sandwich": 193,
        "sandwichColor": "hsl(207, 70%, 50%)",
        "kebab": 169,
        "kebabColor": "hsl(18, 70%, 50%)",
        "fries": 140,
        "friesColor": "hsl(212, 70%, 50%)",
        "donut": 17,
        "donutColor": "hsl(84, 70%, 50%)"
      }
    ];

    return (
    <ResponsiveBar
        data={data}
        keys={[ 'hot dog', 'burger', 'sandwich', 'kebab', 'fries', 'donut' ]}
        indexBy="country"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={{ scheme: 'nivo' }}
        defs={[
            {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: '#38bcb2',
                size: 4,
                padding: 1,
                stagger: true
            },
            {
                id: 'lines',
                type: 'patternLines',
                background: 'inherit',
                color: '#eed312',
                rotation: -45,
                lineWidth: 6,
                spacing: 10
            }
        ]}
        fill={[
            {
                match: {
                    id: 'fries'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'sandwich'
                },
                id: 'lines'
            }
        ]}
        borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'country',
            legendPosition: 'middle',
            legendOffset: 32
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'food',
            legendPosition: 'middle',
            legendOffset: -40
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
        legends={[
            {
                dataFrom: 'keys',
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
    />
    );
  }
}

export default GraphComponent;