import axios from "axios";
import React from "react";
import { Line, Pie } from 'react-chartjs-2';
import { useSelector } from "react-redux";

// components

// import CardLineChart from "components/Cards/CardLineChart.js";
// import CardBarChart from "components/Cards/CardBarChart.js";
// import CardPageVisits from "components/Cards/CardPageVisits.js";
// import CardSocialTraffic from "components/Cards/CardSocialTraffic.js";

export default function Dashboard() {

  const { token } = useSelector(state => state.auth)

  const [lineLabels, setLineLabels] = React.useState([]);
  const [lineData, setLineData] = React.useState([]);
  const [pieLabels, setPieLabels] = React.useState([]);
  const [pieData, setPieData] = React.useState([]);

  const fetchCharts = () => {
    axios.get('/dashboard/charts', {
      headers: {
        Authorization: token
      }
    }).then(response => {
      setLineLabels(response.data?.items?.line?.labels);
      setLineData(response.data?.items?.line?.data)
      setPieLabels(response.data?.items?.pie?.labels)
      setPieData(response.data?.items?.pie?.data)
    }).catch(errors => {
      console.log(errors);
    })
  }


  React.useEffect(() => {
    if(token != '')
      {
        fetchCharts();
      }
  }, [token]);

  const LineChartData = {
    labels: lineLabels,
    datasets: [
            {
            label: '# of Sales',
            data: lineData,
            fill: false,
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgba(255, 99, 132, 0.2)',
            },
        ],
};

const PieChartData = {
    labels: pieLabels,
    datasets: [
        {
        data: pieData,
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
        },
    ],
};

  return (
    <>
      <div className="flex flex-wrap p-4">
        <div className="w-full flex -mx-1">
          <div className="w-2/4 mx-1">
            <div className="card">
              <div className="border-b">
                <div className="card-header">
                    <div>
                        <h4 className="pageHeading">Sales Chart</h4>
                    </div>
                </div>
              </div>
              <div className="card-body">
                <Line data={LineChartData} />
              </div>
            </div>
          </div>
          <div className="w-1/4 mx-1">
            <div className="card">
              <div className="border-b">
                <div className="card-header">
                    <div>
                        <h4 className="pageHeading">Top Selling Product</h4>
                    </div>
                </div>
              </div>
              <div className="card-body flex justify-center">
                <Pie data={PieChartData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
