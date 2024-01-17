
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function updateChart() {
    var categoriesInput = document.getElementById('categories').value;
    var valuesInput = document.getElementById('values').value;
    var chartType = document.getElementById('chartType').value;

    var categories = categoriesInput.split(',').map(item => item.trim());
    var values = valuesInput.split(',').map(item => parseFloat(item.trim()));

    var backgroundColors = chartType === 'area' ? getRandomColor() : Array.from({ length: values.length }, () => getRandomColor());

    if (myChart) {
        myChart.destroy();
    }

    var ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: chartType === 'area' ? 'line' : chartType,
        data: {
            labels: categories,
            datasets: [{
                label: 'Datos del Usuario',
                data: values,
                backgroundColor: chartType === 'area' ? backgroundColors : backgroundColors,
                borderColor: backgroundColors,
                borderWidth: 1,
                fill: chartType === 'area',
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
                datalabels: {
                    display: true,
                    anchor: 'end',
                    align: 'top',
                    backgroundColor: function(context) {
                        return context.dataset.borderColor;
                    },
                    borderRadius: 4,
                    color: 'white',
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true
            }
        }
    });
}


    function exportAsImage() {
        html2canvas(document.getElementById('myChart')).then(function(canvas) {
            var link = document.createElement('a');
            link.href = canvas.toDataURL();
            link.download = 'chart.png';
            link.click();
        });
    }

    function loadCSV() {
        var fileInput = document.getElementById('csvInput');
        var file = fileInput.files[0];

        Papa.parse(file, {
            header: false,
            skipEmptyLines: true,
            complete: function(results) {
                var data = results.data;
                var categories = data.map(row => row[0]);
                var values = data.map(row => parseFloat(row[1]));

                document.getElementById('categories').value = categories.join(', ');
                document.getElementById('values').value = values.join(', ');

                updateChart();
            }
        });
    }

    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart;
    updateChart();
