// JavaScript Document

var valueMu;
var valueSigma;
var valueX;
var valueZ;
var res;
var opsList = ["eq", "geq", "leq", "lag"];

const iteraciones = 10000

$('#aditional').hide();

$('#eqGuide').hide();
$('#geqGuide').hide();
$('#leqGuide').hide();
$('#lessGuide').hide();
$('#moreGuide').hide();
showGuide();



function f1(z) {
    //console.log("z en f1 = =" + z);
    return Math.exp(-Math.pow(z, 2) / 2);
}

function f2(z) {
    //console.log("z en f2 = =" + z);
    return 1 / Math.pow(z, 2) * Math.exp(-1 / (2 * Math.pow(z, 2)));
}

function simpson(a, b, n) {
    console.log("simpson desde a=" + a + " hasta b=" + b);
    if (n % 2 == 1) n++;
    var h = (b - a) / n;
    var sum = f1(a) + f1(b);
    for (var i = 1; i < n; i += 2) {
        sum += 4 * f1(a + i * h);
    }
    for (var i = 2; i < n; i += 2) {
        sum += 2 * f1(a + i * h);
    }

    return (sum * h / 3);
}

function riman(a, b, n) {
    console.log("riman desde a=" + a + " hasta b=" + b);
    var h = (b - a) / n;
    var sum = 0;

    for (var i = 1; i <= n; i++) {

        var xi = a + i * h;
        var xi_mid = xi - h / 2;

        sum += f2(xi_mid);
    }
    return h * sum;
}

function riman2(a, b, n) {
    console.log("riman desde a=" + a + " hasta b=" + b);
    var h = (b - a) / n;
    var sum = 0;

    for (var i = 1; i <= n; i++) {

        var xi = a + i * h;
        var xi_mid = xi - h / 2;

        sum += f1(xi_mid);
    }
    return h * sum;
}


function calculate_from_inf(x) {
    if (x < 0) {

        var rimanRes = riman(1 / x, 0, iteraciones);

        console.log("riman = " + rimanRes);

        return rimanRes / (Math.sqrt(2 * Math.PI));

    } else if (x == 0) {
        return 0.5;
    } else {
        cut = -2; //negativo aleatorio

        var rimanRes = riman(1 / cut, 0, iteraciones);
        var simpsonRes = simpson(cut, x, iteraciones);

        console.log("riman = " + rimanRes + " simpson=" + simpsonRes);

        return (rimanRes + simpsonRes) / (Math.sqrt(2 * Math.PI));
    }
}

function calculate_to_inf(x) {
    return 1 - calculate_from_inf(x);
}

function calculate_between(a, b) {
    return simpson(a, b, iteraciones) / (Math.sqrt(2 * Math.PI));
}


