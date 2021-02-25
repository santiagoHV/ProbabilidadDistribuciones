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
    console.log("rieman desde a=" + a + " hasta b=" + b);
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
    console.log("rieman desde a=" + a + " hasta b=" + b);
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
        cut = -2;

        var rimanRes = riman(1 / cut, 0, iteraciones);
        var rimanRes2 = riman2(cut, x, iteraciones);

        console.log("riman = " + rimanRes + " riman2=" + rimanRes2);

        return (rimanRes + rimanRes2) / (Math.sqrt(2 * Math.PI));
    } else {
        cut = -Math.abs(x) / 2; //negativo aleatorio

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
    } else if (!(valueSigma > 0)) {
        alert("Sigma debe ser mayor a 0");
        $('#eq').hide();
    } else {
        //proceso


        switch ($('#valueOperator').val()) {
            case "geq":
                valueX = valueX - 0.5
                valueZ = (valueX - valueMu) / valueSigma;
                res = calculate_to_inf(valueZ);
                res = Math.round((res + Number.EPSILON) * 10000) / 10000
                $('#eq').html("<h5>$$ Z= \\frac{x-\\mu}{\\sigma}  = " + valueZ + " $$</h5><h4>$$P(X\\geq Z) = \\int_{" + valueX + "}^{\\infty} \\frac{1}{ \\sqrt{2\\pi}} e^{- \\frac{1}{2} z^2} dx  = " + res + " = " + Math.round(((res * 100) + Number.EPSILON) * 100) / 100 + "\\%$$</h4>");
                break;
            case "leq":
                valueX + 0.5
                valueZ = (valueX - valueMu) / valueSigma;
                res = calculate_from_inf(valueZ);
                res = Math.round((res + Number.EPSILON) * 10000) / 10000
                $('#eq').html("<h5>$$ Z= \\frac{x-\\mu}{\\sigma}  = " + valueZ + " $$</h5><h4>$$P(X\\leq Z) = \\int_{-\\infty}^{" + valueX + "} \\frac{1}{ \\sqrt{2\\pi}} e^{- \\frac{1}{2} z^2} dz  = " + res + " = " + Math.round(((res * 100) + Number.EPSILON) * 100) / 100 + "\\%$$</h4>");
                break;
            case "lag":

                valueA = parseFloat($('#valueX').val()) - 0.5;
                valueB = parseFloat($('#valueB').val()) + 0.5;

                if ($('#valueB').val() == "") {

                    alert("Los valores ingresados estan incompletos");
                    $('#eq').hide();
                } else if (valueB < valueA) {

                    alert("El valor de 'b' debe ser mayor o igual 'a')");
                    $('#eq').hide();
                } else {

                    valueA = parseFloat($('#valueX').val()) - 0.5;
                    valueB = parseFloat($('#valueB').val()) + 0.5;

                    valueZ1 = ((valueA - valueMu) / valueSigma)
                    valueZ2 = ((valueB - valueMu) / valueSigma)

                    res = calculate_between(valueZ1, valueZ2);
                    res = Math.round((res + Number.EPSILON) * 10000) / 10000
                    $('#eq').html("<h5>$$ Z_{1} = \\frac{x_{1}-\\mu}{\\sigma}  = " + valueZ1 + "$$</h5><h5>$$  Z_{2}= \\frac{x_{2}-\\mu}{\\sigma}  = " + valueZ2 + " $$</h5><h4>$$P(Z_{1}\\leq X\\leq Z_{2}) = \\int_{" + valueZ1 + "}^{" + valueZ2 + "} \\frac{1}{ \\sqrt{2\\pi}} e^{- \\frac{1}{2} z^2} dz  = " + res + " = " + Math.round(((res * 100) + Number.EPSILON) * 100) / 100 + "\\%$$</h4>");
                    break;
                }

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
    if ($('#valueOperator').val() == 'lag') {
        $('#aditional').show();
        $('#labelX').html("$$ a $$");
        MathJax.typeset();
    } else {
        $('#aditional').hide();
        $('#labelX').html("$$ x $$");
        MathJax.typeset();
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