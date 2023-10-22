// // Charts.js
// import React from "react";
// import { Line, Chart } from "react-chartjs-2";
// import "chartjs-adapter-react-17";

// const Charts = () => {
//   const data = {
//     labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
//     datasets: [
//       {
//         label: "Attendance",
//         data: [30, 50, 40, 60, 70, 80],
//         fill: false,
//         borderColor: "rgb(75, 192, 192)",
//         tension: 0.1,
//       },
//     ],
//   };

//   const options = {
//     scales: {
//       y: {
//         beginAtZero: true,
//         max: 100,
//       },
//     },
//   };

//   return (
//     <div className="charts">
//       <h2>Charts</h2>
//       <Line data={data} options={options} />
//     </div>
//   );
// };

// export default Charts;
