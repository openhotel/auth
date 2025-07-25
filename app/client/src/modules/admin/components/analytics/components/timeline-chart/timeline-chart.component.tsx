import React, { useEffect, useMemo, useState } from "react";
import {
  VictoryAxis,
  VictoryChart,
  VictoryGroup,
  VictoryLegend,
  VictoryLine,
  VictoryTheme,
} from "victory";
import { useAdmin } from "shared/hooks";
import dayjs, { Dayjs } from "dayjs";

const CustomTickLabel = ({ x, y, text, ...rest }) => (
  <g transform={`translate(${x},${y})`}>
    <text
      transform="rotate(-30)"
      textAnchor="end"
      dy="0.3em"
      style={{ fontSize: 6, fill: "currentColor" }}
    >
      {text}
    </text>
  </g>
);

const CUSTOM_DARK_THEME = {
  ...VictoryTheme.grayscale, // Start with the grayscale theme
  axis: {
    ...VictoryTheme.grayscale.axis,
    style: {
      ...VictoryTheme.grayscale.axis.style,
      axis: {
        ...VictoryTheme.grayscale.axis.style.axis,
        stroke: "currentColor", // White axis lines
      },
      tickLabels: {
        ...VictoryTheme.grayscale.axis.style.tickLabels,
        fill: "currentColor", // White tick labels
      },
      grid: {
        ...VictoryTheme.grayscale.axis.style.grid,
        stroke: "currentColor", // Darker grid lines
        opacity: 0.125,
      },
    },
  },
} as typeof VictoryTheme.grayscale;

type Props = {
  startDate: Dayjs;
  dateRange: string[];
};

export const TimelineChartComponent: React.FC<Props> = ({
  startDate,
  dateRange,
}) => {
  const { users, hotels } = useAdmin();

  const [usersData, setUsersData] = useState([]);
  const [hotelsData, setHotelsData] = useState([]);

  useEffect(() => {
    if (!users.length) return;
    const usersSorted = users
      .sort((userA, userB) => userA.createdAt - userB.createdAt)
      .map((user) => ({
        ...user,
        _createdAt: dayjs(user.createdAt).format("YYYY/MM/DD"),
      }));

    const firstRegisteredUser = usersSorted[0];
    const startDate = dayjs(firstRegisteredUser.createdAt);

    const dateRange = [];
    for (let i = 0; i <= dayjs().diff(startDate, "day"); i++)
      dateRange.push(startDate.add(i, "day").format("YYYY/MM/DD"));

    setUsersData(
      dateRange.reduce(
        (data, day, index) => [
          ...data,
          (data[index - 1] ?? 0) +
            usersSorted.filter((user) => day === user._createdAt).length,
        ],
        [],
      ),
    );
  }, [users, setUsersData]);

  useEffect(() => {
    if (!hotels.length || !dateRange.length) return;

    setHotelsData(
      dateRange.reduce(
        (data, day, index) => [
          ...data,
          (data[index - 1] ?? 0) +
            hotels.filter(
              (hotel) => day === dayjs(hotel.createdAt).format("YYYY/MM/DD"),
            ).length,
        ],
        [],
      ),
    );
  }, [hotels, dateRange, setHotelsData]);

  const series = useMemo(
    () => [
      {
        name: "Users",
        data: usersData,
      },
      {
        name: "Hotels",
        data: hotelsData,
      },
    ],
    [usersData, hotelsData],
  );

  const domain = useMemo(
    () => ({
      y: [0, Math.max(...series.map((serie) => serie.data.pop())) + 50],
    }),
    [series],
  );

  return (
    <VictoryChart
      theme={CUSTOM_DARK_THEME}
      //@ts-ignore
      domain={domain}
      height={200}
      padding={{ top: 10, bottom: 40, left: 40, right: 0 }}
    >
      <VictoryAxis
        tickValues={dateRange}
        tickFormat={(date) => {
          return dayjs(date).date() === 1 ||
            date === startDate.format("YYYY/MM/DD") ||
            date === dayjs().format("YYYY/MM/DD")
            ? date
            : null;
        }}
        //@ts-ignore
        tickLabelComponent={<CustomTickLabel />}
      />
      {/*@ts-ignore*/}
      <VictoryAxis
        dependentAxis
        style={{
          tickLabels: {
            fontSize: 6,
          },
          grid: {
            stroke: "currentColor",
            size: 5,
          },
        }}
      />
      {series.map((serie, i) => (
        <VictoryGroup data={serie.data} key={serie.name}>
          <VictoryLine
            style={{
              data: {
                stroke: ["#e546c0", "#67be31"][i],
                strokeWidth: 1,
              },
            }}
          />
        </VictoryGroup>
      ))}
      <VictoryLegend
        x={20}
        y={190}
        orientation="horizontal"
        data={[
          { name: `Users (${users.length})`, symbol: { fill: "#e546c0" } },
          { name: `Hotels (${hotels.length})`, symbol: { fill: "#67be31" } },
        ]}
        style={{
          labels: { fill: "currentColor", fontSize: 6 },
        }}
        standalone={false}
      />
    </VictoryChart>
  );
};
