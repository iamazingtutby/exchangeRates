(function ($) {

    $(document).ready(function () {

// отслеживаем изменение закладки в УРЛе
        window.onhashchange = SwitchToStateFromURLHash;

// текущее состояние приложения
        var SPAStateH={};
        var dataColumns;
// вызывается при изменении закладки УРЛа
// а также при первом открытии страницы

        function datePickerInit() {
            var _dateStart = '', __dateStart = '';
            var from = $('.date-from.datepicker').datepicker({
                todayHighlight : true,
                format: 'yyyy/mm/dd',
                weekStart: 1,
                endDate: '0d',
                autoclose: true
            });
            var to = $('.date-to.datepicker').datepicker({
                todayHighlight : true,
                format: 'yyyy/mm/dd',
                weekStart: 1,
                endDate: '0d',
                autoclose: true
            });
            from.on('hide' , function () {
                _dateStart = $('.date-from.datepicker').val();
                __dateStart = new Date(_dateStart);
                to.datepicker('setStartDate', __dateStart);
            });
        }

        function SwitchToStateFromURLHash(){
            var URLHash = window.location.hash;

            // убираем из закладки УРЛа решётку
            var StateStr=URLHash.substr(1);

            // если закладка непустая, читаем из неё состояние и отображаем
            if ( StateStr!= ""){
                SPAStateH={ pagename: StateStr };
            } else {
                SPAStateH={ pagename: 'tables' }; // иначе показываем главную страницу
            }

            // обновляем вариабельную часть страницы под текущее состояние
            var PageHTML="";
            switch ( SPAStateH.pagename )
            {
                case 'tables':
                    $.ajax('table.html',
                        {
                            success: function (data) {
                                PageHTML = data;
                                $('#dynamicContent').html(PageHTML);
                                datePickerInit();

                                var tg = new CreateTablePage();
                                tg.init();

                            }
                        }
                    );
                    break;

                case 'columns':
                        $.ajax('column-graph.html',
                            {
                                success: function (dataColumns) {
                                    PageHTML = dataColumns;
                                    $('#dynamicContent').html(PageHTML);
                                    var cg = new CreateColumnsGraph();
                                    cg.init();
                                    
                                    setTimeout(function () {
                                        var dwnldBtn = $('.btn.dwnl');
                                        var dwnld = new DwnldGraph();
                                        
                                        $('#columnModal').on('show.bs.modal', function (e) {
                                            var el = $('.column-graph svg');
                                            dwnld.init(el);
                                        });
                                        
                                        dwnldBtn.on('click', function () {
                                            var canvas = $('#canvas');
                                            var _a = $(this);
                                            console.log("_a ,", _a);
                                            dwnld.download(_a);
                                        })
                                        
                                    }, 300);

                                }
                            }
                        );



                    break;
                case 'linears':
                    $.ajax('linear-graph.html',
                        {
                            success: function (data) {
                                PageHTML = data;
                                $('#dynamicContent').html(PageHTML);

                                datePickerInit();

                                $('button.create-linear').on('click', function () {

                                    var lg = new CreateLinearChart ();
                                    lg.init();

                                    setTimeout(function () {
                                        var dwnldBtn = $('.btn.dwnl');
                                        var dwnld = new DwnldGraph();
                                        if($('svg.axis').length){
                                            $('.btn.l-dwnld').removeClass('hide');
                                        }

                                        $('#linearModal').on('show.bs.modal', function () {
                                            var el = $('.linear-graph svg');
                                            dwnld.init(el);
                                        });

                                        dwnldBtn.on('click', function () {
                                            var canvas = $('#canvas');
                                            var _a = $(this);
                                            console.log("_a ,", _a);
                                            dwnld.download(_a);
                                        })

                                    }, 300);

                                });


                            }
                        }
                    );
                    break;
            }

            $('#dynamicContent').html(PageHTML);

        }

// устанавливает в закладке УРЛа новое состояние приложения
// и затем устанавливает+отображает это состояние
        function SwitchToState(NewStateH){
            // устанавливаем закладку УРЛа
            // нужно для правильной работы кнопок навигации браузера
            var StateStr = NewStateH.pagename;

            location.hash = StateStr;

            // АВТОМАТИЧЕСКИ вызовется SwitchToStateFromURLHash()
            // т.к. закладка УРЛа изменилась (ЕСЛИ она действительно изменилась)
        }

        $('.control-buttons .btn').each( function () {
            $(this).on('click', function () {
                var _state = $(this).data('state');
                console.log('===---', _state);
                SwitchToState( { pagename: _state } );
            })
        });

// переключаемся в состояние, которое сейчас прописано в закладке УРЛ
        SwitchToStateFromURLHash();
    });
})(jQuery);