(function ($) {
    var usdUrl = 'http://www.nbrb.by/API/ExRates/Rates/145';
    var rubUrl = 'http://www.nbrb.by/API/ExRates/Rates/298';
    var eurUrl = 'http://www.nbrb.by/API/ExRates/Rates/292';
    var _data = [],
        curIds = [145,298,292];

    var threeStatic = [];

    $(document).on('click', function () {

        

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

                // console.log('this', $(this).data('cur'));

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
                        // console.log('_data1 ', threeStatic);
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


                        for(var j=0; j<threeStatic.length; j++){
                            $('#curTable').find('tbody')
                                .append('<tr><td>'+threeStatic[j].Cur_Scale+' '+threeStatic[j].Cur_Name+'</td><td>'+threeStatic[j].Cur_OfficialRate +' бел.руб</td></tr>');
                        }


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
    });

    // $(document).ajax('suucess', function () {
    //
    // })

})(jQuery);
