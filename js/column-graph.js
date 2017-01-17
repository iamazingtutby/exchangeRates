    function CreateColumnsGraph() {
        this.init = function () {
            $('.preloader').show();
            var threeColumnStatic = [],
                curIds = [145,298,292];
            
            threeColumnStatic.length = 0;

            $('div.column-graph').html('');
            console.log('_data', threeColumnStatic);

            for(var i=0; i<curIds.length; i++){
                var reqUrl = 'http://www.nbrb.by/API/ExRates/Rates/' + curIds[i];
                $.ajax({
                    url: reqUrl,
                    type: 'GET',
                    cache: false,
                    success: function (data) {
                        threeColumnStatic.push(data);
                    },
                    error: function () {
                        alert('Error');
                    }
                });
            }

            function fillCol(){
                if(threeColumnStatic.length == 3){

                        console.log('threeColumnStatic.length', threeColumnStatic.length);
                        var height = 600,
                            width = 500,
                            margin=30,
                            data = threeColumnStatic;

                        // функция для получения цветов
                        var color = d3.scale.category10();

                        // длина оси X= ширина контейнера svg - отступ слева и справа
                        var xAxisLength = width - 2 * margin;

                        // длина оси Y = высота контейнера svg - отступ сверху и снизу
                        var yAxisLength = height - 2 * margin;

                        // функция интерполяции значений на ось X
                        var xScale = d3.scale.ordinal()
                            .rangeRoundBands([0, xAxisLength + margin], .1)
                            .domain(data.map(function(d) { return d.Cur_Abbreviation; }));

                        // функция интерполяции значений на ось Y
                        var yScale = d3.scale.linear()
                            .domain([
                                // d3.min(data, function(d) { return d.Cur_OfficialRate - 10; }),
                                0,
                                d3.max(data, function(d) { return d.Cur_OfficialRate ; })
                            ]).range([yAxisLength, 0]);

                        var svg = d3.select("body").selectAll('div.column-graph').append("svg")
                            .attr("class", "axis")
                            .attr("width", width)
                            .attr("height", height);

                        // создаем ось X
                        var xAxis = d3.svg.axis()
                            .scale(xScale)
                            .orient("bottom");
                        // создаем ось Y
                        var yAxis = d3.svg.axis()
                            .scale(yScale)
                            .orient("left");

                        // отрисовка оси Х
                        svg.append("g")
                            .attr("class", "x-axis")
                            .attr("transform",
                                "translate(" + margin + "," + (height - margin) + ")")
                            .call(xAxis);

                        // отрисовка оси Y
                        svg.append("g")
                            .attr("class", "y-axis")
                            .attr("transform",
                                "translate(" + margin + "," + margin + ")")
                            .call(yAxis);

                        // создаем элемент g с набором столбиков
                        svg.append("g")
                            .attr("transform",  // сдвиг оси вправо
                                "translate(" + margin + ", 0)")
                            .selectAll(".bar")
                            .data(data)
                            .enter().append("rect")
                            .attr("class", "bar")
                            .attr("x", function(d) { return xScale(d.Cur_Abbreviation); })
                            .attr("width", xScale.rangeBand())
                            .attr("y", function(d) { return (yScale(d.Cur_OfficialRate))*2; })
                            .attr("fill",  "#fff")
                            .attr("height", "0")
                                    .transition()
                                    .duration(3000)
                                    .delay(200)
                            .attr("y", function(d) { return yScale(d.Cur_OfficialRate); })
                            .attr("fill", function(d) { return color(d.Cur_Abbreviation); })
                            .attr("height", function(d) { return height - yScale(d.Cur_OfficialRate) - 30; });

                        svg.append("g")
                            .attr("transform",  // сдвиг оси вправо
                                "translate(" + margin + ", 0)")
                            .selectAll(".text")
                            .data(data)
                            .enter().append("text")
                            .attr("class", "text")
                            .attr("fill", "#fff")
                            .attr("x", function(d) { return xScale(d.Cur_Abbreviation) + 20; })
                            .attr("y", function(d) { return yScale(d.Cur_OfficialRate) + 20; })
                            .text(function(d) { return d.Cur_OfficialRate; })
                            .transition()
                            .duration(3000)
                            .delay(3000)
                            .attr("fill", "#fff");

                    $('.preloader').fadeOut();
                } else {
                    setTimeout(fillCol, 300);
                }
            }
            setTimeout(fillCol, 300);

        };
    }