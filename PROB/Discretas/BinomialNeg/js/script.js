// JavaScript Document

var valueR;
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

function combination(a, b) {
    return (factorial(a) / (factorial(b) * factorial(a - b)));
}

function calculate(r, p, y) {
    if (y < r) {
        return 0;
    } else {
        return combination(y - 1, r - 1) * Math.pow(p, r) * Math.pow(1 - p, y - r);
    }
}

function setValues() {
    valueR = parseInt($('#valueR').val());
    valueP = parseFloat($('#valueP').val());
    valueY = parseInt($('#valueY').val());
    $('#eq').hide();

    if (valueR == "" || $('#valueP').val() == "" || $('#valueY').val() == "") {
        alert("Los valores ingresados estan incompletos");
        $('#eq').hide();
    } else if (valueR < 0) {
        alert("El valor de r debe ser mayor que 0 ");
        $('#eq').hide();
    } else if (valueY < 1) {
        alert("El valor de y debe ser mayor que 1");
        $('#eq').hide();
    } else if (valueR > valueY) {
        alert("El valor de y debe ser menor o igual al de n");
        $('#eq').hide();
    } else if (valueP > 1 || valueP < 0) {
        alert("El valor de p debe estar entre 0 y 1");
        $('#eq').hide();
    } else {

        if (valueR != parseFloat($('#valueR').val())) {
            alert("Solo se tomara el valor entero de (r)");
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

                res = calculate(valueR, valueP, valueY);
                res = Math.round((res + Number.EPSILON) * 10000) / 10000
                $('#eq').html("$$P(Y=" + valueY + ")= \\displaystyle\\binom{" + valueY + "-1}{" + valueR + "-1} " + valueP + "^{" + valueR + "} (1-" + valueP + ")^{" + valueY + "-" + valueR + "} = " + res + " = " + (res * 100) + "\\%$$");
                break;
            case "geq":
                res = 0;
                var str = "";
                for (var i = 0; i < valueY; i++) {
                    res += calculate(valueR, valueP, i);
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
                    res += calculate(valueR, valueP, i);
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
                    res += calculate(valueR, valueP, i);
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
                    res += calculate(valueR, valueP, i);
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