function setValues() {
    valueMu = parseFloat($('#valueMu').val());
    valueSigma = parseFloat($('#valueSigma').val());
    valueX = parseFloat($('#valueX').val());
    res = 0;
    $('#eq').hide();

    if ($('#valueMu').val() == "" || $('#valvalueSigmaueMu').val() == "" || $('#valueX').val() == "") {
        alert("Los valores ingresados estan incompletos");
        $('#eq').hide();
        $('#chartdiv').hide();
    } else if (!(valueSigma > 0)) {
        alert("Sigma debe ser mayor a 0");
        $('#eq').hide();
        $('#chartdiv').hide();
    } else {
        //proceso


        switch ($('#valueOperator').val()) {
            case "geq":
                valueZ = (valueX-0.5 - valueMu) / valueSigma;
                res = calculate_to_inf(valueZ);
                resP = Math.round((res + Number.EPSILON) * 100000) / 100000
                valueZ = Math.round((valueZ + Number.EPSILON) * 100000) / 100000
                $('#eq').html(
                    "<h5>$$ Z = \\frac{x-\\mu}{\\sigma}  = \\frac{" + valueX + "-" + valueMu + "}{" + valueSigma + "} = " + valueZ + "$$</h5>" +
                    "<h4>$$P(X\\geq Z) = \\int_{" + valueZ + "}^{\\infty} \\frac{1}{ \\sqrt{2\\pi}} e^{- \\frac{1}{2} z^2} dz  = " + resP + " = " + Math.round(((res * 100) + Number.EPSILON) * 1000) / 1000 + "\\%$$</h4>");

                $('#eq').show();
                MathJax.typeset();
                printgraph();
                break;
            case "leq":
                valueZ = (valueX+0.5 - valueMu) / valueSigma;
                res = calculate_from_inf(valueZ);
                resP = Math.round((res + Number.EPSILON) * 100000) / 100000
                valueZ = Math.round((valueZ + Number.EPSILON) * 100000) / 100000
                $('#eq').html(
                "<h5>$$ Z = \\frac{x-\\mu}{\\sigma}  = \\frac{" + valueX + "-" + valueMu + "}{" + valueSigma + "} = " + valueZ + "$$</h5>" +
                "<h4>$$P(X\\leq Z) = \\int_{-\\infty}^{" + valueZ + "} \\frac{1}{ \\sqrt{2\\pi}} e^{- \\frac{1}{2} z^2} dz  = " + resP + " = " + Math.round(((res * 100) + Number.EPSILON) * 1000) / 1000 + "\\%$$</h4>");

                $('#eq').show();
                MathJax.typeset();
                printgraph();
                break;
            case "lag":

                valueA = parseFloat($('#valueX').val());
                valueB = parseFloat($('#valueB').val()) ;

                if ($('#valueB').val() == "") {

                    alert("Los valores ingresados estan incompletos");
                    $('#eq').hide();
                    $('#chartdiv').hide();
                } else if (valueB < valueA) {

                    alert("El valor de 'b' debe ser mayor o igual 'a')");
                    $('#eq').hide();
                    $('#chartdiv').hide();
                } else if (valueB == valueA) {
                    valueZ1 = ((valueA- 0.5 - valueMu) / valueSigma)
                    valueZ2 = ((valueB+ 0.5 - valueMu) / valueSigma)
                    res = 0;
                    valueZ1 = Math.round((valueZ1 + Number.EPSILON) * 100000) / 100000
                    valueZ2 = Math.round((valueZ2 + Number.EPSILON) * 100000) / 100000
                    $('#eq').html(
                        "<h5>$$ Z_{1} = \\frac{a-\\mu}{\\sigma}  = \\frac{" + valueA + "-" + valueMu + "}{" + valueSigma + "} = " + valueZ1 + "$$</h5>" +
                        "<h5>$$  Z_{2}= \\frac{b-\\mu}{\\sigma}  = \\frac{" + valueB + "-" + valueMu + "}{" + valueSigma + "} = " + valueZ2 + " $$</h5>" +
                        "<h4>$$P(Z_{1}\\leq X\\leq Z_{2}) = \\int_{" + valueZ1 + "}^{" + valueZ2 + "} \\frac{1}{ \\sqrt{2\\pi}} e^{- \\frac{1}{2} z^2} dz  = " + res + " = " + res + "\\%$$</h4>");
                    $('#eq').show();
                    MathJax.typeset();
                    printgraph();
                    break;
                } else {
                    valueZ1 = ((valueA- 0.5 - valueMu) / valueSigma)
                    valueZ2 = ((valueB+ 0.5 - valueMu) / valueSigma)
                    res = calculate_between(valueZ1, valueZ2);
                    var resP = Math.round((res + Number.EPSILON) * 100000) / 100000
                    valueZ1 = Math.round((valueZ1 + Number.EPSILON) * 100000) / 100000
                    valueZ2 = Math.round((valueZ2 + Number.EPSILON) * 100000) / 100000
                    $('#eq').html(
                        "<h5>$$ Z_{1} = \\frac{a-\\mu}{\\sigma}  = \\frac{" + valueA + "-" + valueMu + "}{" + valueSigma + "} = " + valueZ1 + "$$</h5>" +
                        "<h5>$$  Z_{2}= \\frac{b-\\mu}{\\sigma}  = \\frac{" + valueB + "-" + valueMu + "}{" + valueSigma + "} = " + valueZ2 + " $$</h5>" +
                        "<h4>$$P(Z_{1}\\leq X\\leq Z_{2}) = \\int_{" + valueZ1 + "}^{" + valueZ2 + "} \\frac{1}{ \\sqrt{2\\pi}} e^{- \\frac{1}{2} z^2} dz  = " + resP + " = " + Math.round(((res * 100) + Number.EPSILON) * 1000) / 1000 + "\\%$$</h4>");
                    $('#eq').show();
                    MathJax.typeset();
                    printgraph();
                    break;
                }

            default:
                res = 0;
                break;
        }
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
    if ($('#valueOperator').val() == 'lag') {
        $('#aditional').show();
        $('#labelX').html("$$ a $$");
    } else {
        $('#aditional').hide();
        $('#labelX').html("$$ x $$");
    }
    MathJax.typeset();
}

function printgraph() {
    $('#chartdiv').show();
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
        "value": (100 - (res * 100))
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