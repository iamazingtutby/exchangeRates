function CreateLinearChart (){

    var _from = $('.month-quantity input.date-from').val();
    var _to = $('.month-quantity input.date-to').val();

    var _usd = $('.checkbox .usd').prop('checked');
    var _euro = $('.checkbox .euro').prop('checked');
    var _rub = $('.checkbox .rub').prop('checked');
    var requestUrl = '';
    var usdData = [], euroData = [], rubData = [], _arr = [];


    this.getData = function () {
            if(_usd) {
                var usdId = 145; // id usd
                requestUrl = "http://www.nbrb.by/API/ExRates/Rates/Dynamics/" + usdId + "?startDate=" + _from + "&endDate=" + _to + "";
                getCurData(requestUrl, usdData);
            }
            if(_euro) {
                var euroId = 292; // euro id
                requestUrl = "http://www.nbrb.by/API/ExRates/Rates/Dynamics/" + euroId + "?startDate=" + _from + "&endDate=" + _to + "";
                getCurData(requestUrl, euroData);
            }
            if(_rub) {
                var rubId = 298; // rub id
                requestUrl = "http://www.nbrb.by/API/ExRates/Rates/Dynamics/" + rubId + "?startDate=" + _from + "&endDate=" + _to + "";
                getCurData(requestUrl, rubData);
            }

        function getCurData(requestUrl, arr) {
            $.ajax({
                url: requestUrl,
                type: 'GET',
                cache: false,
                success: function (data) {
                    // arr = data;
                    console.log('data', data);
                    for(var i = 0; i < data.length; i++){
                        arr.push(data[i]);
                    }
                    _arr.push(arr);
                },
                error: function () {
                    $('#alertModal').modal('show');
                    $('#alertModal').on('hidden.bs.modal', function (e) {
                        $('.preloader').fadeOut();
                    });
                    return false;
                }
            });
        }

    };

    
    this.init = function () {

        $('.preloader').show();

        this.getData();
        if((_usd == false) && (_euro == false) && (_rub == false)){
            $('#alertModal').modal('show');
            $('#alertModal').on('hidden.bs.modal', function (e) {
                $('.preloader').fadeOut();
            });
            return false;
        }
        console.log('_usd - _euro - _rub', _usd , _euro , _rub);
        console.log('_arr', _arr);


        function fillLinear(){
            d3.select("body").selectAll(".linear-graph").html('');
            if(_usd || _euro || _rub){

                if(_arr.length == 0){
                    $('#alertModal').modal('show');
                    return false;
                }
                    console.log('_from - _to', _from , _to);
                    console.log('_usd - _euro - _rub', _usd , _euro , _rub);
                    console.log('usdData - euroData - rubData ', usdData , euroData , rubData);


                    var height = 500,
                        width = 600,
                        margin = 30;

                    var svg = d3.select("body").selectAll(".linear-graph").append("svg")
                        .attr("class", "axis")
                        .attr("id", "linear-svg-graph")
                        .attr("width", width)
                        .attr("height", height);

                    // длина оси X= ширина контейнера svg - отступ слева и справа
                    var xAxisLength = width - 2 * margin;

                    // длина оси Y = высота контейнера svg - отступ сверху и снизу
                    var yAxisLength = height - 2 * margin;

                    // находим максимальное значение для оси Y
                    var maxValue = d3.max(
                        [d3.max(euroData, function(d) { return d.Cur_OfficialRate; }),
                            d3.max(rubData, function(d) { return d.Cur_OfficialRate; }),
                            d3.max(usdData, function(d) { return d.Cur_OfficialRate; })]);
                    // находим минимальное значение для оси Y
                    var minValue = d3.min(
                        [d3.min(euroData, function(d) { return d.Cur_OfficialRate; }),
                            d3.min(rubData, function(d) { return d.Cur_OfficialRate; }),
                            d3.min(usdData, function(d) { return d.Cur_OfficialRate; })]);

                    // функция интерполяции значений на ось Х
                    var scaleX = d3.time.scale() // даты из массива
                        .domain([d3.min(_arr[0], function(d) {
                            var _d = new Date (d.Date);
                            return _d;
                        }),
                            d3.max(_arr[0], function(d) {
                                var _d = new Date (d.Date);
                                return _d;
                            })])
                        .range([0, xAxisLength]);

                    // функция интерполяции значений на ось Y
                    var scaleY = d3.scale.linear()
                        .domain([(maxValue+0.1), (minValue-0.1)])
                        // .domain([3.5, 1.5])
                        .range([0, yAxisLength]);

                    // создаем ось X
                    var xAxis = d3.svg.axis()
                        .scale(scaleX)
                        .orient("bottom")
                        .tickFormat(d3.time.format('%e.%m'));
                    // создаем ось Y
                    var yAxis = d3.svg.axis()
                        .scale(scaleY)
                        .orient("left")
                        .ticks(5);

                    // отрисовка оси Х
                    svg.append("g")
                        .attr("class", "x-axis")
                        .attr("transform",  // сдвиг оси вниз и вправо
                            "translate(" + margin + "," + (height - margin) + ")")
                        .call(xAxis);
                    // отрисовка оси Y
                    svg.append("g")
                        .attr("class", "y-axis")
                        .attr("transform", // сдвиг оси вниз и вправо на margin
                            "translate(" + margin + "," + margin + ")")
                        .call(yAxis);

                    if(_usd && usdData.length){
                        createChart(usdData, "steelblue", "usd");
                    }
                    if(_euro && euroData.length){
                        createChart(euroData, "#FF7F0E", "euro");
                    }
                    if(_rub && rubData.length){
                        createChart(rubData, "blue", "rub");
                    }

                    // общая функция для создания графиков
                    function createChart (dataD3, colorStroke, label){
                        // функция, создающая по массиву точек линии
                        var line = d3.svg.line()
                            .x(function(d){return scaleX(new Date(d.Date))+margin; })
                            .y(function(d){return scaleY(d.Cur_OfficialRate)+margin;});

                        var g = svg.append("g");
                        g.append("path")
                            .attr("d", line(dataD3))
                            .style("stroke", colorStroke)
                            .style("stroke-width", 2);

                        // отметки к точкам
                        svg.selectAll(".dot "+ label)
                            .data(dataD3)
                            .enter().append("g")
                            .attr("class", "g_wrap g_wrap"+ label)
                            .append("circle")
                            .style("stroke", colorStroke)
                            .style("fill", "white")
                            .attr("class", "dot " + label)
                            .attr("r", 4)
                            .attr("cx", function(d) { return scaleX(new Date(d.Date))+margin; })
                            .attr("cy", function(d) { return scaleY(d.Cur_OfficialRate)+margin; });

                        svg.selectAll(".g_wrap"+ label)
                            .data(dataD3)
                            .append("text")
                            .style("font-size", "12px")
                            .attr("class", "text "+ label)
                            .attr("x", function(d) { return scaleX(new Date(d.Date))+margin; })
                            .attr("y", function(d) { return scaleY(d.Cur_OfficialRate)+margin-10; })
                            .attr("text-anchor", "middle")
                            .attr("fill", colorStroke)
                            .text(function(d) { return d.Cur_OfficialRate; });

                        $('.preloader').fadeOut();
                    }

            } else {
                setTimeout(fillLinear, 300);
            }
        }
        setTimeout(fillLinear, 300);
    };

}
