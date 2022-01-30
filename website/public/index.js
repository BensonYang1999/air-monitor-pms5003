const socket = io.connect(window.location.origin);

var xValues = []
var data_count = 0;

const ctx1 = document.getElementById('Chart1').getContext('2d');
const ctx2 = document.getElementById('Chart2').getContext('2d');
const chart_1 = new Chart(ctx1, {
    type: "line",
    data: {
        labels: xValues,
        datasets: [{
            label: 'PM 1.0 std',
            fill: false,
            borderColor: "rgba(255,0,0,1.0)",
        }, {
            label: 'PM 2.5 std',
            fill: false,
            borderColor: "rgba(255,140,0,1.0)",
        }, {
            label: 'PM 10 std',
            fill: false,
            borderColor: "rgba(255,255,0,1.0)",
        }, {
            label: 'PM 1.0 env',
            fill: false,
            borderColor: "rgba(140,255,0,1.0)",
        }, {
            label: 'PM 2.5 env',
            fill: false,
            borderColor: "rgba(0,255,0,1.0)",
        }, {
            label: 'PM 10 env',
            fill: false,
            borderColor: "rgba(0,255,140,1.0)",
        }/*, {
            label: 'Particles > 0.3um (/100)',
            fill: false,
            borderColor: "rgba(0,255,255,1.0)",
        }, {
            label: 'Particles > 0.5um (/100)',
            fill: false,
            borderColor: "rgba(0,0,255,1.0)",
        }, {
            label: 'Particles > 1.0um (/10)',
            fill: false,
            borderColor: "rgba(110,0,255,1.0)",
        }, {
            label: 'Particles > 2.5um',
            fill: false,
            borderColor: "rgba(170,0,255,1.0)",
        }, {
            label: 'Particles > 5.0um',
            fill: false,
            borderColor: "rgba(255,0,255,1.0)",
        }, {
            label: 'Particles > 10.0 um',
            fill: false,
            borderColor: "rgba(255,0,150,1.0)",
        }*/]
    },
    options: {
        legend: { display: false }/*,
        scales: {
            yAxes: [{ ticks: { min: 6, max: 16 } }],
        },
        plugins: {
            zoom: {
                zoom: {
                    wheel: {
                        enabled: true,
                    },
                    pinch: {
                        enabled: true
                    },
                    mode: 'xy',
                }
            }
        }*/
    }
});
const chart_2 = new Chart(ctx2, {
    type: "line",
    data: {
        labels: xValues,
        datasets: [/*{
            label: 'PM 1.0 std',
            fill: false,
            borderColor: "rgba(255,0,0,1.0)",
        }, {
            label: 'PM 2.5 std',
            fill: false,
            borderColor: "rgba(255,140,0,1.0)",
        }, {
            label: 'PM 10 std',
            fill: false,
            borderColor: "rgba(255,255,0,1.0)",
        }, {
            label: 'PM 1.0 env',
            fill: false,
            borderColor: "rgba(140,255,0,1.0)",
        }, {
            label: 'PM 2.5 env',
            fill: false,
            borderColor: "rgba(0,255,0,1.0)",
        }, {
            label: 'PM 10 env',
            fill: false,
            borderColor: "rgba(0,255,140,1.0)",
        }, */{
            label: 'Particles > 0.3um (/100)',
            fill: false,
            borderColor: "rgba(0,255,255,1.0)",
        }, {
            label: 'Particles > 0.5um (/100)',
            fill: false,
            borderColor: "rgba(0,0,255,1.0)",
        }, {
            label: 'Particles > 1.0um (/10)',
            fill: false,
            borderColor: "rgba(110,0,255,1.0)",
        }, {
            label: 'Particles > 2.5um',
            fill: false,
            borderColor: "rgba(170,0,255,1.0)",
        }, {
            label: 'Particles > 5.0um',
            fill: false,
            borderColor: "rgba(255,0,255,1.0)",
        }, {
            label: 'Particles > 10.0 um',
            fill: false,
            borderColor: "rgba(255,0,150,1.0)",
        }]
    },
    options: {
        legend: { display: false }/*,
        scales: {
            yAxes: [{ ticks: { min: 6, max: 16 } }],
        },
        plugins: {
            zoom: {
                zoom: {
                    wheel: {
                        enabled: true,
                    },
                    pinch: {
                        enabled: true
                    },
                    mode: 'xy',
                }
            }
        }*/
    }
});

socket.on("new_data", data => {
    data_count += 1;
    xValues.push(data_count);
    addData(chart_1, data_count, data.slice(0, 6));
    addData(chart_2, data_count, data.slice(6, 12));
    //history.addData(data, ++data_count)
});

function addData(chart, label, data) {
    //chart.data.labels.push(label);
    /*chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });*/
    for (let i = 0; i < 6; i++) {
        chart.data.datasets[i].data.push(data[i])
    }
    chart.update();
}