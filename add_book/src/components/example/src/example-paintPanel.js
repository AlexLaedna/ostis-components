/**
 * Paint panel.
 */




Example.PaintPanel = function (containerId) {
    this.containerId = containerId;
};

Example.PaintPanel.prototype = {


    init: function () {
        this._initMarkup(this.containerId);
    },

    _initMarkup: function (containerId) {
        var container = $('#' + containerId);
        var self = this;

        container.append('<input type="text" id="name" placeholder="Название"> <br>',
            '<input type="text" id="name1" placeholder="Автор"> <br>');

        container.append('<select id="genre"> <option id="concept_fairy_tail">Сказка</option> ' +
            '<option id="concept_novel">Роман</option>' +
            '<option id="concept_poem">Поэма</option>' +
            '<option id="concept_comedy">Комедия</option></select><br> ');


        container.append('<input type="text" id="name2" placeholder="Количество страниц"> <br>',
            '<input type="text" id="name3" placeholder="Издатель"> <br>');

        container.append('<input type="button" id="newButton1" value="OK" onclick="generateNodesValue("const_book")"> <br>');


        $('#newButton1').click(function () {
            var not_null = $('#name').val();
            var not_null_1 = $('#name1').val();
            var not_null_2 = $('#name2').val();
            var not_null_3 = $('#name3').val();

            if (not_null.length != 0 && not_null_1.length != 0 && not_null_2.length != 0 && not_null_3.length != 0) {
                self._generateNodes3('name', 'name1', $("#genre option:selected").attr('id'), 'name2', 'name3');
            }
        });
    },
    _generateNodes3: function (input1, input2, input3, input4, input5) {
        var concept_book, nrel_genre, nrel_author, nrel_published, nrel_number_of_pages;
        // Resolve sc-addr. Get sc-addr of ui_main_menu node
        SCWeb.core.Server.resolveScAddr(['concept_book', 'nrel_genre', 'nrel_author', 'nrel_published', 'rel_number_of_pages'], function (keynodes) {
            concept_book = keynodes['concept_book'];
            nrel_genre = keynodes['nrel_genre'];
            nrel_author = keynodes['nrel_author'];
            nrel_published = keynodes['nrel_published'];
            nrel_number_of_pages = keynodes['nrel_number_of_pages'];

            window.sctpClient.create_link().done(function (generatedLink) {
                window.sctpClient.set_link_content(generatedLink, document.getElementById(input1).value);
                window.sctpClient.create_arc(sc_type_arc_pos_const_perm, concept_book, generatedLink);

                window.sctpClient.create_link().done(function (generatedLink2) {
                    window.sctpClient.set_link_content(generatedLink2, document.getElementById(input2).value);
                    window.sctpClient.create_arc(sc_type_arc_common | sc_type_const, generatedLink, generatedLink2).done(function (generatedCommonArc) {
                        window.sctpClient.create_arc(sc_type_arc_pos_const_perm, nrel_author, generatedCommonArc);
                    });

                });

                window.sctpClient.create_link().done(function (generatedLink3) {
                    window.sctpClient.set_link_content(generatedLink3, document.getElementById(input3).value);
                    window.sctpClient.create_arc(sc_type_arc_common | sc_type_const, generatedLink, generatedLink3).done(function (generatedCommonArc) {
                        window.sctpClient.create_arc(sc_type_arc_pos_const_perm, nrel_genre, generatedCommonArc);
                    });

                });

                window.sctpClient.create_link().done(function (generatedLink4) {
                    window.sctpClient.set_link_content(generatedLink4, document.getElementById(input4).value);
                    window.sctpClient.create_arc(sc_type_arc_common | sc_type_const, generatedLink, generatedLink4).done(function (generatedCommonArc) {
                        window.sctpClient.create_arc(sc_type_arc_pos_const_perm, nrel_number_of_pages, generatedCommonArc);
                    });

                });

                window.sctpClient.create_link().done(function (generatedLink5) {
                    window.sctpClient.set_link_content(generatedLink5, document.getElementById(input5).value);
                    window.sctpClient.create_arc(sc_type_arc_common | sc_type_const, generatedLink, generatedLink5).done(function (generatedCommonArc) {
                        window.sctpClient.create_arc(sc_type_arc_pos_const_perm, nrel_published, generatedCommonArc);
                    });

                });

            });

        });
    }
};


function _generateNodesValue (addr_id) {
    var main_menu_addr, nrel_main_idtf_addr, lang_en_addr;
    // Resolve sc-addr. Get sc-addr of ui_main_menu node
    SCWeb.core.Server.resolveScAddr([addr_id, 'concept_quantity', 'nrel_value'], function (keynodes) {
        main_menu_addr = keynodes[addr_id];
        nrel_main_idtf_addr = keynodes['nrel_value'];
        lang_en_addr = keynodes['concept_quantity'];

        window.sctpClient.create_link().done(function (generatedLink) {
            window.sctpClient.set_link_content(generatedLink, document.getElementById(addr_id).value);
            window.sctpClient.create_arc(sc_type_arc_common | sc_type_const, main_menu_addr, generatedLink).done(function (generatedCommonArc) {
                window.sctpClient.create_arc(sc_type_arc_pos_const_perm, nrel_main_idtf_addr, generatedCommonArc);
            });
            window.sctpClient.create_arc(sc_type_arc_pos_const_perm, lang_en_addr, generatedLink);
        });

    });
}
