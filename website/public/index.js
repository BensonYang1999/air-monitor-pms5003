const socket = io.connect(window.location.origin);

var xValues = []
var data_count = 0;

var history = new Chart("myChart", {
    type: "line",
    data: {
        labels: xValues,
        datasets: [{
            fill: false,
            borderColor: "rgba(255,0,0,1.0)",
        },{
            fill: false,
            borderColor: "rgba(255,140,0,1.0)",
        },{
            fill: false,
            borderColor: "rgba(255,255,0,1.0)",
        },{
            fill: false,
            borderColor: "rgba(140,255,0,1.0)",
        },{
            fill: false,
            borderColor: "rgba(0,255,0,1.0)",
        },{
            fill: false,
            borderColor: "rgba(0,255,140,1.0)",
        },{
            fill: false,
            borderColor: "rgba(0,255,255,1.0)",
        },{
            fill: false,
            borderColor: "rgba(0,0,255,1.0)",
        },{
            fill: false,
            borderColor: "rgba(110,0,255,1.0)",
        },{
            fill: false,
            borderColor: "rgba(170,0,255,1.0)",
        },{
            fill: false,
            borderColor: "rgba(255,0,255,1.0)",
        },{
            fill: false,
            borderColor: "rgba(255,0,150,1.0)",
        }]
    },
    options: {
        legend: { display: false }/*,
        scales: {
            yAxes: [{ ticks: { min: 6, max: 16 } }],
        }*/
    }
});

socket.on("new_data", data => {
    data_count += 1;
    addData(history, data_count, data)
    //history.addData(data, ++data_count)
});

function addData(chart, label, data) {
    chart.data.labels.push(label);
    /*chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });*/
    for (let i=0; i < 12; i++) {
        chart.data.datasets[i].data.push(data[i])
    }
    chart.update();
}