(function ($) {

    /*
     usd id 145
     rub id 298
     eur id 292

     http://www.nbrb.by/API/ExRates/Rates/Dynamics/145?startDate=2016-9-1&endDate=2016-10-1

     */

    $(document).ready(function () {

        var usdUrl = 'http://www.nbrb.by/API/ExRates/Rates/145';
        var rubUrl = 'http://www.nbrb.by/API/ExRates/Rates/298';
        var eurUrl = 'http://www.nbrb.by/API/ExRates/Rates/292';
        var _data = [],
            curIds = [145,298,292];

        var threeStatic = [];
        var _euro3, _usd3, _rub3,_euro6, _usd6, _rub6;

        function getCurrencies() {
            var _today = new Date();
            var todayDateFormat = _today.getFullYear() + '/' + (_today.getMonth()+1) + '/' + _today.getDate();

            var threeMonthAgoDate = new Date();
            threeMonthAgoDate.setMonth(threeMonthAgoDate.getMonth() - 2); // отнимаем "2" - тк, иначе потом прибавлять 1 к месяцу
            var threeMonthAgoDateFormat = threeMonthAgoDate.getFullYear() + '/' + threeMonthAgoDate.getMonth() + '/' + threeMonthAgoDate.getDate();

            var oneWeekAgoDate = new Date();
            oneWeekAgoDate.setDate(oneWeekAgoDate.getDate() - 6); // отнимаем "6" - тк, иначе потом прибавлять 1 к неделе
            var oneWeekAgoDateFormat = oneWeekAgoDate.getFullYear() + '/' + (oneWeekAgoDate.getMonth()+1) + '/' + oneWeekAgoDate.getDate();

            console.log('oneWeekAgoDate', oneWeekAgoDate);
            console.log('oneWeekAgoDateFormat', oneWeekAgoDateFormat);
            var twoWeekAgoDate = new Date();
            twoWeekAgoDate.setDate(twoWeekAgoDate.getDate() - 13); // отнимаем "13" - тк, иначе потом прибавлять 1 к неделе
            var twoWeekAgoDateFormat = twoWeekAgoDate.getFullYear() + '/' + (twoWeekAgoDate.getMonth()+1) + '/' + twoWeekAgoDate.getDate();

            console.log('twoWeekAgoDate', twoWeekAgoDate);
            console.log('twoWeekAgoDateFormat', twoWeekAgoDateFormat);

            var sixMonthAgoDate = new Date();
            sixMonthAgoDate.setMonth(sixMonthAgoDate.getMonth() - 5); // отнимаем "5" - тк, иначе потом прибавлять 1 к месяцу
            var sixMonthAgoDateFormat = sixMonthAgoDate.getFullYear() + '-' + sixMonthAgoDate.getMonth() + '-' + sixMonthAgoDate.getDate();

            // console.log('threeMonthAgoDate ', threeMonthAgoDate);
            console.log('threeMonthAgoDate ', threeMonthAgoDateFormat);

            // console.log('sixMonthAgoDate ', sixMonthAgoDate);
            console.log('sixMonthAgoDate ', sixMonthAgoDateFormat);

            for(var i=0; i<curIds.length; i++){
                var reqUrl = 'http://www.nbrb.by/API/ExRates/Rates/' + curIds[i];
                $.ajax({
                    url: reqUrl,
                    type: 'GET',
                    cache: false,
                    success: function (data) {
                        threeStatic.push(data);
                    },
                    error: function () {
                        alert('Error');
                    }
                });
            }
            console.log('threeStatic ', threeStatic);


            // get EURO dynamic for the three month ---- oneWeek !!
            $.getJSON("http://www.nbrb.by/API/ExRates/Rates/Dynamics/292?startDate="+twoWeekAgoDateFormat+"&endDate="+todayDateFormat+"",
            function (data) {
                // console.log('get EURO dynamic for the three month ', data);
                _euro3 = data;
                });
            // get USD dynamic for the three month ---- oneWeek !!
            $.getJSON(
                "http://www.nbrb.by/API/ExRates/Rates/Dynamics/145?startDate="+twoWeekAgoDateFormat+"&endDate="+todayDateFormat+"",
                function (data) {
                    console.log('get USD dynamic for the three month ', data);
                    _usd3 = data;
                });
            // get RUB dynamic for the three month ---- oneWeek !!
            $.getJSON("http://www.nbrb.by/API/ExRates/Rates/Dynamics/298?startDate="+twoWeekAgoDateFormat+"&endDate="+todayDateFormat+"",
                function (data) {
                    // console.log('get RUB dynamic for the three month ', data);
                    _rub3 = data;
                });
            // // get EURO dynamic for the six month
            // $.getJSON("http://www.nbrb.by/API/ExRates/Rates/Dynamics/292?startDate="+sixMonthAgoDateFormat+"&endDate="+todayDateFormat+"",
            //     function (data) {
            //         // console.log('get EURO dynamic for the six month ', data);
            //         _euro6 = data;
            //     });
            // // get USD dynamic for the six month
            // $.getJSON("http://www.nbrb.by/API/ExRates/Rates/Dynamics/145?startDate="+sixMonthAgoDateFormat+"&endDate="+todayDateFormat+"",
            //     function (data) {
            //         // console.log('get USD dynamic for the six month ', data);
            //         _usd6 = data;
            //     });
            // // get RUB dynamic for the six month
            // $.getJSON("http://www.nbrb.by/API/ExRates/Rates/Dynamics/298?startDate="+sixMonthAgoDateFormat+"&endDate="+todayDateFormat+"",
            //     function (data) {
            //         // console.log('get RUB dynamic for the six month ', data);
            //         _rub6 = data;
            //     });

        }
        getCurrencies();


        $('.btns-row .btn').each(function () {
            $(this).on('click', function () {

                var currentBtn = $(this).data('cur');
                var requestUrl;

                console.log('this', $(this).data('cur'));

                switch (currentBtn){
                    case ('rub'):
                        requestUrl = rubUrl;
                        getOneCurrency();
                        break;
                    case ('usd'):
                        requestUrl = usdUrl;
                        getOneCurrency();
                        break;
                    case ('eur'):
                        requestUrl = eurUrl;
                        getOneCurrency();
                        break;
                    case ('all'):
                        getThreeCurrencies();
                        return false;
                }

                function getThreeCurrencies() {

                    // function getData() {
                    //     for(var i=0; i<curIds.length; i++){
                    //         var reqUrl = 'http://www.nbrb.by/API/ExRates/Rates/' + curIds[i];
                    //         $.ajax({
                    //             url: reqUrl,
                    //             type: 'GET',
                    //             cache: false,
                    //             success: function (data) {
                    //                 _data.push(data);
                    //             },
                    //             error: function () {
                    //                 alert('Error');
                    //             }
                    //         });
                    //     }
                    // }
                    // getData();
                    console.log('_data ', threeStatic);
                    function fillTable() {
                        console.log('_data1 ', threeStatic);
                        var tableTpl = [
                            {
                                tag: 'table', options: {
                                attributes: {id: 'curTable', class: 'table table-bordered currency-table'}, children: [
                                    {
                                        tag: 'thead', options: {
                                        children: [
                                            {
                                                tag: 'tr', options: {
                                                children: [
                                                    {
                                                        tag: 'th',
                                                        options: {attributes: {class: 'first'}, text: 'Валюта'}
                                                    },
                                                    {tag: 'th', options: {attributes: {class: 'second'}, text: 'Курс'}}
                                                ]
                                            }
                                            }
                                        ]
                                    }
                                    },
                                    {
                                        tag: 'tbody'
                                    }
                                ]
                            }
                            }
                        ];
                        function createTable(tpl, par) {
                            par.html('');
                            for(var i=0; i<tpl.length; i++){
                                var tag = tpl[i].tag;
                                var elem = $("<" + tag + ">");
                                par.append(elem);
                                if('options' in tpl[i]){
                                    if('attributes' in tpl[i]['options']){
                                        var _arr = tpl[i]['options']['attributes'];
                                        for(var key in _arr)
                                            elem.attr(key , _arr[key])
                                    }
                                    if('children' in tpl[i]['options']){
                                        createTable(tpl[i]['options']['children'], elem)
                                    }
                                    if('text' in tpl[i]['options']){
                                        elem.text(tpl[i]['options'].text);
                                    }
                                }
                            }
                        }

                        var par = $('.table-data');
                        createTable(tableTpl, par);

                        // setTimeout(function () {
                            console.log('_data.length', threeStatic.length);

                            for(var j=0; j<threeStatic.length; j++){
                                $('#curTable').find('tbody')
                                    .append('<tr><td>'+threeStatic[j].Cur_Scale+' '+threeStatic[j].Cur_Name+'</td><td>'+threeStatic[j].Cur_OfficialRate +' бел.руб</td></tr>');
                                console.log('===tr===');
                            }
                        // }, 300);


                    }
                    fillTable();

                }

                function getOneCurrency() {
                    $.ajax({
                        url: requestUrl,
                        type: 'GET',
                        cache: false,
                        success: function (data) {
                            fillTable(data);
                        },
                        error: function () {
                            alert('Error');
                        }
                    });
                    function fillTable(data) {
                        console.log('data -- ', data);
                        var tableTpl = [
                            {tag: 'table', options: {attributes: {id: 'curTable', class: 'table table-bordered currency-table'}, children: [
                                {tag: 'thead', options: { children: [
                                    {tag: 'tr', options: { children: [
                                        {tag: 'th', options: {attributes: {class: 'first'}, text: 'Валюта'}},
                                        {tag: 'th', options: {attributes: {class: 'second'}, text: 'Курс'}}
                                    ]}}
                                ]}},
                                {tag: 'tbody', options: { children: [
                                    {tag: 'tr', options: { children: [
                                        {tag: 'td', options: {attributes: {class: 'first'}, text: data.Cur_Scale +' '+ data.Cur_Name}},
                                        {tag: 'td', options: {attributes: {class: 'second'}, text: data.Cur_OfficialRate +' бел.руб'}}
                                    ]}}
                                ]}}
                            ]}}
                        ];

                        function createTable(tpl, par) {
                            par.html('');
                            for(var i=0; i<tpl.length; i++){
                                var tag = tpl[i].tag;
                                var elem = $("<" + tag + ">");
                                par.append(elem);
                                if('options' in tpl[i]){
                                    if('attributes' in tpl[i]['options']){
                                        var _arr = tpl[i]['options']['attributes'];
                                        for(var key in _arr)
                                            elem.attr(key , _arr[key])
                                    }
                                    if('children' in tpl[i]['options']){
                                        createTable(tpl[i]['options']['children'], elem)
                                    }
                                    if('text' in tpl[i]['options']){
                                        elem.text(tpl[i]['options'].text);
                                    }
                                }
                            }
                        }

                        var par = $('.table-data');
                        createTable(tableTpl, par);

                    }
                }

            });
        });

        $('.create-columns').on('click', function () {
            console.log('_data', threeStatic);

            // Enter
            d3.select('div.column-graph')
                .selectAll('div').data(threeStatic).enter()
                .append('div').attr('class', 'item')
                .append('div').attr('class', 'cg-data').append('span');

            // Update
            d3.select('div.column-graph')
                .selectAll('div.item').data(threeStatic)
                .select('div').style('height', function (d)
                {
                    return (d.Cur_OfficialRate * 100) + 'px';
                })
                .select('span')
                .text(function (d) {
                    return d.Cur_OfficialRate;
                });

            d3.select('div.column-graph')
                .selectAll('div.item')
                .data(threeStatic).append('div')
                .attr('class', 'name')
                .text(function (d) {
                    return d.Cur_Abbreviation;
                });

            // Exit
            d3.select('div.column-graph')
                .selectAll('div.item')
                .data(threeStatic)
                .exit();

            d3.select('div.column-graph')
                .selectAll('div.name')
                .data(threeStatic)
                .exit();

        });

        $('.btn.create-linear').on('click', function (e) {
            // debugger;
            e.preventDefault();
            createLinearChart();
        });


        //
        // $('form.line-graph-form').on('submit', function () {
        //     console.log('SUBMITTED');
        //     debugger;
        //
        //
        //
        // });

        function createLinearChart (){
            // console.log('_data', _data);
            d3.select("body").selectAll(".linear-graph").html('');

            var height = 500,
                width = 600,
                margin = 30;
                // usdData = [
                //     {date: new Date(2015, 02, 19), rate: 61.34},
                //     {date: new Date(2015, 02, 24), rate: 59.44},
                //     {date: new Date(2015, 02, 28), rate: 57.72},
                //     {date: new Date(2015, 03, 3), rate: 56.99},
                //     {date: new Date(2015, 03, 8), rate: 55.33},
                //     {date: new Date(2015, 03, 11), rate: 51.06}
                // ],
                // eurData = [
                //     {date: new Date(2015, 02, 19), rate: 65.01},
                //     {date: new Date(2015, 02, 24), rate: 64.15},
                //     {date: new Date(2015, 02, 28), rate: 62.56},
                //     {date: new Date(2015, 03, 3), rate: 61.69},
                //     {date: new Date(2015, 03, 8), rate: 60.41},
                //     {date: new Date(2015, 03, 11), rate: 54.27}
                // ];

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
                [d3.max(_euro3, function(d) { return d.Cur_OfficialRate; }),
                 // d3.max(_rub3, function(d) { return d.Cur_OfficialRate; }),
                 d3.max(_usd3, function(d) { return d.Cur_OfficialRate; })]);
            // находим минимальное значение для оси Y
            var minValue = d3.min(
               [d3.min(_euro3, function(d) { return d.Cur_OfficialRate; }),
                // d3.min(_rub3, function(d) { return d.Cur_OfficialRate; }),
                d3.min(_usd3, function(d) { return d.Cur_OfficialRate; })]);


            // функция интерполяции значений на ось Х
            var scaleX = d3.time.scale() // даты из массива
                .domain([d3.min(_usd3, function(d) {
                    // console.log('d.Date', d.Date);
                    var _d = new Date (d.Date);
                    return _d;
                    // return d.Date;
                }),
                    d3.max(_usd3, function(d) {
                        var _d = new Date (d.Date);
                        return _d;
                        // return d.Date;
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
            createChart(_usd3, "steelblue", "usd");
            // createChart(_rub3, "blue", "rub");
            createChart(_euro3, "#FF7F0E", "euro");


            // общая функция для создания графиков
            function createChart (datad3, colorStroke, label){

            // функция, создающая по массиву точек линии
                var line = d3.svg.line()
                    .x(function(d) { return scaleX(new Date(d.Date))+margin; })
                    .y(function(d){return scaleY(d.Cur_OfficialRate)+margin;});

                var g = svg.append("g");
                g.append("path")
                    .attr("d", line(datad3))
                    .style("stroke", colorStroke)
                    .style("stroke-width", 2);

                // добавляем отметки к точкам
                svg.selectAll(".dot "+ label)
                    .data(datad3)
                    .enter().append("circle")
                    .style("stroke", colorStroke)
                    .style("fill", "white")
                    .attr("class", "dot " + label)
                    .attr("r", 4)
                    .attr("cx", function(d) { return scaleX(new Date(d.Date))+margin; })
                    .attr("cy", function(d) { return scaleY(d.Cur_OfficialRate)+margin; });

                svg.selectAll(".text "+ label)
                    .data(datad3)
                    .enter().append("text")
                    .style("font-size", "11px")
                    .attr("class", "text "+ label)
                    .attr("x", function(d) { return scaleX(new Date(d.Date))+margin; })
                    .attr("y", function(d) { return scaleY(d.Cur_OfficialRate)+margin; })
                    .text(function(d) { return d.Cur_OfficialRate; });
        }



            // d3.select("body").selectAll(".linear-graph").append(svg);


        }

    });
})(jQuery);
