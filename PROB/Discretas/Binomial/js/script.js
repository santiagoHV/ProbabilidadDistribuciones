// JavaScript Document

var valueN;
var valueP;
var valueY;
var res;
var opsList = ["eq", "geq", "leq", "less", "more"];

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

function combination(n, y) {
    return (factorial(n) / (factorial(y) * factorial(n - y)));
}

function calculate(n, p, y) {
    return combination(n, y) * Math.pow(p, y) * Math.pow(1 - p, n - y);
}

function setValues() {
    valueN = parseInt($('#valueN').val());
    valueP = parseFloat($('#valueP').val());
    valueY = parseInt($('#valueY').val());
    $('#eq').hide();

    if (valueN == "" || valueP == "" || valueY == "") {
        alert("Los valores ingresados estan incompletos");
        $('#eq').hide();
    } else if (valueN <0 || valueY < 0) {
        alert("El valor de n y y debe ser mayor que 0");
        $('#eq').hide();
    } else if (valueY > valueN) {
        alert("El valor de y debe ser menor o igual al de n");
        $('#eq').hide();
    } else if (valueP > 1 || valueP < 0) {
        alert("El valor de p debe estar entre 0 y 1");
        $('#eq').hide();
    } else {

        if (valueN != parseFloat($('#valueN').val())) {
            alert("Solo se tomara el valor entero de (n)");
        }

        if (valueY != parseFloat($('#valueY').val())) {
            alert("Solo se tomara el valor entero de (y)");
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

                res = calculate(valueN, valueP, valueY);
                res = Math.round((res + Number.EPSILON) * 10000) / 10000
                $('#eq').html("$$P(Y=" + valueY + ")= \\displaystyle\\binom{" + valueN + "}{" + valueY + "} * " + valueP + "^{" + valueY + "} * (1 - " + valueP + ")^{" + valueN + "-" + valueY + "} = " + res + " = " + (res * 100) + "\\%$$");
                break;
            case "geq":
                res = 0;
                var str = "";
                for (var i = 0; i < valueY; i++) {
                    res += calculate(valueN, valueP, i);
                    str += "P(Y=" + i + ")+";
                }
                str = str.substr(0, str.length - 1);
                res = 1 - res;
                res = Math.round((res + Number.EPSILON) * 10000) / 10000
                $('#eq').html("$$P(Y\\geq" + valueY + ") = 1-(" + str + ") = " + res + " = " + (res * 100) + "\\%$$");
                break;
            case "leq":
                res = 0;
                var str = "";
                for (var i = 0; i <= valueY; i++) {
                    res += calculate(valueN, valueP, i);
                    str += "P(Y=" + i + ")+";
                }
                str = str.substr(0, str.length - 1);
                res = Math.round((res + Number.EPSILON) * 10000) / 10000
                $('#eq').html("$$P(Y\\leq" + valueY + ") = (" + str + ") = " + res + " = " + (res * 100) + "\\%$$");
                break;
            case "less":
                res = 0;
                var str = "";
                for (var i = 0; i < valueY; i++) {
                    res += calculate(valueN, valueP, i);
                    str += "P(Y=" + i + ")+";
                }
                str = str.substr(0, str.length - 1);
                res = Math.round((res + Number.EPSILON) * 10000) / 10000
                $('#eq').html("$$P(Y<" + valueY + ") = (" + str + ") = " + res + " = " + (res * 100) + "\\%$$");
                break;
            case "more":
                res = 0;
                var str = "";
                for (var i = 0; i <= valueY; i++) {
                    res += calculate(valueN, valueP, i);
                    str += "P(Y=" + i + ")+";
                }
                str = str.substr(0, str.length - 1);
                res = 1 - res;
                res = Math.round((res + Number.EPSILON) * 10000) / 10000
                $('#eq').html("$$P(Y>" + valueY + ") = 1-(" + str + ") = " + res + " = " + (res * 100) + "\\%$$");
                break;
            default:
                res = 0;
                break;
        }
        $('#eq').show();
        MathJax.typeset();
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
    var chart = am4core.create("chartdiv", am4charts.PieChart);

    // Add data
    chart.data = [{
        "name": "Probabilidad",
        "value": (res * 100)
    }, {
        "name": "Complemento",
        "value": (100 - res * 100)
    }];

    // Add and configure Series
    var pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "value";
    pieSeries.dataFields.category = "name";
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;

    // This creates initial animation
    pieSeries.hiddenState.properties.opacity = 1;
    pieSeries.hiddenState.properties.endAngle = -90;
    pieSeries.hiddenState.properties.startAngle = -90;
}; 


