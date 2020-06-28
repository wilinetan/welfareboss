// import React, { Component } from "react";
// import Plot from "react-plotly.js";
// // import CanvasJS from "canvasjs";

// // var CanvasJS = CanvasJSReact.CanvasJS;
// // var CanvasJSChart = CanvasJSReact.CanvasJSChart;
// class Pie extends Component {
// 	render() {
// 		return (
// 			<Plot
// 				data={[
// 					{
// 						x: [1, 2, 3],
// 						y: [2, 6, 3],
// 						type: "scatter",
// 						mode: "lines+markers",
// 						marker: { color: "red" },
// 					},
// 					{ type: "bar", x: [1, 2, 3], y: [2, 5, 3] },
// 				]}
// 				layout={{ width: 320, height: 240, title: "A Fancy Plot" }}
// 			/>
// 		);
// 	}
// }
// // class Pie extends Component {
// // 	render() {
// // 		var data = [
// // 			{
// // 				values: [19, 26, 55],
// // 				labels: ["Residential", "Non-Residential", "Utility"],
// // 				type: "pie",
// // 			},
// // 		];

// // 		var layout = {
// // 			height: 400,
// // 			width: 500,
// // 		};
// // 		return <div>{Plotly.newPlot("myDiv", data, layout)}</div>;
// // 	}
// // }

// // class Pie extends Component {
// // 	render() {
// // 		var dataPoint;
// // 		var total;
// // 		const options = {
// // 			animationEnabled: true,
// // 			title: {
// // 				text: "Sales via Advertisement",
// // 			},
// // 			legend: {
// // 				horizontalAlign: "right",
// // 				verticalAlign: "center",
// // 				reversed: true,
// // 			},
// // 			data: [
// // 				{
// // 					type: "pyramid",
// // 					showInLegend: true,
// // 					legendText: "{label}",
// // 					indexLabel: "{label} - {y}",
// // 					toolTipContent: "<b>{label}</b>: {y} <b>({percentage}%)</b>",
// // 					dataPoints: [
// // 						{ label: "Impressions", y: 2850 },
// // 						{ label: "Clicked", y: 2150 },
// // 						{ label: "Free Downloads", y: 1900 },
// // 						{ label: "Purchase", y: 650 },
// // 						{ label: "Renewal", y: 250 },
// // 					],
// // 				},
// // 			],
// // 		};
// // 		//calculate percentage
// // 		dataPoint = options.data[0].dataPoints;
// // 		total = dataPoint[0].y;
// // 		for (var i = 0; i < dataPoint.length; i++) {
// // 			if (i == 0) {
// // 				options.data[0].dataPoints[i].percentage = 100;
// // 			} else {
// // 				options.data[0].dataPoints[i].percentage = (
// // 					(dataPoint[i].y / total) *
// // 					100
// // 				).toFixed(2);
// // 			}
// // 		}
// // 		return (
// // 			<div>
// // 				<CanvasJSChart
// // 					options={options}
// // 					/*onRef={ref => this.chart = ref}*/
// // 				/>
// // 				{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
// // 			</div>
// // 		);
// // 	}
// // }

// export default Pie;
