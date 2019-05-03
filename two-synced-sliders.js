import {Module} from "../module";

/**
 * Script for two synced sliders
 *
 * @param options
 * @constructor
 */
function TwoSyncedSliders(options) {
    let self = this;
    let complete = 0;

    this.options = options;
    this.predefined_options = {
        sync_sliders_cont: 'js-sync-sliders',
        sync_slider: 'js-sync-slider',
        sync_slider1: 'js-sync-slider1',
        sync_slider2: 'js-sync-slider2'
    };

    this.super();

    init();

    // ------------
    // Инициализация
    // ------------

    function init() {
        setVars();

        if (self.cache('sync_sliders_cont').length === 0) {
            return;
        }
        setEvents();
    }

    function setVars() {
        self.cache('sync_sliders_cont', $(`.${self.options.sync_sliders_cont}`));
        self.cache('sync_slider', $(`.${self.options.sync_slider}`));
        self.cache('sync_slider1', $(`.${self.options.sync_slider1}`));
        self.cache('sync_slider2', $(`.${self.options.sync_slider2}`));
    }

    function setEvents() {

        self.cache('sync_sliders_cont').each(function(i, el){
            let $first_sync_slider = $(this).find(self.cache('sync_slider1'));
            let $second_sync_slider = $(this).find(self.cache('sync_slider2'));

            initSliders($first_sync_slider, $second_sync_slider);
        });
        self.cache('sync_slider1').on("click", ".owl-item", onToSlide);
    }

    // ------------
    // События
    // ------------

    function onToSlide(e){
        let number = parseInt($(this).find('.js-sync-slider-item').data('id'));
        let $this_slider = $(this).closest('.js-sync-slider');
        let $next_slider = $(this).closest('.js-sync-slider').next();
        $this_slider.trigger("to.owl.carousel", [number - 1, 300, true]);
        $next_slider.trigger("to.owl.carousel", [number - 1, 300, true]);
    }

    // ------------
    // Методы
    // ------------

    function onAllSlidersInit($s1_next, $s1_prev, $s2_next, $s2_prev) {
        $s1_next.click(function () {
            $s2_next.click();
        });

        $s1_prev.click(function () {
            $s2_prev.click();
        });
    }

    function getNavVariable ($first_sync_slider, $second_sync_slider) {
        setTimeout(function () {
            let $s1_prev = $first_sync_slider.closest('.js-sync-sliders').find('.js-sync-sliders-nav .owl-prev');
            let $s1_next = $first_sync_slider.closest('.js-sync-sliders').find('.js-sync-sliders-nav .owl-next');
            let $s2_next = $second_sync_slider.find('.owl-next');
            let $s2_prev = $second_sync_slider.find('.owl-prev');
            if (complete !== 1) complete++;
            else onAllSlidersInit($s1_next, $s1_prev, $s2_next, $s2_prev);
        }, 200);
    }

    function initSliders($first_sync_slider, $second_sync_slider) {
        
            $first_sync_slider.on('initialized.owl.carousel', function () {
                getNavVariable($first_sync_slider, $second_sync_slider);
            });

            $first_sync_slider.owlCarousel({
                items: $first_sync_slider.hasClass('js-sync-slide-with-thumbnails') ? 5 : 3,
                loop: true,
                center: true,
                margin: 10,
                nav: true,
                navText: ['',''],
                navContainer: $first_sync_slider.closest('.js-sync-sliders').find('.js-sync-sliders-nav'),
                dots: false,
            });

            $first_sync_slider.on("dragged.owl.carousel", function (event) {
                let direction = event.relatedTarget['_drag']['direction'];
                let $active_slide = $first_sync_slider.find('.owl-item.center');
                let active_slide_id = parseInt($active_slide.find('.js-sync-slider-item').data('id'));

                if (direction === 'right') {
                    $second_sync_slider.trigger("to.owl.carousel", [active_slide_id - 1, 300, true]);
                } else {
                    $second_sync_slider.trigger("to.owl.carousel", [active_slide_id - 1, 300, true]);
                }
            });

            $second_sync_slider.on('initialized.owl.carousel', function () {
                getNavVariable($first_sync_slider, $second_sync_slider);
            });

            $second_sync_slider.owlCarousel({
                items: 1,
                loop: true,
                margin: 10,
                nav: true,
                dots: false,
            });
            $second_sync_slider.on("dragged.owl.carousel", function (event) {
                let direction = event.relatedTarget['_drag']['direction'];

                if (direction === 'right') {
                    $first_sync_slider.trigger('prev.owl.carousel');
                } else {
                    $first_sync_slider.trigger('next.owl.carousel');
                }
            });

            self.cache('sync_slider').css('opacity', 1);
    }
}

TwoSyncedSliders.prototype = new Module();


export {TwoSyncedSliders};
