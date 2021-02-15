// JavaScript Document

var miVal;
var xVal;
var opsList = ["eq", "geq", "leq", "less", "more"];
$('#eqAns').hide();
$('#geqAns').hide();
$('#leqAns').hide();
$('#lessAns').hide();
$('#moreAns').hide();

$('#eqGuide').hide();
$('#geqGuide').hide();
$('#leqGuide').hide();
$('#lessGuide').hide();
$('#moreGuide').hide();
showGuide();

function factorial(n) {
    if (n == 0) {
        return 1;
    }
    return n * factorial(n - 1);
}

function calculate(mi, x) {
    return (Math.pow(Math.E, -mi) * Math.pow(mi, x)) / factorial(x);
}

function setValues() {
    miVal = parseInt($('#valueMi').val());
    xVal = parseInt($('#valueX').val());

    if ($('#valueMi').val() == "" || $('#valueX').val() == "") {
        alert("Los valores ingresados estan incompletos");
    } else if (miVal > 100 || xVal > 100) {
        alert("Los valores ingresados deben ser menores a 100");
    } else if (miVal < 1) {
        alert("mu debe ser mayor a 0");
    } else if (xVal < 0) {
        alert("Los valores deben ser mayores a 0");
    } else {

        if (miVal != parseFloat($('#valueMi').val())) {
            alert("Solo se tomara el valor entero de (Miú)");
        }

        if (xVal != parseFloat($('#valueX').val())) {
            alert("Solo se tomara el valor entero de X");
        }

        for (var i = 0; i < opsList.length; i++) {
            if ($('#valueOperator').val() == opsList[i]) {
                $('#' + opsList[i] + 'Ans').show();
            } else {
                $('#' + opsList[i] + 'Ans').hide();
            }
        }

        switch ($('#valueOperator').val()) {
            case "eq":
                res = Math.round((calculate(miVal, xVal) + Number.EPSILON) * 100000000) / 100000000
                break;
            case "geq":
                res = 0;
                for (var i = 0; i < xVal; i++) {
                    res += calculate(miVal, i);
                }
                res = 1 - res;
                res = Math.round((res + Number.EPSILON) * 100000000) / 100000000
                break;
            case "leq":
                res = 0;
                for (var i = 0; i <= xVal; i++) {
                    res += calculate(miVal, i);
                }
                res = Math.round((res + Number.EPSILON) * 100000000) / 100000000
                break;
            case "less":
                res = 0;
                for (var i = 0; i < xVal; i++) {
                    res += calculate(miVal, i);
                }
                res = Math.round((res + Number.EPSILON) * 100000000) / 100000000
                break;
            case "more":
                res = 0;
                for (var i = 0; i <= xVal; i++) {
                    res += calculate(miVal, i);
                }
                res = 1 - res;
                res = Math.round((res + Number.EPSILON) * 100000000) / 100000000
                break;
            default:
                res = 0;
                break;
        }

        $('#res').html(res + " = " + Math.round(res * 100000000) / 1000000 + "%");
        $('#miuVal').html(xVal);

        printgraph();
    }
}

function showGuide() {
    for (var i = 0; i < opsList.length; i++) {
        if ($('#valueOperator').val() == opsList[i]) {
            $('#' + opsList[i] + 'Guide').show();
            //alert("Show "+opsList[i]+"Ans ");
        } else {
            $('#' + opsList[i] + 'Guide').hide();
            //alert("Hide "+opsList[i]+"Ans ");
        }
    }
}

function printgraph() {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var chart = am4core.create("chartdiv", am4charts.XYChart);

    for (var i = 0; i < (miVal < 4 ? miVal + miVal * 4 : miVal < 50 ? miVal + miVal : miVal + miVal / 3); i++) {

        chart.data.push({
            "ax": i,
            "ay": calculate(miVal, i),
        });
    }

    // Create axes
    var valueAxisX = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxisX.title.text = 'x';
    valueAxisX.renderer.minGridDistance = 40;
    valueAxisX.step = 1;

    var title = chart.titles.create();
    title.text = "Gráfica de la distribución de Poisson con (Miú) = " + miVal;
    title.fontSize = 15;

    // Create value axis
    var valueAxisY = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxisY.title.text = 'P(X=x)';

    // Create series
    var lineSeries = chart.series.push(new am4charts.LineSeries());
    lineSeries.dataFields.valueY = "ay";
    lineSeries.dataFields.valueX = "ax";
    lineSeries.strokeOpacity = 0;

    // Add a bullet
    var bullet = lineSeries.bullets.push(new am4charts.Bullet());

    // Add a triangle to act as am arrow
    var arrow = bullet.createChild(am4core.Circle);
    arrow.horizontalCenter = "middle";
    arrow.verticalCenter = "middle";
    arrow.strokeWidth = 0;
    arrow.fill = chart.colors.getIndex(0);
    arrow.direction = "top";
    arrow.width = 12;
    arrow.height = 12;

    //scrollbars
    chart.scrollbarX = new am4core.Scrollbar();
    chart.scrollbarY = new am4core.Scrollbar();

}; // end am4core.ready()


