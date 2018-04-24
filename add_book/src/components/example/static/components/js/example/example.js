/* --- src/example-common.js --- */
var Example = {};

function extend(child, parent) {
    var F = function () {
    };
    F.prototype = parent.prototype;
    child.prototype = new F();
    child.prototype.constructor = child;
    child.superclass = parent.prototype;
}


/* --- src/example-paintPanel.js --- */
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


/* --- src/example-component.js --- */
/**
 * Example component.
 */
Example.DrawComponent = {
    ext_lang: 'add_book',
    formats: ['add_book_json'],
    struct_support: true,
    factory: function (sandbox) {
        return new Example.DrawWindow(sandbox);
    }
};

Example.DrawWindow = function (sandbox) {
    this.sandbox = sandbox;
    this.paintPanel = new Example.PaintPanel(this.sandbox.container);
    this.paintPanel.init();
    this.recieveData = function (data) {
        console.log("in recieve data" + data);
    };

    var scElements = {};

    function drawAllElements() {
        var dfd = new jQuery.Deferred();
       // for (var addr in scElements) {
            jQuery.each(scElements, function(j, val){
                var obj = scElements[j];
                if (!obj || obj.translated) return;
// check if object is an arc
                if (obj.data.type & sc_type_arc_pos_const_perm) {
                    var begin = obj.data.begin;
                    var end = obj.data.end;
                    // logic for component update should go here
                }

        });
        SCWeb.ui.Locker.hide();
        dfd.resolve();
        return dfd.promise();
    }

// resolve keynodes
    var self = this;
    this.needUpdate = false;
    this.requestUpdate = function () {
        var updateVisual = function () {
// check if object is an arc
            var dfd1 = drawAllElements();
            dfd1.done(function (r) {
                return;
            });


/// @todo: Don't update if there are no new elements
            window.clearTimeout(self.structTimeout);
            delete self.structTimeout;
            if (self.needUpdate)
                self.requestUpdate();
            return dfd1.promise();
        };
        self.needUpdate = true;
        if (!self.structTimeout) {
            self.needUpdate = false;
            SCWeb.ui.Locker.show();
            self.structTimeout = window.setTimeout(updateVisual, 1000);
        }
    }
    
    this.eventStructUpdate = function (added, element, arc) {
        window.sctpClient.get_arc(arc).done(function (r) {
            var addr = r[1];
            window.sctpClient.get_element_type(addr).done(function (t) {
                var type = t;
                var obj = new Object();
                obj.data = new Object();
                obj.data.type = type;
                obj.data.addr = addr;
                if (type & sc_type_arc_mask) {
                    window.sctpClient.get_arc(addr).done(function (a) {
                        obj.data.begin = a[0];
                        obj.data.end = a[1];
                        scElements[addr] = obj;
                        self.requestUpdate();
                    });
                }
            });
        });
    };
// delegate event handlers
    this.sandbox.eventDataAppend = $.proxy(this.receiveData, this);
    this.sandbox.eventStructUpdate = $.proxy(this.eventStructUpdate, this);
    this.sandbox.updateContent();
};
SCWeb.core.ComponentManager.appendComponentInitialize(Example.DrawComponent);


