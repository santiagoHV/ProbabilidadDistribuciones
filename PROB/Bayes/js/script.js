// JavaScript Document
class Node {
    id;
    name;
    value;
    left;
    right;
    parent;

    constructor(id, name, value) {
        this.id = id;
        this.name = name;
        this.value = value;
        this.left = null;
        this.right = null;
        this.parent = null;
    }
}

class Tree {
    head;
    nodeCounter;

    constructor() {
        this.head = null;
        this.nodeCounter = 0;
    }

    findId(head, id) {
        if (head !== null) {
            var leftSearch = this.findId(head.left, id);
            var rightSearch = this.findId(head.right, id);

            if (parseInt(id) === head.id) {
                return head;
            } else if (leftSearch !== false) {
                return leftSearch;
            } else if (rightSearch !== false) {
                return rightSearch;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    addNode(parentId, direction, name, value) {

        if (parentId === "root") {
            if (this.head == null) {
                this.nodeCounter++;
                var newNode = new Node(this.nodeCounter, name, value);
                this.head = newNode;
                return true;
            } else {
                alert("El nodo ya esta ocupado.");
                return false;
            }

        } else {
            var parentNode = this.findId(this.head, parentId);

            if (direction === "left") {
                if (parentNode.left === null) {
                    this.nodeCounter++;
                    var newNode = new Node(this.nodeCounter, name, value);
                    newNode.parent = parentNode;
                    parentNode.left = newNode;
                    return true;
                } else {
                    alert("El nodo ya esta ocupado.");
                    return false;
                }

            } else if (direction === "right") {
                if (parentNode.right === null) {
                    this.nodeCounter++;
                    var newNode = new Node(this.nodeCounter, name, value);
                    newNode.parent = parentNode;
                    parentNode.right = newNode;
                    return true;
                } else {
                    alert("El nodo ya esta ocupado.");
                    return false;
                }
            } else {
                return false;
            }
        }
    }

    toHTML(head) {
        var html = "";

        if (head === null) {
            return '<li><span class="px-2 py-1">*</span></li>';
        } else {
            var htmlLeft = this.toHTML(head.left);
            var htmlRight = this.toHTML(head.right);
            /*
                        html = '<li>' +
                            '<div class="badge badge-' + (head.name == "Universal" ? 'warning' : (head.name == "R|S" || head.name == "R|S'" ? 'danger' : 'primary')) + ' rounded-pill px-2 py-1" >' +
                            head.name + '<br>' + head.value +
                            '</div>';
            */

            switch (head.name) {
                case "S":
                    html = '<li>' +
                        '<div class="badge badge-secondary rounded-pill px-2 py-1" >' +
                        head.name + '<br>' + head.value + '%' +
                        '</div>';
                    break;
                case "R|E":
                    html = '<li>' +
                        '<div class="badge rounded-pill px-2 py-1" style="background:#AE00FF;color:#FFF">' +
                        head.name + '<br>' + parseFloat(head.value).toPrecision(2) + '%' +
                        '</div><br>*';
                    break;
                case "R|E'":
                    html = '<li>' +
                        '<div class="badge rounded-pill px-2 py-1" style="background:#FF7C00">' +
                        head.name + '<br>' + parseFloat(head.value).toPrecision(2) + '%' +
                        '</div>';
                    break;
                case "E":
                    html = '<li>' +
                        '<div class="badge badge-primary rounded-pill px-2 py-1" >' +
                        head.name + '<br>' + parseFloat(head.value).toPrecision(2) + '%' +
                        '</div>';
                    break;
                case "E'":
                    html = '<li>' +
                        '<div class="badge badge-warning rounded-pill px-2 py-1" >' +
                        head.name + '<br>' + parseFloat(head.value).toPrecision(2) + '%' +
                        '</div>';
                    break;
                default:
                    html = '<li>' +
                        '<div class="badge badge-dark rounded-pill px-2 py-1" >' +
                        head.name + '<br>' + parseFloat(head.value).toPrecision(2) + '%' +
                        '</div>';
                    break;
            }



            if (!(head.left === null && head.right === null)) {

                html += '<ul>' +
                    htmlLeft +
                    htmlRight +
                    '</ul>' +
                    '</li>';
            }

            html += '</li>';
        }

        return html;
    }

    restart() {
        this.head = null;
        this.nodeCounter = 0;
    }
}

var tree = new Tree();
var e;
var ep;
var r_e;
var rp_e;
var r_ep;
var rp_ep;

function setValues() {
    e = parseFloat($('#valueE').val());
    ep = 1 - e;
    r_e = parseFloat($('#valueR_E').val());
    rp_e = 1 - r_e;
    r_ep = parseFloat($('#valueR_EP').val());
    rp_ep = 1 - r_ep;

    if (e >= 1 || r_e >= 1 || r_ep >= 1) {
        alert("Los valores deben ser menores a 1");
    } else if (e <= 0 || r_e <= 0 || r_ep <= 0) {
        alert("Los valores deben ser mayores a 0");
    } else {
        if (e + r_e + r_ep == 0) {
            var res = 0;
        } else {
            var res = e * r_e / (e * r_e + ep * r_ep);
        }

        $('#res').html(parseFloat(res).toPrecision(4));
        $('#resP').html(parseFloat(res * 100).toPrecision(4) + "%");

        tree.restart();
        tree.addNode("root", "", "S", "100");//1
        tree.addNode(1, "left", "E", e * 100);//2
        tree.addNode(1, "right", "E'", ep * 100);//3
        tree.addNode(2, "left", "R|E", r_e * 100);//4
        tree.addNode(2, "right", "R'|E", rp_e * 100);//5
        tree.addNode(3, "left", "R|E'", r_ep * 100);//6
        tree.addNode(3, "right", "R'|E'", rp_ep * 100);//7
        console.log(tree.head);
        $('#answer').show();
        $('#venn').show();
        printTree();
        printVenn();
    }
}
function printTree() {
    if (tree.head === null) {//si aun no hay raiz
        $('#ulTree').html("Árbol vacío");
    } else {
        $('#ulTree').html(tree.toHTML(tree.head));//imprimir arbol
    }
}

function printVenn() {
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    var data = [
        { name: "E", value: e },
        { name: "E'", value: ep },
        { name: "R", value: e * r_e + ep * r_ep },
        { name: "R|E", value: e * r_e * 0.77, sets: ["E", "R"] },
        { name: "R|E'", value: ep * r_ep * 0.77, sets: ["E'", "R"] }
    ];
    /*
        var data = [
            { name: "S", value: 4 },
            { name: "S'", value: 6 },
            { name: "R", value: 4 },
            { name: "R|S'", value: 2, sets: ["S", "R"] },
            { name: "R|S'", value: 2, sets: ["S'", "R"] }
        ];
    */
    var chart = am4core.create("chartdiv", am4plugins_venn.VennDiagram);
    var series = chart.series.push(new am4plugins_venn.VennSeries())

    series.dataFields.category = "name";
    series.dataFields.value = "value";
    series.dataFields.intersections = "sets";
    series.data = data;

    chart.legend = new am4charts.Legend();
    chart.legend.marginTop = 40;

    series.colors.list = [
        am4core.color("#007bff"),
        am4core.color("#ffc107"),
        am4core.color("#dc3545"),
        am4core.color("#AE00FF"),
        am4core.color("#FF7C00")
    ];


}


$(function () {
    $('#answer').hide();
    $('#venn').hide();
  })

