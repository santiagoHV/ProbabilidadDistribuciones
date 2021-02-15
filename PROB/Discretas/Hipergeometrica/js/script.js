// JavaScript Document

var valueBigN;
var valueN;
var valueR;
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

function combination(n, x) {
    return (factorial(n) / (factorial(x) * factorial(n - x)));
}

function calculate(nPob, n, k, x) {
    return combination(k, x) * combination(nPob - k, n - x) / combination(nPob, n);
}

function setValues() {
    valueBigN = parseInt($('#valueBigN').val());
    valueN = parseInt($('#valueN').val());
    valueR = parseInt($('#valueR').val());
    valueY = parseInt($('#valueY').val());
    $('#eq').hide();

    if (valueBigN == "" || valueN == "" || valueR == "" || valueY == "") {
        alert("Los valores ingresados estan incompletos");
        $('#eq').hide();
    } else if (valueY < 0 || valueBigN < 0 || valueN < 0 || valueR < 0) {
        alert("Todos los valores deben ser mayores o iguales a 0");
        $('#eq').hide();
    } else if (valueY > valueR) {
        alert("El valor de y debe ser menor o igual al de R");
        $('#eq').hide();
    } else if (valueN > valueBigN) {
        alert("El valor de n no puede ser mayor que N");
        $('#eq').hide();
    } else if (valueR > valueBigN) {
        alert("El valor de r no puede ser menor que N");
        $('#eq').hide();
    } else {


        if (valueBigN != parseFloat($('#valueBigN').val())) {
            alert("Solo se tomara el valor entero de (N)");
        }

        if (valueN != parseFloat($('#valueN').val())) {
            alert("Solo se tomara el valor entero de (n)");
        }

        if (valueR != parseFloat($('#valueR').val())) {
            alert("Solo se tomara el valor entero de (k)");
        }

        if (valueY != parseFloat($('#valueY').val())) {
            alert("Solo se tomara el valor entero de (x)");
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

                res = calculate(valueBigN, valueN, valueR, valueY);
                $('#eq').html("$$P(" + valueY + ")=\\frac{ \\displaystyle\\binom{" + valueR + "}{" + valueY + "} \\displaystyle\\binom{" + valueBigN + "-" + valueR + "}{" + valueN + "-" + valueY + "}}{\\displaystyle\\binom{" + valueBigN + "}{" + valueN + "}} = " + res + " = " + (res * 100) + "\\%$$");
                break;
            case "geq":
                res = 0;
                var str = "";
                for (var i = 0; i < valueY; i++) {
                    res += calculate(valueBigN, valueN, valueR, i);
                    str += "P(X=" + i + ")+";
                }
                str = str.substr(0, str.length - 1);
                res = 1 - res;
                res = Math.round((res + Number.EPSILON) * 100000000) / 100000000
                $('#eq').html("$$P(X\\geq" + valueY + ") = 1-(" + str + ") = " + res + " = " + (res * 100) + "\\%$$");
                break;
            case "leq":
                res = 0;
                var str = "";
                for (var i = 0; i <= valueY; i++) {
                    res += calculate(valueBigN, valueN, valueR, i);
                    str += "P(X=" + i + ")+";
                }
                str = str.substr(0, str.length - 1);
                res = Math.round((res + Number.EPSILON) * 100000000) / 100000000
                $('#eq').html("$$P(X\\leq" + valueY + ") = (" + str + ") = " + res + " = " + (res * 100) + "\\%$$");
                break;
            case "less":
                res = 0;
                var str = "";
                for (var i = 0; i < valueY; i++) {
                    res += calculate(valueBigN, valueN, valueR, i);
                    str += "P(X=" + i + ")+";
                }
                str = str.substr(0, str.length - 1);
                res = Math.round((res + Number.EPSILON) * 100000000) / 100000000
                $('#eq').html("$$P(X<" + valueY + ") = (" + str + ") = " + res + " = " + (res * 100) + "\\%$$");
                break;
            case "more":
                res = 0;
                var str = "";
                for (var i = 0; i <= valueY; i++) {
                    res += calculate(valueBigN, valueN, valueR, i);
                    str += "P(X=" + i + ")+";
                }
                str = str.substr(0, str.length - 1);
                res = 1 - res;
                res = Math.round((res + Number.EPSILON) * 100000000) / 100000000
                $('#eq').html("$$P(X>" + valueY + ") = 1-(" + str + ") = " + res + " = " + (res * 100) + "\\%$$");
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
        "name": "Probabilidad del ejercicio",
        "value": (res * 100)
    }, {
        "name": "Probabilidad complementaria",
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


